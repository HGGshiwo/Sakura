// 追番信息
import { Realm } from '@realm/react';

export default class Follow extends Realm.Object {
  href!: string;
  following!: boolean;

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Follow',
    primaryKey: 'href',
    properties: {
      href: 'string',
      following: 'bool',
    },
  };
}
