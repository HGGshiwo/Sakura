// 追番信息
import {Realm} from '@realm/react';
import {UpdateMode} from 'realm';

export default class FollowDb extends Realm.Object {
  infoUrl!: string;
  following!: boolean;

  static update(
    realm: Realm,
    infoUrl: string,
    following: boolean
  ) {
    realm.write(() => {
      realm.create(FollowDb, {infoUrl, following}, UpdateMode.Modified);
    });
  }
  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'FollowDb',
    primaryKey: 'infoUrl',
    properties: {
      infoUrl: 'string',
      following: 'bool',
      tabName: 'string',
    },
  };
}
