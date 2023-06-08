// 记录ListItemInfo类型的数据
import {Realm} from '@realm/react';

export default class ListItemInfoDb extends Realm.Object {
    title!: string;
    id!: string;
    data?: string;
  

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'ListItemInfoDb',
    primaryKey: 'id',
    properties: {
      id: 'string',
      title: 'string',
      data: 'string?',
    },
  };
}


