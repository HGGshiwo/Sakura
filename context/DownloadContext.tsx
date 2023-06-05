import {createContext, useEffect, useRef, useState} from 'react';
import RNFS, {DocumentDirectoryPath} from 'react-native-fs';
import {TabName} from '../route';
import Download from '../models/DownloadDb';
import Context from '../models';
import Task from '../type/Download/Task';
import RecmdInfoDb from '../models/RecmdInfoDb';
import DownloadItem from '../type/Download/DownloadItem';
//下载的单位是章节/一集，现实的进度也是一个章节的进度

const DownloadContext = createContext<{
  download: (
    data: string,
    infoUrl: string,
    m3u8Url: string,
    title: string,
  ) => void;
}>({
  download: (data, infoUrl, m3u8Url, title) => {},
});

//获取到ts的完整路径
const getRemotePath = (m3u8Url: string, tsUrl: string) => {
  if (tsUrl[0] === '/') {
    // /xxx.ts
    const baseRegx = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/g;
    const baseUrl = baseRegx.exec(m3u8Url)![0];
    return baseUrl + tsUrl;
  } else {
    let baseUrl = m3u8Url.split('/').slice(0, -1).join('/');
    return baseUrl + '/' + tsUrl;
  }
};

//tsUrl映射到本地路径
const getLocalPath = (tsUrl: string) => {
  if (/^#\w+/.test(tsUrl)) {
    return tsUrl; //注释
  }
  if (tsUrl[0] === '/') {
    tsUrl = tsUrl.replace('/', ''); // /xxx.ts => xxx.ts
  }
  return tsUrl.split(/:|[/]/).join('');
};

/**
 * 获得m3u8文件内容
 * @param url 远程的m3u8文件地址
 **/
const getM3u8Text = async (url: string): Promise<string> => {
  return fetch(url)
    .then(response => response.text())
    .then(responseText => {
      //去掉注释
      let urls = responseText.split('\n').filter(a => a && a[0] === '#');
      if (urls.length == 1 && /.m3u8$/.test(urls[0])) {
        let newUrl = getRemotePath(url, urls[0]);
        return getM3u8Text(newUrl); //内嵌m3u8链接
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
        const info = realm.objectForPrimaryKey(RecmdInfoDb, task.infoUrl)!;
        if (info.tabName == 'Anime') {
          downloadTs(task);
        }
      });
      activeNum.current = totalNum;
    }
  };

  /**
   * 对一集或者一章进行下载操作
   * @param data 该集的url
   * @param infoUrl 番剧的id
   * @param m3u8Url m3u8结尾的url
   * @param title 显示的标题
   **/
  const download = (
    data: string,
    infoUrl: string,
    m3u8Url: string,
    title: string,
  ) => {
    //新建一个文件存放下载的ts文件
    Download.create(realm, infoUrl, data, title);
    const infoName = infoUrl.split(/:|[/]/).join('');
    const urlName = data.split(/:|[/]/).join('');
    const fileName = `${RNFS.DocumentDirectoryPath}/${infoName}/${urlName}`;
    RNFS.mkdir(fileName)
      .then(res => {
        getM3u8Text(m3u8Url).then(responseText => {
          const m3u8Texts = responseText.split('\n');
          const contents = m3u8Texts.map(getLocalPath).join('\n');
          const froms = m3u8Texts
            .filter(a => !/^#\w+/.test(a) && a) //去掉注释
            .map(item => {
              const from = getRemotePath(m3u8Url, item);
              const to = fileName + '/' + getLocalPath(item);
              taskQue.current.push({
                from,
                to,
                infoUrl,
                taskUrl: data,
                title,
              });
              return from;
            });

          RNFS.writeFile(fileName + '/index.m3u8', contents).catch(err => {
            console.log('write failed: ', err);
          });
          Download.updateFroms(realm, data, infoUrl, froms);
          activateTask();
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
