import { Realm, createRealmContext } from '@realm/react';
import { HistoryInfo } from '../type/HistoryInfo';

//观看历史
export class History extends Realm.Object implements HistoryInfo {

  href!: string;
  img!: string;
  state!: string;
  title!: string;
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
      img: 'string',
      state: 'string',
      title: 'string',
      anthologyIndex: 'int',
      progress: 'float',
      progressPer: 'float',
      anthologyTitle: 'string',
      time: 'int'
    },
  };
}

//番剧列表
export class Anime extends Realm.Object {
  videoHref!: string;
  title!: string;
  href!: string; //show对应的href
  img!: string; //图片地址
  info!: string; //简介
  state!: string; //更新到第几集，或者已完结
  author!: string; //制作信息
  alias!: string[];//别名
  time!: string; //什么时候更新
  type!: string[]; //番剧类型
  produce!: string //番剧制作信息

  // the Task.generate() method creates Task objects with fields with default values
  static generate(videoHref: string) {
    return {
      videoHref,
      title: '',
      href: '',
      img: '',
      info: '',
      state: [],
      author: '',
      alias: '',
      time: '',
      type: [],
      produce: '',
    };
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Anime',
    primaryKey: 'videoHref',
    properties: {
      videoHref: 'string',
      title: 'string',
      href: 'string',
      img: "string",
      info: "string",
      state: "string",
      author: "string",
      alias: "string[]",
      time: "string",
      type: "string[]",
      produce: "string",
    },
  };
}

//追番列表
export class Follow extends Realm.Object {
  videoHref!: string;

  // the Task.generate() method creates Task objects with fields with default values
  static generate(videoHref: string) {
    return {
      videoHref,
    };
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Follow',
    primaryKey: 'videoHref',
    properties: {
      videoHref: 'string',
    },
  };
}

const Context = createRealmContext({
  schema: [History, Anime, Follow],
})
export default Context;

