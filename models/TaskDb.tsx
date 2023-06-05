// 下载信息，只记录下载完成的
import {Realm} from '@realm/react';

export default class TaskDb extends Realm.Object {
  taskUrl!: string;
  froms!: string[];
  tos!: string[];
  finish!: boolean;
  title!: string;

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Task',
    primaryKey: 'taskUrl',
    properties: {
      taskUrl: 'string',
      froms: 'string[]',
      tos: 'string[]',
      finish: 'bool',
      title: 'string',
    },
  };
}
