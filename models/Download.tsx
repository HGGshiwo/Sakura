// 下载信息，只记录下载完成的
import {Realm} from '@realm/react';
import {TabName} from '../route';
import {UpdateMode} from 'realm';
import Task from '../type/Task';

export default class Download extends Realm.Object {
  id!: string; //第n集的url
  tabName!: TabName; //应该如何处理下载的数据
  froms!: string[]; //文件下载的网址
  tos!: string[]; //下载完成的位置
  infoUrl!: string; //信息页的url
  finish!: boolean; //是否已完成，如果已完成就直接打开

  //新建一个下载任务
  static create(realm: Realm, infoUrl: string, url: string, tabName: TabName) {
    //查看task是否存在
    let task = realm.objectForPrimaryKey(Download, url)!;
    if (!task) {
      switch (tabName) {
        case 'Anime':
          //获取u3m8文件
          realm.write(() => {
            task = realm.create(
              Download,
              {
                id: url,
                tabName,
                tos: [],
                froms: [],
                infoUrl,
                finish: false,
              },
              UpdateMode.Modified,
            );
          });
          break;
        case 'Comic':
          break;
        case 'Novel':
          break;
      }
    }
    return task;
  }

  //更新froms
  static updateFroms(realm: Realm, url: string, froms: string[]) {
    const task = realm.objectForPrimaryKey(Download, url)!;
    realm.write(() => {
      task.froms = froms;
    });
    return task;
  }

  //完成一个子任务时调用
  static done(realm: Realm, task: Task) {
    let download = realm.objectForPrimaryKey(Download, task.downloadId)!;
    realm.write(() => {
      const froms = download.froms.filter(url => url !== task.from);
      const finish = froms.length === 0;
      download = realm.create(
        Download,
        {
          id: task.downloadId,
          finish,
          froms,
          tos: [...download.tos, task.to],
        },
        UpdateMode.Modified,
      );
    });
    return download;
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Download',
    primaryKey: 'id',
    properties: {
      id: 'string',
      tabName: 'string',
      doneUrls: 'string[]',
      waitUrls: 'string[]',
      infoUrl: 'string',
      finish: 'bool',
    },
  };
}
