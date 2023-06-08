//观看历史
import {Realm} from '@realm/react';
import ListItemInfo from '../type/ListItemInfo';
import {UpdateMode} from 'realm';
import Episode from '../type/Download/Episode';

export default class HistoryDb extends Realm.Object {
  infoUrl!: string;
  taskUrl!: string;
  time!: number; //时间戳
  progress!: number; //观看的进度
  progressPer!: number; //观看进度百分比
  title!: string; //名字

  static update(
    realm: Realm,
    infoUrl: string,
    episodes: Episode[],
    taskUrl?: string,
  ) {
    let history = realm.objectForPrimaryKey(HistoryDb, infoUrl);
    if(!!history) { //如果历史记录存在，则直接更新就可以了
        realm.write(()=>{
          history!.time =  new Date().getTime()
          if(!!taskUrl && history!.taskUrl !== taskUrl) {
            history!.progress = 0
            history!.progressPer = 0
            history!.taskUrl = taskUrl
            history!.title = episodes.find(obj=>obj.taskUrl==taskUrl)!.title
          }
        })
    }
    else {
      realm.write(()=>{
        if(!taskUrl) {
          taskUrl = episodes[0].taskUrl
        }
        history = realm.create(
          HistoryDb,
          {
            infoUrl,
            time: new Date().getTime(),
            taskUrl,
            progress: 0,
            progressPer: 0,
            title: episodes.find(obj=>obj.taskUrl==taskUrl)!.title,
          },
          UpdateMode.Modified,
        );
      })
    }
    return history;
  }

  extract() {
    return {
      time: this.time,
      taskUrl: this.taskUrl,
      progress: this.progress,
      progressPer: this.progressPer,
      anthologyTitle: this.title,
    }
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'HistoryDb',
    primaryKey: 'infoUrl',
    properties: {
      infoUrl: 'string',
      taskUrl: 'string',
      progress: 'float',
      progressPer: 'float',
      title: 'string',
      time: 'int',
    },
  };
}
