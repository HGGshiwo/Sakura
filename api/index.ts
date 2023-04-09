import { parseDocument } from 'htmlparser2';
import * as Anime from "./Anime"
import * as Comic from "./Comic"
import * as Novel from "./Novel"
import { selectAll, selectOne } from 'css-select';
import { getAttributeValue, innerText } from 'domutils';
import { Element } from 'domhandler';
import { Route } from 'react-native-tab-view';

const err_img = 'https://s1.hdslb.com/bfs/static/laputa-home/client/assets/load-error.685235d2.png';

//允许进行的函数
type Func = {
  "name": "addbase" | "imgsafe" | "regexec" | "replace" | string,
  "arg1"?: string;
  "arg2"?: string;
}

type ApiConfig = {
  selector?: string | string[]; //查询语句
  type?: string; //节点类型,list: [any], string, 默认为string
  attr?: any; //想要获取的attribute，默认为innerHTML
  value?: any | any[]; //list 类型，
  func?: Func[]
};

type TabConfig = {
  name: string,
  routes: Route[];
  pages: Record<string, PageConfig>
}

type PageConfig = { baseUrl?: string, data: Record<string, ApiConfig> };
type AppConfig = Record<string, Record<string, TabConfig>>

const appConfig: AppConfig = { Anime }

const getData = (elem: Element, configValue: ApiConfig, apiName: string) => {
  if (configValue.selector === undefined) {
    if (configValue.type === "list") return []
    if (configValue.type === undefined) return ''
    if (configValue.type === "raw") return configValue //如果没有select，说明是一个写死的数据
  }
  let result: any;
  if (configValue.type === 'list') {
    //如果selector是一个数组，那么需要同时遍历
    if (Array.isArray(configValue.selector)) {
      if (configValue.selector.length !== configValue.value.length) {
        throw Error("selector数组长度和value数组长度不相等.")
      }
      //item2d第一个维度是不同的selector，第二个维度是一个数组
      const item2d = configValue.selector.map(selector => selectAll(selector, elem))
      result = item2d[0].map((_, i) => {
        let listValue: Record<string, any> = {};
        //在第一个维度遍历
        if (!item2d) {
          console.log(`${apiName} item2d is null`)
          return
        }
        item2d.forEach((item1d, j) => {
          if (!configValue.value[j]) {
            console.log(`${apiName} configValue.value[${j}] is null`)
            return;
          }
          Object.entries(configValue.value[j] as Record<string, ApiConfig>).forEach(
            ([itemName, itemConfig]) => {
              listValue[itemName] = getData(item1d[i], itemConfig, apiName)!;
            },
          );
        })
        listValue.apiName = apiName;
        return listValue;
      })
    }
    else {//如果selector是一个string，那么正常的做就行
      result = selectAll(configValue.selector as string, elem).map(dom => {
        let listValue: Record<string, any> = {};
        if (!configValue.value) {
          console.log(`${apiName} ${configValue.selector} is null`)
        }
        Object.entries(configValue.value as Record<string, ApiConfig>).forEach(
          ([itemName, itemConfig]) => {
            listValue[itemName] = getData(dom, itemConfig, apiName)!;
          },
        );
        listValue.apiName = apiName;
        return listValue;
      })
    }
  } else {
    const { attr } = configValue;
    let childElem = configValue.selector !== "*" ? selectOne(configValue.selector as any, elem) : elem;
    if (!childElem) {
      result = ''; //查找不到
    }
    else if (!!attr) {
      result = getAttributeValue(childElem, attr)
    }
    else if ((configValue.selector as string).includes('script')) {
      result = (childElem.children[0] as any).data
    }
    else {
      result = innerText(childElem);
    }
  }
  //进行函数处理
  if (configValue.func) {
    result = configValue.func.reduce((pre, cur) => {
      if (cur.name === "regexec") {
        return RegExp(cur.arg1!).exec(pre!)![0]
      }
      else if (cur.name === "addbase") {
        return cur.arg1 + pre
      }
      else if (cur.name === "imgsafe") {
        return (result === '/' || result?.includes('None')) ? err_img : result
      }
      else if (cur.name === "replace") {
        return pre?.split(RegExp(cur.arg1!)).join(cur.arg2!)
      }
      else if (cur.name === "sort") {
        var collator = new Intl.Collator([], { numeric: true });
        const key = cur.arg1!
        return pre?.sort((a: any, b: any) => collator.compare(a[key], b[key]));
      }
    }, result)
  }
  return result;
};


const parseConfig = () => {
  const api: Record<string, Record<string, Record<string, any>>> = {};
  Object.entries(appConfig).forEach(([tabName, tabObj]) => {
    api[tabName] = {}
    Object.entries(tabObj).forEach(([apiName, apiObj]) => {
      api[tabName][apiName] = {
        "routes": [...apiObj.routes],
        "name": apiObj.name,
        "pages": {}
      }
      Object.entries(apiObj.pages).map(([pageName, pageObj]) => {
        api[tabName][apiName].pages[pageName] = (
          url: string,
          resolve: (data: any) => void,
          reject: (data: string) => void,
        ) => {
          const data: any = {};
          //对url 进行处理
          let _url = pageObj.baseUrl !== undefined ? pageObj.baseUrl + url : url;
          fetch(_url)
            .then(response => response.text())
            .then(responseText => {
              const document = parseDocument(responseText) as unknown as Element;
              //每个数据都query一次
              if (!pageObj.data) {
                console.log(`${apiName} ${pageName}.data is null`)
                return;
              }
              Object.entries(pageObj.data).forEach(([itemName, configValue]) => {
                data[itemName] = getData(document, configValue, apiName);
              });
              //返回query结果
              resolve(data);
            })
            .catch(err => {
              reject(`${err}`);
            });
        };
      });
    });
  });
  return api;
}


export default parseConfig;
