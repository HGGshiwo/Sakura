import create from 'zustand'
import Section from '../type/Download/Section';
import { TabName } from '../route';
import useApi from './Api';
import Context from '../models';
import SectionDb from '../models/SectionDb';
import HistoryDb from '../models/HistoryDb';
import InfoPageInfo from '../type/PageInfo/InfoPageInfo';
import Episode from '../type/Download/Episode';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HistoryDbUtil, SectionDbUtil } from '../models/utils';
import { useEffect } from 'react';

interface State {
  playerHeight: number; //播放器的高度
  sheetHeight: number; //sheet的高度
  playerData: any; //播放器数据
  pageInfo: Section | undefined; //当前的页面数据
  detailSheetVisible: boolean; //详情Sheet是否可见
  episodeSheetVisible: boolean; //选集sheet是否可见
  downloadSheetVisible: boolean; //下载sheet是否可见
  profileVisible: boolean; //profile是否可见
  progress: number; //进度，播放器中使用
  progressPer: number; //百分比表示的进度，进度条使用
  nextDataAvailable: boolean; //下一集是否可用
  refreshing: boolean; //是否刷新
  playerLoading: boolean;//播放器数据缓存中
  recmdsLoading: boolean; //推荐列表缓存中
  pageLoading: boolean; //页面数据缓存中
  flashData: boolean; //是否保留上一次的数据
  episode: Episode | undefined; //当前的选集
  infoUrl: string | undefined;
}

interface Action {
  load: (infoUrl: string, taskUrl: string | undefined, tabName: TabName, apiName: string) => void,
  update: (data: any) => void,
  changeEpisode: (index: number) => void,
  next: () => void,
  updateProgress: (progress: number, progressPer: number) => void,
  downloadDone: (infoUrl: string, taskUrl: string, playerSrc: string) => void
}

const nextDataAvailable = (curEpisode: Episode | undefined, episodes: Episode[]) => {
  if (!curEpisode) {
    return false
  }
  const index = episodes.findIndex(obj => curEpisode!.taskUrl === obj.taskUrl)
  return index + 1 < episodes.length
}

const createStore = (tabName: TabName) =>
  create<State & Action, []>((set, get) => {

    const insets = useSafeAreaInsets();
    const layout = useWindowDimensions();

    let top = layout.width * 0.56
    const bottom = layout.height + insets.top - top
    const { useRealm, useObject } = Context;
    const realm = useRealm()
    const { api } = useApi()

    //通过网页端获取m3u8文件的地址
    const getRemotePlayerData = (playerPageUrl: string, _times?: number) => {
      let times = _times === undefined ? 3 : _times; //默认尝试3次

      const { pageInfo } = get()
      const { apiName, tabName } = pageInfo!
      const loadPlayerSrc = api[tabName][apiName].pages.player!;
      if (times > 0) {
        loadPlayerSrc(
          playerPageUrl,
          (data: any) => {
            //获取到了playerUrl，则更新数据库
            const { episode } = get()
            data = JSON.stringify(data)
            realm.write(() => { episode!.playerSrc = data });
            set({ playerData: data, playerLoading: false })
          },
          (err: string) => {
            console.log(err, '下一次尝试开始');
            getRemotePlayerData(playerPageUrl, times - 1);
          },
        );
      } else {
        console.log('无法获取到播放地址...');
      }
    };

    return {
      playerData: undefined,
      pageInfo: undefined,
      detailSheetVisible: false,
      episodeSheetVisible: false,
      downloadSheetVisible: false,
      profileVisible: false,
      progress: 0,
      progressPer: 0,
      nextDataAvailable: false,
      refreshing: false,
      playerLoading: true,
      recmdsLoading: true,
      pageLoading: true,
      flashData: true,
      episodeTitle: undefined,
      playerHeight: top,
      sheetHeight: bottom,
      episode: undefined,
      infoUrl: undefined,
      load: (infoUrl: string, taskUrl: string | undefined, tabName: TabName, apiName: string) => {

        const { api } = useApi()
        const loadPage = api[tabName][apiName].pages.info!;
        const section = useObject<SectionDb>(SectionDb, infoUrl);
        const history = useObject<HistoryDb>(HistoryDb, infoUrl);

        //当远端请求之后的回调函数
        const dataCallback = (data: InfoPageInfo) => {
          
          const episodes = data.sources.map(obj => ({
            taskUrl: obj.data,
            progress: 0,
            finish: false,
            start: false,
            title: obj.title,
            playerSrc: '',
          }))
          const taskUrl = history ? history?.taskUrl : episodes[0].taskUrl
          const section = { ...data, episodes, infoUrl, tabName, apiName }
          const { playerData } = get()
          const episode = section.episodes.find(obj => obj.taskUrl == taskUrl)!

          set({
            pageInfo: { ...section },
            nextDataAvailable: nextDataAvailable(episode, episodes),
            playerLoading: !playerData,
            recmdsLoading: false,
            pageLoading: false,
            refreshing: false,
            episode,
          })

          //更新数据库
          SectionDbUtil.create(realm, section)
          HistoryDbUtil.update(realm, infoUrl, episodes, taskUrl)
          //如果还没有m3u8的地址，需要再次获取  
          if (!playerData) {
            getRemotePlayerData(episode.taskUrl)
          }
        }

        useEffect(() => {//刷新数据库时间
          HistoryDbUtil.touch(realm, infoUrl)
          set({ refreshing: true, infoUrl })
          //历史数据库和section数据库中已经有数据了
          if (!!section) {
            if (!taskUrl) {
              taskUrl = history ? history?.taskUrl : section.episodes[0].taskUrl
            }
            const episode = section.episodes.find(obj => obj.taskUrl == taskUrl)!
            set({
              playerData: episode?.playerSrc,
              pageInfo: { ...section.extract() },
              progress: history!.progress,
              progressPer: history!.progressPer,
              nextDataAvailable: nextDataAvailable(episode, section.episodes),
              refreshing: false,
              playerLoading: !episode?.playerSrc,
              pageLoading: false,
              episode,
            })
            //如果还没有playerSrc则再次去获取
            if (!episode.playerSrc) {
              getRemotePlayerData(episode.taskUrl)
            }
          }

          //无论如何请求远端数据
          loadPage(infoUrl, dataCallback, (err: string) => console.log(err))
        }, [])

      },
      update: (data: any) => {
        set({ ...data })
      },
      changeEpisode: (index: number) => {
        const { pageInfo, episode } = get()
        const { episodes, title, infoUrl } = pageInfo!;
        //更新数据库, 记录下当前的位置
        const history = realm.objectForPrimaryKey(HistoryDb, infoUrl)!
        realm.write(() => {
          history.taskUrl = episodes[index].taskUrl;
          history.title = episodes[index].title;
        });
        set({
          progress: 0,
          nextDataAvailable: nextDataAvailable(episode!, episodes),
          episode: episodes[index],
          playerLoading: true,
        })
        if (episode?.playerSrc) {
          getRemotePlayerData(episodes[index].taskUrl);
        }
      },
      next: () => {
        const { pageInfo, episode, changeEpisode } = get()
        const { episodes } = pageInfo!
        const index = episodes.findIndex(obj => obj.taskUrl == episode!.taskUrl)
        if (nextDataAvailable(episode!, episodes)) {
          changeEpisode(index + 1)
        }
      },
      updateProgress: (progress: number, progressPer: number) => {
        const { infoUrl } = get().pageInfo!
        realm.write(() => {
          const history = realm.objectForPrimaryKey(HistoryDb, infoUrl)!
          history.progress = progress;
          history.progressPer = progressPer;
        })
        set({ progress, progressPer })
      },
      downloadDone: (infoUrl: string, taskUrl: string, playerSrc: string) => {
        //当一集下载完成，可能需要更改页面中的数据，这里就不更改episode中的数据了
        const { pageInfo } = get()
        if (pageInfo?.infoUrl === infoUrl) {
          const episode = pageInfo.episodes.find(obj => obj.taskUrl === taskUrl)!
          episode.playerSrc = playerSrc
        }
      }
    }
  });

export default createStore;
export type { State, Action }