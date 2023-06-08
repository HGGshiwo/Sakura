import {createContext, useRef, useState} from 'react';
import RNFS from 'react-native-fs';
import SectionDb from '../models/SectionDb';
import Context from '../models';
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

const downloadM3u8 = (
  remote: string,
  local: string,
  done: (progress: number) => void,
) => {
  fetch(remote)
    .then(response => response.text())
    .then(async responseText => {
      const urls = responseText
        .split('\n')
        .filter(url => url[0] !== '#' && !!url);
      const content = responseText.split('\n').map(getLocalPath).join('\n');
      //如果是嵌入的
      if (urls.length === 1 && urls[0].includes('.m3u8')) {
        const remoteM3u8 = getRemotePath(remote, urls[0]);
        const localM3u8 = getLocalPath(urls[0])
        RNFS.writeFile(local + '/' + localM3u8, content).catch(err => {
          console.log('write failed: ', err);
        });
        downloadM3u8(remoteM3u8, local, done);
        return;
      }
      //如果是非嵌入的
      RNFS.writeFile(local, content).catch(err => {
        console.log('write failed: ', err);
      });
      let doneNum = 0;
      const promises = urls.map(item => {
        const from = getRemotePath(remote, item);
        const to = local + '/' + getLocalPath(item);
        const downloadFile = (times: number) => {
          if (times == 3) return;
          times += 1;
          RNFS.downloadFile({fromUrl: from, toFile: to})
            .promise.then(() => {
              doneNum += 1;
              done(doneNum / urls.length);
            })
            .catch(err => {
              downloadFile(times);
            });
        };
        return downloadFile(0);
      });
      let size = 4;
      let chunks = [];
      for (let i = 0; i < promises.length; i += size) {
        let chunk = promises.slice(i, i + size);
        chunks.push(chunk);
      }
      for await (const chunk of chunks) {
        Promise.all(chunk);
      }
    });
};

type Task = {
  taskUrl: string;
  infoUrl: string;
  m3u8Url: string;
  title: string;
};

const DownloadWrapper: React.FC<{children: any}> = ({children}) => {
  const {useRealm, useQuery} = Context;
  const realm = useRealm();
  const [taskQue, setTaskQue] = useState<Task[]>([]);
  const value = useRef(4); //信号量

  /**
   * 对一集或者一章进行下载操作
   * @param taskUrl 该集的url
   * @param infoUrl 番剧的id
   * @param m3u8Url m3u8结尾的url
   * @param title 显示的标题
   **/
  const download = (
    taskUrl: string,
    infoUrl: string,
    m3u8Url: string,
    title: string,
  ) => {
    value.current -= 1;
    if (value.current < 0) {
      setTaskQue([...taskQue, {taskUrl, infoUrl, m3u8Url, title}]);
      return;
    }
    //新建一个文件存放下载的ts文件
    const infoName = infoUrl.split(/:|[/]/).join('');
    const urlName = taskUrl.split(/:|[/]/).join('');
    const fileName = `${RNFS.DocumentDirectoryPath}/${infoName}/${urlName}`;
    RNFS.mkdir(fileName)
      .then(res => {
        downloadM3u8(m3u8Url, fileName, progress => {
          SectionDb.update(realm, infoUrl, taskUrl, progress);
          if (progress == 1) {
            value.current += 1;
            if (taskQue.length !== 0) {
              const {taskUrl, infoUrl, m3u8Url, title} = taskQue.pop()!;
              download(taskUrl, infoUrl, m3u8Url, title);
            }
          }
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
