import {createContext, useEffect, useRef, useState} from 'react';
import RNFS, {DocumentDirectoryPath} from 'react-native-fs';
import {TabName} from '../route';
import Download from '../models/Download';
import Context from '../models';
import Task from '../type/Task';
//下载的单位是章节/一集，现实的进度也是一个章节的进度

const DownloadContext = createContext<{
  download: (infoUrl: string, url: string, tabName: TabName) => void;
}>({
  download: (infoUrl, url, tabName) => {},
});

/**
 * 获得m3u8文件内容
 * @param url 远程的m3u8文件地址
 **/
const getM3u8Text = async (baseUrl: string, url: string): Promise<string> => {
  const _url = url.includes('http') ? url : baseUrl + url;
  return fetch(_url)
    .then(response => response.text())
    .then(responseText => {
      //去掉注释
      let urls = responseText.split('\n').filter(a => a && a[0] === '#');
      if (urls.length == 1 && /.m3u8$/.test(urls[0])) {
        let newUrl = urls[0].includes('http') ? urls[0] : baseUrl + urls[0];
        return getM3u8Text(baseUrl, newUrl); //内嵌m3u8链接
      } else {
        return responseText;
      }
    });
};

const DownloadWrapper: React.FC<{children: any}> = ({children}) => {
  const {useRealm, useQuery} = Context;
  const taskQue = useRef<Task[]>([]);
  const realm = useRealm();
  const activeNum = useRef(0);
  const [totalNum, setTotalNum] = useState(4);

  // 下载单个的ts文件
  const downloadTs = (task: Task) => {
    const {promise} = RNFS.downloadFile({fromUrl: task.from, toFile: task.to});
    promise.then(() => {
      Download.done(realm, task); //修改数据库中的数据
      activateTask();
    });
  };

  // 激活一个新的任务
  const activateTask = () => {
    if (activeNum.current < totalNum) {
      //可调度的任务数量
      let waitNum = Math.min(
        totalNum - activeNum.current,
        taskQue.current.length,
      );
      taskQue.current.splice(0, waitNum).forEach(task => {
        if (task.tabName == 'Anime') {
          downloadTs(task);
        }
      });
      activeNum.current = totalNum;
    }
  };

  /**
   * 对一集或者一章进行下载操作
   * @param infoUrl 番剧的id
   * @param url 该集的id
   * @param tabName 如何处理数据
   **/
  const download = (infoUrl: string, url: string, tabName: TabName) => {
    //新建一个文件存放下载的ts文件
    Download.create(realm, infoUrl, url, tabName);
    const infoName = infoUrl.split(/:|[/]/).join('');
    const urlName = url.split(/:|[/]/).join('');
    const fileName = `${RNFS.DocumentDirectoryPath}/${infoName}/${urlName}`;
    RNFS.mkdir(fileName)
      .then(res => {
        //需要获取到base url用来计算m3u8中的ts地址
        const baseRegx =
          /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/g;
        const baseUrl = baseRegx.exec(url)![0];

        //url映射到本地路径
        const getTo = (url: string) => {
          if (!/^#\w+/.test(url) && url) {
            return url; //注释
          }
          if (url.includes('http')) {
            return `${fileName}/${url.split(/:|[/]/).join('')}`; // https://xxx.ts => /httpsxxx.ts
          } else {
            return `${fileName}/${url}`; // /xxx.ts=>/xxx.ts
          }
        };
        getM3u8Text(baseUrl, url).then(responseText => {
          const m3u8Texts = responseText.split('\n');
          const contents = m3u8Texts.map(getTo).join('\n');
          const froms = m3u8Texts
            .filter(a => !/^#\w+/.test(a) && a) //去掉注释
            .map(item => {
              const from = item.includes('http') ? item : baseUrl + item;
              const to = getTo(item);
              taskQue.current.push({
                from,
                to,
                downloadId: url,
                tabName: tabName,
              });
              return from;
            });

          RNFS.writeFile(fileName + '/index.m3u8', contents).catch(err => {
            console.log('write failed: ', err);
          });
          Download.updateFroms(realm, url, froms);
        });
      })
      .catch(err => {
        console.log('mkdir failed: ', err);
      });
  };

  return <DownloadContext.Provider value={{download}} children={children} />;
};

export default DownloadWrapper;
export {DownloadContext};
