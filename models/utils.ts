import { UpdateMode } from "realm";
import SectionDb from "./SectionDb";
import { schema } from '.';
import Episode from "../type/Download/Episode";
import HistoryDb from "./HistoryDb";
import Section from "../type/Download/Section";

const SectionDbUtil = {
  create: (realm: Realm, data: Section) => {
    let section;
    realm.write(() => {
      section = realm.create(SectionDb, data, UpdateMode.Modified);
    });
  }
}

const DonwloadDbUtil = {
  create: (
    realm: Realm,
    infoUrl: string,
    taskUrl: string,
    title: string,
    playerSrc: string,
  ) => {
    //查看选集是否存在
    let section = realm.objectForPrimaryKey(SectionDb, infoUrl)!;
    //查看该任务是否存在
    const index = section.episodes.findIndex(
      taskObj => taskObj.taskUrl === taskUrl,
    );
    if (index === -1) {
      realm.write(() => {
        let taskDb = {
          taskUrl,
          finish: false,
          start: false,
          title,
          playerSrc,
          progress: 0,
        };
        section.episodes = [...section.episodes, taskDb];
      });
    }
    return section;
  }
}

const TaskDbUtile = {
  //更新进度
  update: (realm: Realm, infoUrl: string, taskUrl: string, progress: number) => {
    let section = realm.objectForPrimaryKey(SectionDb, infoUrl)!;
    let taskDb = section.episodes.find(taskObj => taskObj.taskUrl === taskUrl)!;
    realm.write(() => {
      taskDb.progress = progress;
      taskDb.finish = progress == 1;
    });
    return taskDb.finish;
  }
}

const HistoryDbUtil = {
  //只更新时间，如果是远端请求失败，则不会再跟新数据库
  touch: (realm: Realm, infoUrl: string) => {
    let history = realm.objectForPrimaryKey(HistoryDb, infoUrl)
    realm.write(() => {
      if (history) {
        history.time = new Date().getTime();
      }
    })
    return history;
  },
  update: (realm: Realm, infoUrl: string, episodes: Episode[], taskUrl?: string) => {
    let history = realm.objectForPrimaryKey(HistoryDb, infoUrl);
    if (!!history) {
      //如果历史记录存在，则直接更新就可以了
      realm.write(() => {
        history!.time = new Date().getTime();
        if (!!taskUrl && history!.taskUrl !== taskUrl) {
          history!.progress = 0;
          history!.progressPer = 0;
          history!.taskUrl = taskUrl;
          history!.title = episodes.find(obj => obj.taskUrl == taskUrl)!.title;
        }
      });
    } else {
      realm.write(() => {
        if (!taskUrl) {
          taskUrl = episodes[0].taskUrl;
        }
        history = realm.create(
          HistoryDb,
          {
            infoUrl,
            time: new Date().getTime(),
            taskUrl,
            progress: 0,
            progressPer: 0,
            title: episodes.find(obj => obj.taskUrl == taskUrl)!.title,
          },
          UpdateMode.Modified,
        );
      });
    }
    return history;
  }
}


export { HistoryDbUtil, TaskDbUtile, DonwloadDbUtil, SectionDbUtil }