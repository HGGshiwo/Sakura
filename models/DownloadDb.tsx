// 下载信息，只记录下载完成的
import {Realm} from '@realm/react';
import {UpdateMode} from 'realm';
import TaskDb from './TaskDb';
import Task from '../type/Download/Task';
import DownloadItem from '../type/Download/DownloadItem';

export default class DownloadDb extends Realm.Object {
  infoUrl!: string; //信息页的url
  tasks!: Realm.List<TaskDb>; //选集对应的每一集

  //新建一个下载任务
  static create(realm: Realm, infoUrl: string, taskUrl: string, title: string) {
    // debugger;
    //查看选集是否存在
    let section = realm.objectForPrimaryKey(DownloadDb, infoUrl)!;
    if (!section) {
      realm.write(() => {
        section = realm.create(
          DownloadDb,
          {
            infoUrl,
            tasks: [],
          },
          UpdateMode.Modified,
        );
      });
    }
    //查看该任务是否存在
    const index = section.tasks.findIndex(
      taskObj => taskObj.taskUrl === taskUrl,
    );
    if (index === -1) {
      realm.write(() => {
        let taskDb = {
          taskUrl,
          tos: [],
          froms: [],
          finish: false,
          title,
        };
        section.tasks = [...section.tasks, taskDb as any] as any;
      });
    }
    return section;
  }

  //更新froms
  static updateFroms(
    realm: Realm,
    taskUrl: string,
    infoUrl: string,
    froms: string[],
  ) {
    const section = realm.objectForPrimaryKey(DownloadDb, infoUrl)!;
    let task = section.tasks.find(taskObj => taskObj.taskUrl === taskUrl)!;
    realm.write(() => {
      task.froms = froms;
    });
    return section;
  }

  //完成一个子任务时调用
  static done(realm: Realm, task: Task) {
    const {infoUrl, taskUrl} = task;
    let download = realm.objectForPrimaryKey(DownloadDb, infoUrl)!;
    let taskDb = download.tasks.find(taskObj => taskObj.taskUrl === taskUrl)!;
    realm.write(() => {
      const froms = taskDb.froms.filter(url => url !== task.from);
      taskDb.froms = froms;
      taskDb.finish = froms.length === 0;
      taskDb.tos.push(task.to);
      download.tasks.push(taskDb);
    });
    return download;
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".

  static schema = {
    name: 'DownloadDb',
    primaryKey: 'infoUrl',
    properties: {
      infoUrl: 'string',
      tasks: 'Task[]',
    },
  };
}
