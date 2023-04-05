// 下载信息，只记录下载完成的
import { Realm } from '@realm/react';

export default class Download extends Realm.Object {
  href!: string;
  destination!: string; //下载的位置
  tabName!: 'Comic'|'Anime'|'Novel';

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Download',
    primaryKey: 'href',
    properties: {
      href: 'string',
      destination: 'string',
      tabName: 'string',
    },
  };
}