import {UpdateMode} from 'realm';
import RecommandInfo from '../type/RecommandInfo';
import {Realm} from '@realm/react';

// 番剧的信息
export default class RecmdInfoDb extends Realm.Object implements RecommandInfo {
  href!: string;
  apiName!: string;
  img!: string;
  state!: string;
  title!: string;

  static update(
    realm: Realm,
    href: string,
    apiName: string,
    img: string,
    state: string,
    title: string,
  ) {
    realm.write(() => {
      realm.create(
        RecmdInfoDb,
        {href, apiName, img, state, title},
        UpdateMode.Modified,
      );
    });
  }
  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'RecmdInfoDb',
    primaryKey: 'href',
    properties: {
      href: 'string',
      img: 'string',
      state: 'string',
      title: 'string',
      apiName: 'string',
    },
  };
}
