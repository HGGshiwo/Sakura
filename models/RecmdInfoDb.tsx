import {UpdateMode} from 'realm';
import {Realm} from '@realm/react';
import {TabName} from '../route';
import RecmdInfo from '../type/RecmdInfo';

// 番剧的信息
export default class RecmdInfoDb extends Realm.Object {
  infoUrl!: string;
  tabName!: TabName;
  apiName!: string;
  img!: string;
  state!: string;
  title!: string;

  static create(
    realm: Realm,
    infoUrl: string,
    tabName: TabName,
    apiName: string,
    img: string,
    state: string,
    title: string,
  ) {
    realm.write(() => {
      realm.create(
        RecmdInfoDb,
        {infoUrl, apiName, tabName, img, state, title},
        UpdateMode.Modified,
      );
    });
  }

  //提取出非数据库信息
  extract() :RecmdInfo {
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
    name: 'RecmdInfoDb',
    primaryKey: 'infoUrl',
    properties: {
      infoUrl: 'string',
      img: 'string',
      state: 'string',
      title: 'string',
      apiName: 'string',
      tabName: 'string',
    },
  };
}
