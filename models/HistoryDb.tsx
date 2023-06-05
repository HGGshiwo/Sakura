//观看历史
import {Realm} from '@realm/react';
import ListItemInfo from '../type/ListItemInfo';
import {UpdateMode} from 'realm';

export default class HistoryDb extends Realm.Object {
  infoUrl!: string;
  time!: number; //时间戳
  anthologyIndex!: number; //观看的选集
  progress!: number; //观看的进度
  progressPer!: number; //观看进度百分比
  anthologyTitle!: string; //名字

  static update(
    realm: Realm,
    url: string,
    _history: HistoryDb,
    anthology: ListItemInfo<string>,
  ) {
    let history = null;
    realm.write(() => {
      history = realm.create(
        HistoryDb,
        {
          infoUrl: url,
          time: new Date().getTime(),
          anthologyIndex: _history ? _history.anthologyIndex : 0,
          progress: _history ? _history.progress : 0,
          progressPer: _history ? _history.progressPer : 0,
          anthologyTitle: _history //这个title是在历史记录中显示的
            ? _history.anthologyTitle
            : anthology.title,
        },
        UpdateMode.Modified,
      );
    });
    return history;
  }

  extract() {
    return {
      time: this.time,
      anthologyIndex: this.anthologyIndex,
      progress: this.progress,
      progressPer: this.progressPer,
      anthologyTitle: this.anthologyTitle,
    }
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'HistoryDb',
    primaryKey: 'infoUrl',
    properties: {
      infoUrl: 'string',
      anthologyIndex: 'int',
      progress: 'float',
      progressPer: 'float',
      anthologyTitle: 'string',
      time: 'int',
    },
  };
}
