import {Tab, TabView} from '@rneui/themed';
import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, View, FlatList, StatusBar} from 'react-native';
import {Agent} from '../../api/yinghuacd/VideoAgent';
import {ListItemInfo} from '../../type/ListItemInfo';
import {Source} from '../../type/Source';
import {InfoSub} from '../../type/InfoSub';
import {DetailSheet} from './DetailSheet';
import {RecommandLine} from './RecommandLine';
import {ListLine} from './ListLine';
import {DetailButtonLine} from './DetailButtonLine';
import {ListTitleLine} from '../../component/ListTitleLine';
import {Player} from './Player';
import {RelaviteLine} from './RelaviteLine';
import {TitleLine} from './TitleLine';
import {AnthologySheet} from './AnthologySheet';
import {RecommandInfo} from '../../type/RecommandInfo';
import {VideoPageProps} from '../../App';
import {V1RecommandInfoItem} from '../../component/ListItem';
import Context, {Anime, History} from '../../models';
import {HistoryInfo} from '../../type/HistoryInfo';
const {useRealm, useQuery, useObject} = Context;

const VideoPage: React.FC<VideoPageProps> = ({route, navigation}) => {
  const emptyInfoSub = {
    author: '未知',
    alias: [],
    state: '',
    time: '',
    type: [],
    produce: '',
  };

  const {url} = route.params;

  const [index, setIndex] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  //视频播放相关
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState('');
  const [videoHeight, setVideoHeight] = useState(0);
  const [loading, setLoading] = useState(true); //url是否准备好
  const curSourceIndex = useRef(0); //当前的source源
  const curSources = useRef<string[]>([]); //当前可用的源
  const videoSolved = useRef(false); //视频是否可以播放，不能使用useState

  //页面显示相关
  const [title, setTitle] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [infoSub, setInfoSub] = useState<InfoSub>(emptyInfoSub);
  const [info, setInfo] = useState('');
  const [sources, setSources] = useState<Source[]>([]); //完整的播放列表
  const [relatives, setRelatives] = useState<ListItemInfo[]>([]); //同系列列表
  const [anthologys, setAnthologys] = useState<ListItemInfo[]>([]); //选集列表
  const [recommands, setRecommands] = useState<RecommandInfo[]>([]); //同系列列表
  const [anthologyIndex, setAnthologyIndex] = useState(0);
  const [detailLineVisible, setDetailSheetVisible] = useState(false);
  const [anthologySheetVisible, setAnthologySheetVisible] = useState(false);
  const [nextVideoAvailable, setNextVideoAvailable] = useState(false);
  const [defaultProgress, setDefaultProgress] = useState(0);
  const ratio = 0.56; //视频长宽比例
  const history = useRef<HistoryInfo | null>();

  //数据相关
  const realm = useRealm();
  const agent = useRef(new Agent(url));

  useEffect(() => {
    const {height, width} = Dimensions.get('window');
    setWindowHeight(height);
    setWindowWidth(width);
    setVideoHeight(width * ratio);

    //获取当前视频的历史记录
    history.current = realm.objectForPrimaryKey(History, url);
    //如果不存在记录，则创建数据
    if (!history.current) {
      realm.write(() => {
        history.current = realm.create(History, {
          href: url,
          time: new Date().getTime(),
          img: 'http://www.yinghuacd.com/js/20180601/0601.png',
          state: '',
          title: '',
          anthologyIndex: 0,
          progress: 0,
          progressPer: 0,
          anthologyTitle: '',
        });
      });
    }
    else {
      realm.write(()=>{
        history.current!.time = new Date().getTime()
      })
      
    }
    agent.current.afterLoadTitle((_title: string) => {
      setTitle(_title);
      realm.write(() => {
        history.current!.title = _title;
      });
    });

    agent.current.afterLoadSources((_sources: Source[]) => {
      setSources(_sources);
      const _anthologys = _sources.map((_source, index) => {
        return {id: index, data: _source.data, title: _source.key};
      });
      realm.write(() => {
        history.current!.anthologyTitle = _anthologys[anthologyIndex].title;
      });
      setAnthologys(_anthologys);

      setLoading(true);

      setDefaultProgress(history.current ? history.current.progress : 0);
      setAnthologyIndex(history.current!.anthologyIndex); //当前播放第一集

      videoSolved.current = false;
      curSourceIndex.current = 0;
      curSources.current = _sources[history.current!.anthologyIndex].data;
      switchVideoSrc();
    });

    agent.current.afterLoadInfoSub((_infoSub: InfoSub) => {
      setInfoSub(_infoSub);
      realm.write(() => {
        history.current!.state = _infoSub.state;
      });
    });

    agent.current.afterLoadInfo((_info: string) => {
      setInfo(_info);
    });

    agent.current.afterLoadImgSrc((src: string) => {
      setImgUrl(src);
      realm.write(() => {
        history.current!.img = src;
      });
    });

    agent.current.afterLoadRelatives((_relatives: ListItemInfo[]) => {
      setRelatives(_relatives);
    });

    agent.current.afterLoadRecommands((_recommands: RecommandInfo[]) => {
      setRecommands(_recommands);
    });
    agent.current.load();
  }, []);

  //切换视频选集
  const changeAnthology = (index: number) => {
    //更新数据库, 记录下当前的位置
    realm.write(() => {
      history.current!.anthologyIndex = index;
      history.current!.anthologyTitle = anthologys[index].title;
    });

    setNextVideoAvailable(index + 1 < anthologys.length);
    setAnthologyIndex(index);
    setLoading(true);
    videoSolved.current = false;
    curSourceIndex.current = 0;
    console.log(sources, index);
    curSources.current = sources[index].data;
    switchVideoSrc();
  };

  const toNextVideo = () => {
    changeAnthology(anthologyIndex + 1);
  };

  const switchVideoSrc = () => {
    //设置视频播放源
    if (curSourceIndex.current < curSources.current.length) {
      console.log(
        `尝试源: ${curSourceIndex.current + 1}/${curSources.current.length}`,
      );
      const vUrl = curSources.current[curSourceIndex.current];
      curSourceIndex.current += 1;
      agent.current.loadVideoSrc(
        vUrl,
        (state: boolean, src: string, type: string) => {
          if (videoSolved.current) return;
          console.log(state, src, type);
          if (state) {
            setVideoUrl(src);
            setVideoType(type);
            setLoading(false);
            videoSolved.current = true;
          } else {
            switchVideoSrc();
          }
        },
      );
    }
  };

  const onPressRecommand = (item: RecommandInfo) => {
    navigation.push('Video', {url: item.href});
  };

  //video unmouted回调函数
  const onVideoUnMounted = (progress: number, progressPer: number) => {
    realm.write(() => {
      history.current!.progress = progress;
      history.current!.progressPer = progressPer;
    });
  };

  return (
    <>
      <Player
        title={`${title} ${
          anthologys[anthologyIndex] ? anthologys[anthologyIndex].title : ''
        }`}
        onBack={() => {
          navigation.navigate('Animation');
        }}
        videoUrl={videoUrl}
        videoType={videoType}
        videoUrlAvailable={!loading}
        nextVideoAvailable={nextVideoAvailable}
        onVideoErr={switchVideoSrc}
        toNextVideo={toNextVideo}
        onProgress={onVideoUnMounted}
        defaultProgress={defaultProgress}
      />

      <Tab value={index} onChange={setIndex} dense style={styles.tabContainer}>
        <Tab.Item>简介</Tab.Item>
        <Tab.Item>评论</Tab.Item>
      </Tab>

      <TabView value={index} onChange={setIndex}>
        <TabView.Item>
          <FlatList
            ListHeaderComponent={
              <>
                <View style={{padding: 10, width: windowWidth}}>
                  <TitleLine
                    title={title}
                    onPress={() => {}}
                    followed={false}
                  />
                  <DetailButtonLine
                    author={infoSub.author}
                    onPress={() => setDetailSheetVisible(true)}
                  />
                  <ListTitleLine
                    title={'选集'}
                    buttonText={infoSub?.state}
                    onPress={() => setAnthologySheetVisible(true)}
                  />
                  {relatives.length == 0 ? null : (
                    <RelaviteLine relatives={relatives} />
                  )}
                  <ListLine
                    data={anthologys}
                    onPress={changeAnthology}
                    activeIndex={anthologyIndex}
                  />
                </View>
              </>
            }
            data={recommands}
            renderItem={({item, index}) => {
              return (
                <V1RecommandInfoItem
                  index={index}
                  item={item}
                  onPress={onPressRecommand}
                />
              );
            }}
            keyExtractor={item => `${item.href}`}
          />
        </TabView.Item>
        <TabView.Item></TabView.Item>
      </TabView>

      <DetailSheet
        top={videoHeight}
        height={windowHeight - videoHeight}
        title={title}
        src={imgUrl}
        infoSub={infoSub}
        info={info}
        visible={detailLineVisible}
        onPress={() => {
          setDetailSheetVisible(false);
        }}
      />

      <AnthologySheet
        top={videoHeight}
        height={windowHeight - videoHeight}
        anthologys={anthologys}
        activeIndex={anthologyIndex}
        state={infoSub.state}
        visible={anthologySheetVisible}
        onClose={() => {
          console.log('close');
          setAnthologySheetVisible(false);
        }}
        onPress={changeAnthology}
      />
    </>
  );
};

// Later on in your styles..
var styles = StyleSheet.create({
  tabContainer: {
    width: '30%',
    marginLeft: 10,
  },
});

export default VideoPage;
