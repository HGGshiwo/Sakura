//观看历史
import {Realm} from '@realm/react';

export default class HistoryDb extends Realm.Object {
  infoUrl!: string;
  taskUrl!: string;
  time!: number; //时间戳
  progress!: number; //观看的进度
  progressPer!: number; //观看进度百分比
  title!: string; //名字

  extract() {
    return {
      time: this.time,
      taskUrl: this.taskUrl,
      progress: this.progress,
      progressPer: this.progressPer,
      anthologyTitle: this.title,
    };
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
