//观看历史
import {Realm} from '@realm/react';
import HistoryInfo from '../type/HistoryInfo';
import RecommandInfo from '../type/RecommandInfo';
import {TabName} from '../route';
import {Source} from '../type/Source';
import {ListItemInfo} from '../type/ListItemInfo';
import {UpdateMode} from 'realm';

export default class History extends Realm.Object implements HistoryInfo {
  href!: string;
  time!: number; //时间戳
  apiName!: string;
  anthologyIndex!: number; //观看的选集
  progress!: number; //观看的进度
  progressPer!: number; //观看进度百分比
  anthologyTitle!: string; //名字
  tabName!: 'Comic' | 'Anime' | 'Novel';

  static update(
    realm: Realm,
    tabName: TabName,
    url: string,
    apiName: string,
    _history: History,
    anthology: ListItemInfo,
  ) {
    let history = null;
    realm.write(() => {
      history = realm.create(
        History,
        {
          tabName,
          href: url,
          apiName,
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
  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'History',
    primaryKey: 'href',
    properties: {
      href: 'string',
      anthologyIndex: 'int',
      progress: 'float',
      progressPer: 'float',
      anthologyTitle: 'string',
      time: 'int',
      tabName: 'string',
      apiName: 'string',
    },
  };
}
