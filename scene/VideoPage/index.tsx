import {Tab, TabView} from '@rneui/themed';
import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, View, FlatList} from 'react-native';
import {Agent} from '../../api/yinghuacd/VideoAgent';
import {ListItemInfo} from '../../type/ListItemInfo';
import {Source} from '../../type/Source';
import {InfoSub} from '../../type/InfoSub';
import {DetailSheet} from './DetailSheet';
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
import Context from '../../models';
import History from '../../models/History';
import HistoryInfo from '../../type/HistoryInfo';
import {UpdateMode} from 'realm';
import {LoadingBox, LoadingContainer} from '../../component/Loading';
import Anime from '../../models/Anime';
import Follow from '../../models/Follow';
const {useRealm} = Context;

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
  const [videoUrlAvailable, setVideoUrlAvailable] = useState(false); //url是否准备好
  const curSourceIndex = useRef(0); //当前的source源
  const curSources = useRef<string[]>([]); //当前可用的源
  const videoUrlAvailableRef = useRef(false); //视频是否可以播放，不能使用useState

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
  const [loading, setLoading] = useState(true); //页面是否在加载中
  const [followed, setFollowed] = useState(false); //是否追番

  const ratio = 0.56; //视频长宽比例
  const history = useRef<History | null>();

  //数据相关
  const realm = useRealm();
  const agent = useRef(new Agent(url));

  useEffect(() => {
    const {height, width} = Dimensions.get('window');
    setWindowHeight(height);
    setWindowWidth(width);
    setVideoHeight(width * ratio);

    agent.current.afterLoad(
      ({title, img, infoSub, recommands, sources, info}) => {
        const _anthologys = sources.map((_source, index) => {
          return {id: index, data: _source.data, title: _source.key};
        });

        const _history = realm.objectForPrimaryKey(History, url);

        //更新番剧数据库
        realm.write(() => {
          realm.create(
            Anime,
            {
              href: url,
              img,
              state: infoSub.state,
              title,
            },
            UpdateMode.Modified,
          );
        });

        //更新历史记录数据库
        realm.write(() => {
          history.current = realm.create(
            History,
            {
              href: url,
              time: new Date().getTime(),
              anthologyIndex: _history ? _history.anthologyIndex : 0,
              progress: _history ? _history.progress : 0,
              progressPer: _history ? _history.progressPer : 0,
              anthologyTitle: _history ? _history.anthologyTitle : '',
            },
            UpdateMode.Modified,
          );
        });

        setTitle(title);
        setImgUrl(img);
        setInfoSub(infoSub);
        setRecommands(recommands);
        setSources(sources);

        setAnthologys(_anthologys);
        setInfo(info);
        setRelatives(relatives);
        setDefaultProgress(history.current!.progress);

        setLoading(false); //页面内容获取成功，页面不再加载
        setNextVideoAvailable(
          history.current!.anthologyIndex + 1 < anthologys.length,
        );
        setAnthologyIndex(history.current!.anthologyIndex); //当前播放第一集
        curSourceIndex.current = 0;
        curSources.current = sources[history.current!.anthologyIndex].data;
        switchVideoSrc();
      },
    );
    agent.current.load();

    //查看数据库看是否追番
    const _follow = realm.objectForPrimaryKey(Follow, url)
    setFollowed(!!_follow && _follow!.following)
  }, []);

  //切换视频选集
  const changeAnthology = (index: number) => {
    //更新数据库, 记录下当前的位置
    realm.write(() => {
      history.current!.anthologyIndex = index;
      history.current!.anthologyTitle = anthologys[index].title;
    });
    setDefaultProgress(0);
    setNextVideoAvailable(index + 1 < anthologys.length);
    setAnthologyIndex(index);
    setVideoUrlAvailable(false);
    videoUrlAvailableRef.current = false;
    curSourceIndex.current = 0;
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
          if (videoUrlAvailableRef.current) return;
          console.log(state, src, type);
          if (state) {
            setVideoUrl(src);
            setVideoType(type);
            setVideoUrlAvailable(true);
            videoUrlAvailableRef.current = true;
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

  //更新进度回调函数
  const onVideoUnMounted = (progress: number, progressPer: number) => {
    realm.write(() => {
      history.current!.progress = progress;
      history.current!.progressPer = progressPer;
    });
  };

  //点击追番按钮的回调函数
  const handlePressFollowed = (followed: boolean) => {
    realm.write(() => {
      realm.create(
        Follow,
        {
          href: url,
          following: followed,
        },
        UpdateMode.Modified,
      );
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
        videoUrlAvailable={videoUrlAvailable}
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
      <LoadingContainer
        loading={loading}
        style={{paddingTop: 40}}
        backgroundColor="grey"
        color="grey"
        text="加载中...">
        <TabView containerStyle={{flex: 1}} value={index} onChange={setIndex}>
          <TabView.Item style={{flex: 1}}>
            <FlatList
              ListHeaderComponent={
                <>
                  <View style={{padding: 10, width: windowWidth}}>
                    <TitleLine
                      title={title}
                      onPress={handlePressFollowed}
                      followed={followed}
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
              renderItem={({item, index}) => (
                <V1RecommandInfoItem
                  index={index}
                  item={item}
                  onPress={onPressRecommand}
                />
              )}
              keyExtractor={item => `${item.href}`}
            />
          </TabView.Item>
          <TabView.Item></TabView.Item>
        </TabView>
      </LoadingContainer>

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
