// 下载信息，只记录下载完成的
import RNBackgroundDownloader from '@kesha-antonov/react-native-background-downloader';
import {Realm} from '@realm/react';
import {TabName} from '../route';

//download 只允许开始下载和结束下载，不允许中断后再下载
export default class Download extends Realm.Object {
  destination!: string; //下载的位置
  tabName!: TabName;
  url!: string; //信息页
  key!: string; //选集的key
  taskId!: string; //url_key
  done!: boolean; //是否下载完成
  expectedBytes!: number; //需要下载的大小

  static getDestination(url: string, type: string) {
    let _url = (url as any).replace(/\W/g, '');
    return `${RNBackgroundDownloader.directories.documents}/${_url}.${type}`;
  }

  static getTaskId(title: string, key: string | number) {
    return `${title}_${key}`;
  }
  static generate(
    url: string,
    key: string | number,
    tabName: TabName,
    destination: string,
    expectedBytes: number,
  ) {
    return {
      taskId: Download.getTaskId(url, key),
      url: url,
      key: `${key}`,
      destination,
      tabName,
      expectedBytes,
      done: false,
    };
  }
  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Download',
    primaryKey: 'taskId',
    properties: {
      destination: 'string',
      tabName: 'string',
      url: 'string',
      key: 'string',
      taskId: 'string',
      done: 'bool',
      expectedBytes: 'int',
    },
  };
}
