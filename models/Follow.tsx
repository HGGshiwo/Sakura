// 追番信息
import {Realm} from '@realm/react';
import {TabName} from '../route';
import {UpdateMode} from 'realm';

export default class Follow extends Realm.Object {
  href!: string;
  following!: boolean;
  tabName!: 'Comic' | 'Anime' | 'Novel';

  static update(
    realm: Realm,
    href: string,
    following: boolean,
    tabName: TabName,
  ) {
    realm.write(() => {
      realm.create(Follow, {href, following, tabName}, UpdateMode.Modified);
    });
  }
  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Follow',
    primaryKey: 'href',
    properties: {
      href: 'string',
      following: 'bool',
      tabName: 'string',
    },
  };
}
