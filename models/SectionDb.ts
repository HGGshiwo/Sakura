// 下载信息，只记录下载完成的
import {Realm} from '@realm/react';
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

  extract() {
    return {
      infoUrl: this.infoUrl,
      episodes: this.episodes,
      title: this.title,
      img: this.img,
      author: this.author,
      alias: this.alias,
      state: this.state,
      time: this.time,
      type: this.type,
      produce: this.produce,
      info: this.info,
      relatives: this.relatives,
      tabName: this.tabName,
      apiName: this.apiName,
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
