import React, {useState, useEffect, useRef, createRef, useContext} from 'react';
import {
  View,
  useWindowDimensions,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import {ListItemInfo} from '../../../type/ListItemInfo';
import {Source} from '../../../type/Source';
import {InfoSub} from '../../../type/InfoSub';
import {DetailSheet} from './DetailSheet';
import {Player} from './Player';
import {AnthologySheet} from './AnthologySheet';
import {RecommandInfo} from '../../../type/RecommandInfo';
import Context from '../../../models';
import History from '../../../models/History';
import {UpdateMode} from 'realm';
import Anime from '../../../models/Anime';
import {useNavigation, useRoute} from '@react-navigation/native';
import {VideoPageProps} from '../../../type/route';
import Container from '../../../component/Container';
// import loadPage, {loadVideoSrc} from '../../../api/yinghuacd/video';
import loadPage, { loadVideoSrc } from '../../../api/scyinghua/video';
import {InfoText, SubTitle} from '../../../component/Text';
import {TabBar, TabView} from 'react-native-tab-view';
import Profile from './Profile';
import MultiItemRow from '../../../component/MultiItemRow';
import {LoadingContainer} from '../../../component/Loading';
import ThemeContext from '../../../theme';
const {useRealm} = Context;

const emptyInfoSub = {
  author: '未知',
  alias: '',
  state: '',
  time: '',
  type: [],
  produce: '',
};

const Command = () => <View style={{flex: 1}}></View>;

const routes = [
  {key: 'profile', title: '简介'},
  {key: 'command', title: '评论'},
];

const VideoPage: React.FC<{}> = () => {
  const layout = useWindowDimensions();
  const videoHeight = layout.width * 0.56;
  const route = useRoute<VideoPageProps['route']>();
  const navigation = useNavigation<VideoPageProps['navigation']>();
  const {url} = route.params;
  const [index, setIndex] = useState(0);

  //视频播放相关
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState('');
  const [videoUrlAvailable, setVideoUrlAvailable] = useState(false); //url是否准备好
  const curSourceIndex = useRef(0); //当前的source源
  const curSources = useRef<string[]>([]); //当前可用的源
  const videoUrlAvailableRef = useRef(false); //视频是否可以播放，不能使用useState
  const [detailLineVisible, setDetailSheetVisible] = useState(false);
  const [anthologySheetVisible, setAnthologySheetVisible] = useState(false);
  const [defaultProgress, setDefaultProgress] = useState(0);
  const [nextVideoAvailable, setNextVideoAvailable] = useState(false);

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
  const [refreshing, setRefreshing] = useState(false); //是否刷新
  const [loading, setLoading] = useState(true); //页面是否在加载中
  const history = useRef<History | null>();
  const ProfileAnthologyListRef = createRef<FlatList<ListItemInfo>>();
  const VideoAnthologyListRef = createRef<FlatList<ListItemInfo>>();

  const renderScene = ({route}: any) => {
    switch (route.key) {
      case 'profile':
        return (
          <LoadingContainer
            loading={loading}
            style={{paddingTop: 40}}
            backgroundColor="grey"
            color="grey"
            text="加载中...">
            <Profile
              refreshing={refreshing}
              onRefresh={init}
              url={url}
              title={title}
              imgUrl={imgUrl}
              infoSub={infoSub}
              info={info}
              relatives={relatives}
              recommands={recommands}
              setAnthologySheetVisible={setAnthologySheetVisible}
              setDetailSheetVisible={setDetailSheetVisible}>
              <FlatList
                ref={ProfileAnthologyListRef}
                getItemLayout={(item, index) => ({
                  length: 160,
                  offset: 160 * index,
                  index,
                })}
                style={{marginBottom: 20}}
                horizontal={true}
                data={anthologys}
                renderItem={({item, index}) => (
                  <Pressable onPress={() => changeAnthology(item.id)}>
                    <View style={styles.itemContainer2}>
                      <SubTitle
                        title={item.title}
                        style={{
                          color: VideoStyle.textColor(anthologyIndex === index),
                        }}
                      />
                    </View>
                  </Pressable>
                )}
                keyExtractor={item => `${item.id}`}
              />
            </Profile>
          </LoadingContainer>
        );
      case 'command':
        return <Command />;
      default:
        return null;
    }
  };

  //数据相关
  const realm = useRealm();

  const init = () => {
    setRefreshing(true);
    loadPage(
      // url,
      '/detail/78.html',
      ({title, img, infoSub, recommands, sources, info, relatives}) => {
        const _anthologys = sources.map((_source, index) => {
          return {id: index, data: _source.data, title: _source.key};
        });

        let _history = realm.objectForPrimaryKey(History, url);

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
              anthologyTitle: _history
                ? _history.anthologyTitle
                : _anthologys[0].title,
            },
            UpdateMode.Modified,
          );
        });

        setTitle(title);
        setImgUrl(img);
        setInfoSub(infoSub);
        setRecommands(recommands);
        setSources(sources);
        setRelatives(relatives);

        setAnthologys(_anthologys);
        setInfo(info);
        setRelatives(relatives);
        setDefaultProgress(history.current!.progress);

        setLoading(false); //页面内容获取成功，页面不再加载
        setRefreshing(false);
        setNextVideoAvailable(
          history.current!.anthologyIndex + 1 < _anthologys.length,
        );
        setAnthologyIndex(history.current!.anthologyIndex); //当前播放第一集
        curSourceIndex.current = 0;
        curSources.current = sources[history.current!.anthologyIndex].data;
        switchVideoSrc();
      },
    );
  };

  useEffect(init, []);

  //滚动列表
  useEffect(() => {
    if (ProfileAnthologyListRef.current) {
      ProfileAnthologyListRef.current!.scrollToIndex({
        index: history.current!.anthologyIndex,
      });
    }
  }, [ProfileAnthologyListRef]);

  useEffect(() => {
    if (VideoAnthologyListRef.current) {
      VideoAnthologyListRef.current!.scrollToIndex({
        index: history.current!.anthologyIndex,
      });
    }
  }, [VideoAnthologyListRef]);

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
      loadVideoSrc(vUrl, (state: boolean, src?: string, type?: string) => {
        if (videoUrlAvailableRef.current) return;
        console.log(state, src, type);
        if (state) {
          setVideoUrl(src!);
          setVideoType(type!);
          setVideoUrlAvailable(true);
          videoUrlAvailableRef.current = true;
        } else {
          switchVideoSrc();
        }
      });
    }
  };

  //更新进度回调函数
  const onVideoUnMounted = (progress: number, progressPer: number) => {
    realm.write(() => {
      history.current!.progress = progress;
      history.current!.progressPer = progressPer;
    });
  };

  const {VideoStyle} = useContext(ThemeContext).theme;

  return (
    <Container>
      <Player
        title={`${title} ${
          anthologys[anthologyIndex] ? anthologys[anthologyIndex].title : ''
        }`}
        onBack={() => {
          navigation.goBack();
        }}
        videoUrl={videoUrl}
        videoType={videoType}
        videoUrlAvailable={videoUrlAvailable}
        nextVideoAvailable={nextVideoAvailable}
        onVideoErr={switchVideoSrc}
        toNextVideo={toNextVideo}
        onProgress={onVideoUnMounted}
        defaultProgress={defaultProgress}
        renderAnthologys={(
          show: boolean,
          setVisible: (visible: boolean) => void,
        ) => (
          <View
            style={{
              display: show ? 'flex' : 'none',
              position: 'absolute',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,1)',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 10,
              right: 0,
              bottom: 0,
            }}>
            <FlatList
              ref={VideoAnthologyListRef}
              getItemLayout={(item, index) => ({
                length: 45,
                offset: 45 * index,
                index,
              })}
              data={anthologys}
              renderItem={({item, index}) => (
                <Pressable
                  style={{flex: 1}}
                  onPress={() => {
                    changeAnthology(index);
                    setVisible(false);
                  }}>
                  <View
                    style={{
                      borderWidth: 2,
                      height: 40,
                      padding: 10,
                      margin: 5,
                      width: 160,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: 5,
                      borderColor: VideoStyle.playerTextColor(
                        index === anthologyIndex,
                      ),
                    }}>
                    <InfoText
                      title={item.title}
                      style={{
                        fontWeight:
                          index === anthologyIndex ? 'bold' : 'normal',
                        color: VideoStyle.playerTextColor(
                          index === anthologyIndex,
                        ),
                      }}
                    />
                  </View>
                </Pressable>
              )}
            />
          </View>
        )}
      />

      <TabView
        lazy
        renderTabBar={(props: any) => (
          <TabBar
            scrollEnabled
            {...props}
            indicatorStyle={{
              backgroundColor: VideoStyle.indicatorColor,
              width: 0.5,
            }}
            renderLabel={({route, focused, color}) => (
              <InfoText
                title={route.title!}
                style={{
                  color: VideoStyle.textColor(focused),
                  paddingHorizontal: 5,
                  fontWeight: focused ? 'bold' : 'normal',
                }}
              />
            )}
            style={{backgroundColor: 'white'}}
            tabStyle={{width: 'auto'}}
          />
        )}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />

      <DetailSheet
        top={videoHeight}
        height={layout.height - videoHeight}
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
        height={layout.height - videoHeight}
        state={infoSub.state}
        visible={anthologySheetVisible}
        onClose={() => {
          setAnthologySheetVisible(false);
        }}>
        <FlatList
          contentContainerStyle={{paddingBottom: 50}}
          data={anthologys}
          renderItem={({item, index}) => (
            <MultiItemRow
              numberOfItem={2}
              children={(index, info) => (
                <Pressable
                  style={{flex: 1}}
                  onPress={() => changeAnthology(index)}
                  key={index}>
                  <View style={styles.itemContainer}>
                    <SubTitle
                      title={info.title}
                      style={{
                        color: VideoStyle.textColor(index === anthologyIndex),
                      }}
                    />
                  </View>
                </Pressable>
              )}
              index={index}
              datas={anthologys}
            />
          )}
        />
      </AnthologySheet>
    </Container>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#f1f2f3',
    flex: 1,
    height: 75,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
  },
  itemContainer2: {
    backgroundColor: '#f1f2f3',
    width: 150,
    height: 70,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
  },
});

export default VideoPage;
