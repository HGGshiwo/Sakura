// 选集的信息
import {Realm} from '@realm/react';
import Episode from '../type/Download/Episode';

export default class EpisodeDb extends Realm.Object implements Episode {
  taskUrl!: string;
  progress!: number;
  finish!: boolean;
  start!: boolean;
  title!: string;
  playerSrc!: string;

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'EpisodeDb',
    primaryKey: 'taskUrl',
    properties: {
      taskUrl: 'string',
      progress: 'float',
      finish: 'bool',
      title: 'string',
      playerSrc: 'string',
      start: 'bool',
    },
  };
}
