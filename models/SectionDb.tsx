// 下载信息，只记录下载完成的
import {Realm} from '@realm/react';
import {UpdateMode} from 'realm';
import ListItemInfo from '../type/ListItemInfo';
import Section from '../type/Download/Section';
import Episode from '../type/Download/Episode';
import {TabName} from '../route';

export default class SectionDb extends Realm.Object implements Section {
  infoUrl!: string; //信息页的url
  episodes!: Episode[]; //选集对应的每一集
  title!: string;
  img!: string;
  author!: string;
  alias!: string;
  state!: string;
  time!: string;
  type!: ListItemInfo<string>[];
  produce!: string;
  info!: string;
  relatives!: ListItemInfo<any>[];
  tabName!: TabName;
  apiName!: string;

  //新增
  static create(realm: Realm, data: Section) {
    let section;
    realm.write(() => {
      section = realm.create(SectionDb, data, UpdateMode.Modified);
    });
  }

  //下载选集
  static download(
    realm: Realm,
    infoUrl: string,
    taskUrl: string,
    title: string,
    playerSrc: string,
  ) {
    //查看选集是否存在
    let section = realm.objectForPrimaryKey(SectionDb, infoUrl)!;
    //查看该任务是否存在
    const index = section.episodes.findIndex(
      taskObj => taskObj.taskUrl === taskUrl,
    );
    if (index === -1) {
      realm.write(() => {
        let taskDb = {
          taskUrl,
          finish: false,
          start: false,
          title,
          playerSrc,
          progress: 0,
        };
        section.episodes = [...section.episodes, taskDb];
      });
    }
    return section;
  }

  //更新进度
  static update(
    realm: Realm,
    infoUrl: string,
    taskUrl: string,
    progress: number,
  ) {
    let section = realm.objectForPrimaryKey(SectionDb, infoUrl)!;
    let taskDb = section.episodes.find(taskObj => taskObj.taskUrl === taskUrl)!;
    realm.write(() => {
      taskDb.progress = progress;
      taskDb.finish = progress == 1;
    });
    return taskDb.finish;
  }

  toRecmdInfo() {
    return {
      infoUrl: this.infoUrl,
      tabName: this.tabName,
      apiName: this.apiName,
      img: this.img,
      state: this.state,
      title: this.title,
    };
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".

  static schema = {
    name: 'SectionDb',
    primaryKey: 'infoUrl',
    properties: {
      infoUrl: 'string',
      episodes: 'EpisodeDb[]',
      title: 'string',
      img: 'string',
      author: 'string',
      alias: 'string',
      state: 'string',
      time: 'string',
      type: 'ListItemInfoDb[]',
      produce: 'string',
      info: 'string',
      relatives: 'ListItemInfoDb[]',
      tabName: 'string',
      apiName: 'string',
    },
  };
}
