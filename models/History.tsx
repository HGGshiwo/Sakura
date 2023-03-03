//观看历史
import { Realm } from '@realm/react';

export default class History extends Realm.Object {
  href!: string;
  time!: number; //时间戳
  anthologyIndex!: number; //观看的选集
  progress!: number; //观看的进度
  progressPer!: number; //观看进度百分比
  anthologyTitle!: string; //名字

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'History',
    primaryKey: 'href',
    properties: {
      href: 'string',
      anthologyIndex: 'int',
      progress: 'float',
      progressPer: 'float',
      anthologyTitle: 'string',
      time: 'int',
    },
  };
}
