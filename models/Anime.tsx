import {RecommandInfo} from '../type/RecommandInfo';
import { Realm } from '@realm/react';

// 番剧的信息
export default class Anime extends Realm.Object implements RecommandInfo {
  href!: string;
  img!: string;
  state!: string;
  title!: string;

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Anime',
    primaryKey: 'href',
    properties: {
      href: 'string',
      img: 'string',
      state: 'string',
      title: 'string',
    },
  };
}
