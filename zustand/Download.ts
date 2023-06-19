import RNFS from 'react-native-fs';
import { create } from 'zustand'
import SectionDb from '../models/SectionDb';
import { TaskDbUtile } from '../models/utils';
import { InteractionManager } from 'react-native';

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
  remote: string, //完整的地址，https://xxx.m3u8
  local: string, //本地地址，不包含最后一项
  fileName: string, //希望写入的m3u8文件名称
  done: (progress: number) => void,
) => {
  fetch(remote)
    .then(response => response.text())
    .then(async responseText => {
      const urls = responseText
        .split('\n')
        .filter(url => url[0] !== '#' && !!url);
      const content = responseText.split('\n').map(getLocalPath).join('\n');
      //重新保存到本地
      RNFS.writeFile(fileName, content).catch(err => {
        console.log('write failed: ', err);
      });
      //如果是嵌入的
      if (urls.length === 1 && urls[0].includes('.m3u8')) {
        const remoteM3u8 = getRemotePath(remote, urls[0]);
        let newFileName = local + '/' + getLocalPath(urls[0])
        downloadM3u8(remoteM3u8, local, newFileName, done);
        return;
      }
      //如果是非嵌入的
      let doneNum = 0;
      const promises = urls.map(item => {
        const from = getRemotePath(remote, item);
        const to = local + '/' + getLocalPath(item);
        const downloadFile = (times: number) => {
          if (times == 3) return;
          times += 1;
          return RNFS.downloadFile({ fromUrl: from, toFile: to })
            .promise.then(() => {
              doneNum += 1;
              done(doneNum / urls.length);
            })
            .catch(err => {
              downloadFile(times);
            });
        };
        return downloadFile;
      });
      let size = 1;
      InteractionManager.runAfterInteractions(async () => {
        for (let i = 0; i < promises.length; i += size) {
          let chunk = promises.slice(i, i + size);
          await Promise.all(chunk.map(c => c(0)))
        }
      });
    });
};

type Task = {
  taskUrl: string;
  infoUrl: string;
  m3u8Url: string;
  title: string;
};

type Download = (taskUrl: string, infoUrl: string, m3u8Url: string, title: string, realm: Realm, downloadDone: any) => void;
type _Download = (taskUrl: string, infoUrl: string, m3u8Url: string, realm: Realm, downloadDone: any) => void;

interface State {
  taskQue: Task[], value: number,
}
interface Action {
  download: Download, _download: _Download
}
const useDownload = create<State & Action>((set, get) => {
  return {
    taskQue: [],
    value: 4,
    _download: (taskUrl: string, infoUrl: string, m3u8Url: string, realm: Realm, downloadDone: any) => {
      //立即下载不进行等待
      //新建一个文件存放下载的ts文件
      const infoName = infoUrl.split(/:|[/]/).join('');
      const urlName = taskUrl.split(/:|[/]/).join('');
      const fileName = `${RNFS.DocumentDirectoryPath}/${infoName}/${urlName}`;

      RNFS.mkdir(fileName)
        .then(() => {
          //如果下载了，则把该集的episode的playerData改写掉
          let section = realm.objectForPrimaryKey(SectionDb, infoUrl)!
          let episode = section.episodes.find(obj => obj.taskUrl === taskUrl)!
          const playerSrc = JSON.stringify({ type: 'm3u8', uri: `${fileName}/index.m3u8` })
          realm.write(() => {
            episode.playerSrc = playerSrc
          })
          downloadDone(infoUrl, taskUrl, playerSrc)
          downloadM3u8(m3u8Url, fileName, `${fileName}/index.m3u8`, progress => {
            TaskDbUtile.update(realm, infoUrl, taskUrl, progress);
            if (progress == 1) {
              let { value, taskQue, _download } = get()
              value += 1;
              if (taskQue.length !== 0) {
                const { taskUrl, infoUrl, m3u8Url } = taskQue.splice(0, 1)[0];
                _download(taskUrl, infoUrl, m3u8Url, realm, downloadDone);
              }
              set({ value, taskQue })
            }
          })
        })
        .catch(err => console.log('mkdir failed: ', err))
    },
    download: (taskUrl: string, infoUrl: string, m3u8Url: string, title: string, realm, downloadDone) => {
      let { value, taskQue, _download } = get()
      value -= 1;
      set({ value })
      if (value < 0) {
        taskQue = [...taskQue, { taskUrl, infoUrl, m3u8Url, title }];
        set({ taskQue })
      }
      else {
        _download(taskUrl, infoUrl, m3u8Url, realm, downloadDone)
      }
    }
  }
})

export default useDownload;