import {
  ReactNode,
  useRef,
  useState,
  useEffect,
  createRef,
  useContext,
  Ref,
  RefObject,
  ReactElement,
} from 'react';
import {
  View,
  useWindowDimensions,
  FlatList,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {ListItemInfo} from '../type/ListItemInfo';
import InfoSub from '../type/InfoSub';
import {DetailSheet} from '../component/DetailSheet';
import {AnthologySheet} from '../component/AnthologySheet';
import RecommandInfo from '../type/RecommandInfo';
import Context from '../models';
import History from '../models/History';
import {UpdateMode} from 'realm';
import RecmdInfoDb from '../models/RecmdInfoDb';
import Container from '../component/Container';
import api, {loadInfoPage} from '../api';
import {InfoText, RateText, SubTitle, Title} from '../component/Text';
import {TabBar, TabView} from 'react-native-tab-view';
import {LoadingContainer} from '../component/Loading';
import AppContext from '../context';
import {FollowButton, TextButton} from '../component/Button';
import {useNavigation} from '@react-navigation/native';
import {VideoPageProps} from '../route';
import Follow from '../models/Follow';
import alert from '../component/Toast';
import {Divider} from '@rneui/base';
import EndLine from '../component/EndLine';
import {V1RecommandInfoItem} from '../component/ListItem';
import {ListTitleLine} from '../component/ListTitleLine';
import ToolBar from '../component/ToolBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SlidingUpPanel, {SlidingUpPanelProps} from 'rn-sliding-up-panel';
import {FlatGrid} from '../component/Grid';

interface PlayerProps {
  ref?: RefObject<any>; // 播放器的ref
  dataAvailable: boolean; //数据源是否解析成功
  defaultFullscreen?: boolean; //是否全屏
  nextDataAvailable: boolean; //是否有下一个数据源
  data: any; //数据源，video要求指定type
  title: string; //播放器显示的标题
  onErr: Function; //数据加载错误
  onBack: () => void; //返回
  toNextSource: () => void; //加载下一个数据源
  onProgress: (progress: number, perProgress: number) => void; //进度更新时调用
  defaultProgress: number; //初始的进度
  renderAnthologys: (
    visible: boolean,
    setVisible: (visible: boolean) => void,
  ) => ReactNode; //如何渲染选集列表
  showPanel: () => void; //展示profile panel
  hidePanel: () => void;
  playerHeight: number; //player高度
}

const {useRealm} = Context;

const Command = () => <View style={{flex: 1}}></View>;
const targets = {
  Anime: 'Video',
  Comic: 'Image',
  Novel: 'Text',
};
const emptyInfoSub = {
  author: '未知',
  alias: '',
  state: '',
  time: '',
  type: [],
  produce: '',
};

const routes = [
  {key: 'profile', title: '简介'},
  {key: 'command', title: '评论'},
];

const OptionalWapper: React.FC<
  {
    children: ReactElement;
    usePanel: boolean;
    panelRef: any;
  } & SlidingUpPanelProps
> = ({
  children,
  usePanel, //是否使用panel
  allowDragging,
  panelRef,
  draggableRange,
}) =>
  usePanel ? (
    <SlidingUpPanel
      friction={0.5}
      ref={c => (panelRef.current = c)}
      allowMomentum
      allowDragging={allowDragging}
      showBackdrop={false}
      containerStyle={{backgroundColor: 'white'}}
      draggableRange={draggableRange}>
      {children}
    </SlidingUpPanel>
  ) : (
    children
  );

const InfoPage: React.FC<{
  playerHeight: number; //上方的播放器高度
  url: string;
  apiName: string;
  renderPlayer: (data: PlayerProps) => ReactNode;
  tabName: 'Comic' | 'Anime' | 'Novel';
  autoFullscreen?: boolean; //点击选集以后是否全屏
  allowDragging?: boolean; //是否允许拖动profile
}> = ({
  playerHeight,
  url,
  apiName,
  renderPlayer,
  tabName,
  autoFullscreen,
  allowDragging,
}) => {
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  //播放器相关，从infoPage获得player的页面，然后解析出具体的url
  const [playerData, setPlayerData] = useState<any>(); //具体的播放所需的数据, 可能是{url, type}，也可能是string[]

  const [dataAvailable, setDataAvailable] = useState(false); //playerd的数据源是否可用

  const [detailLineVisible, setDetailSheetVisible] = useState(false);
  const [anthologySheetVisible, setAnthologySheetVisible] = useState(false);
  const [defaultProgress, setDefaultProgress] = useState(0);
  const [nextDataAvailable, setNextDataAvailable] = useState(false);
  const [title, setTitle] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [infoSub, setInfoSub] = useState<InfoSub>(emptyInfoSub);
  const [info, setInfo] = useState('');

  const [relatives, setRelatives] = useState<ListItemInfo[]>([]); //同系列列表
  const [anthologys, setAnthologys] = useState<ListItemInfo[]>([]); //选集列表
  const [recommands, setRecommands] = useState<RecommandInfo[]>([]); //同系列列表
  const [anthologyIndex, setAnthologyIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false); //是否刷新
  const [loading, setLoading] = useState(true); //页面是否在加载中

  const history = useRef<History | null>(); //历史记录查询结果

  const navigation = useNavigation<VideoPageProps['navigation']>();
  const [followed, setFollowed] = useState(false); //是否追番
  const panelRef = useRef<SlidingUpPanel | null>(); // profile panel的ref

  useEffect(() => {
    //查看数据库看是否追番
    const _follow = realm.objectForPrimaryKey(Follow, url);
    setFollowed(!!_follow && _follow!.following);
  }, []);

  const onPressRecommand = (item: RecommandInfo) => {
    navigation.push(targets[tabName] as any, {url: item.href, apiName});
  };

  //点击追番按钮的回调函数
  const handlePressFollowed = () => {
    setFollowed(!followed);
    realm.write(() => {
      realm.create(
        Follow,
        {
          href: url,
          following: !followed,
          tabName,
        },
        UpdateMode.Modified,
      );
    });
    alert(`${!followed ? '' : '取消'}追番成功`);
  };
  const ProfileAnthologyListRef = createRef<FlatList<ListItemInfo>>();
  const playerAnthologyListRef = createRef<FlatList<ListItemInfo>>();

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
            <FlatList
              refreshing={refreshing}
              onRefresh={onRefresh}
              ListHeaderComponent={
                <>
                  <View style={{padding: 10, width: layout.width}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Title style={{width: '70%'}} title={title} />
                      <FollowButton
                        onPress={handlePressFollowed}
                        followed={followed}
                      />
                    </View>
                    {/* author和详情栏 */}
                    <View
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <InfoText
                        style={{paddingTop: 2, color: 'gray', flex: 1}}
                        title={infoSub.author}
                      />
                      <TextButton
                        title={'详情'}
                        onPress={() => setDetailSheetVisible(true)}
                      />
                    </View>
                    <ToolBar />
                    <ListTitleLine
                      title={'选集'}
                      buttonText={infoSub?.state}
                      onPress={() => setAnthologySheetVisible(true)}
                    />
                    {relatives.length == 0 ? null : (
                      <FlatList
                        horizontal={true}
                        data={relatives}
                        renderItem={({item}) => (
                          <Pressable
                            onPress={() =>
                              navigation.push(targets[tabName] as any, {
                                url: item.data,
                                apiName,
                              })
                            }>
                            <SubTitle
                              style={{padding: 12}}
                              title={item.title}
                            />
                          </Pressable>
                        )}
                        keyExtractor={item => `${item.id}`}
                      />
                    )}
                    <FlatList
                      ref={ProfileAnthologyListRef}
                      getItemLayout={(item, index) => ({
                        length: 170,
                        offset: 170 * index,
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
                                color: PlayerStyle.textColor(
                                  anthologyIndex === index,
                                ),
                              }}
                            />
                          </View>
                        </Pressable>
                      )}
                      keyExtractor={item => `${item.id}`}
                    />
                  </View>
                  <Divider />
                </>
              }
              data={recommands}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({item, index}) => (
                <V1RecommandInfoItem
                  index={index}
                  item={item}
                  onPress={onPressRecommand}>
                  <RateText title="9.7" />
                </V1RecommandInfoItem>
              )}
              keyExtractor={item => `${item.href}`}
              ListFooterComponent={() => <EndLine />}
            />
          </LoadingContainer>
        );
      case 'command':
        return <Command />;
      default:
        return null;
    }
  };
  const {PlayerStyle} = useContext(AppContext).theme;
  //数据相关
  const realm = useRealm();

  const onRefresh = () => {
    setRefreshing(true);
    console.log(tabName, apiName);
    const loadPage: loadInfoPage = api[tabName][apiName].info!;
    loadPage(url, data => {
      const {title, img, infoSub, recommands, sources, info, relatives} = data;
      const _anthologys = sources.map((_source, index) => {
        return {id: index, data: _source.data, title: _source.key};
      });

      let _history = realm.objectForPrimaryKey(History, url);

      //更新番剧数据库
      realm.write(() => {
        realm.create(
          RecmdInfoDb,
          {
            href: url,
            apiName,
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
            tabName,
            href: url,
            apiName,
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
      setRelatives(relatives);

      setAnthologys(_anthologys);
      setInfo(info);
      setRelatives(relatives);
      setDefaultProgress(history.current!.progress);

      setLoading(false); //页面内容获取成功，页面不再加载
      setRefreshing(false);
      const _anthologyIndex = history.current!.anthologyIndex;
      setNextDataAvailable(_anthologyIndex < _anthologys.length);
      setAnthologyIndex(_anthologyIndex); //当前播放第一集
      getPlayerData(_anthologys[_anthologyIndex].data, 0);
    });
  };

  useEffect(onRefresh, []);

  //滚动profile中的列表
  useEffect(() => {
    if (ProfileAnthologyListRef.current) {
      ProfileAnthologyListRef.current!.scrollToIndex({
        index: anthologyIndex,
      });
    }
  }, [anthologyIndex]);

  //滚动全屏后播放器选集列表
  useEffect(() => {
    if (playerAnthologyListRef.current) {
      playerAnthologyListRef.current!.scrollToIndex({
        index: history.current!.anthologyIndex,
      });
    }
  }, [playerAnthologyListRef.current]);

  //切换选集
  const changeAnthology = (index: number) => {
    //更新数据库, 记录下当前的位置
    realm.write(() => {
      history.current!.anthologyIndex = index;
      history.current!.anthologyTitle = anthologys[index].title;
    });
    setDefaultProgress(0);
    setNextDataAvailable(index + 1 < anthologys.length);
    setAnthologyIndex(index);
    setDataAvailable(false);
    getPlayerData(anthologys[index].data, 0);
  };

  //在全屏下切换下一个source
  const toNextSource = () => {
    changeAnthology(anthologyIndex + 1);
  };

  //获取player的数据源
  const getPlayerData = (playerPageUrls: string[], curIndex: number) => {
    const loadPlayerSrc = api[tabName][apiName].player!;
    if (curIndex < playerPageUrls.length) {
      const vUrl = playerPageUrls[curIndex];
      loadPlayerSrc(vUrl, (state: boolean, data: any) => {
        if (state) {
          setPlayerData(data);
          setDataAvailable(true);
        } else {
          getPlayerData(playerPageUrls, curIndex + 1);
        }
      });
    }
  };

  //更新进度回调函数
  const onProgress = (progress: number, progressPer: number) => {
    realm.write(() => {
      history.current!.progress = progress;
      history.current!.progressPer = progressPer;
    });
  };

  const renderAnthologys = (
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
        ref={playerAnthologyListRef}
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
                borderColor: PlayerStyle.playerTextColor(
                  index === anthologyIndex,
                ),
              }}>
              <InfoText
                title={item.title}
                style={{
                  fontWeight: index === anthologyIndex ? 'bold' : 'normal',
                  color: PlayerStyle.playerTextColor(index === anthologyIndex),
                }}
              />
            </View>
          </Pressable>
        )}
      />
    </View>
  );

  const onBack = () => {
    navigation.goBack();
  };
  return (
    <Container>
      {renderPlayer({
        data: playerData,
        dataAvailable,
        nextDataAvailable,
        toNextSource,
        title,
        onErr: () => {}, //todo
        onBack,
        onProgress,
        defaultProgress,
        renderAnthologys,
        defaultFullscreen: false,
        showPanel: () => {
          panelRef.current!.show();
        },
        hidePanel: () => {
          if (panelRef.current) panelRef.current.hide();
        },
        playerHeight,
      })}
      <OptionalWapper
        panelRef={panelRef}
        draggableRange={{
          top: layout.height - playerHeight,
          bottom: allowDragging ? 0 : layout.height - playerHeight,
        }}
        usePanel={!!autoFullscreen}>
        <TabView
          lazy
          renderTabBar={(props: any) => (
            <TabBar
              scrollEnabled
              {...props}
              indicatorStyle={{
                backgroundColor: PlayerStyle.indicatorColor,
                width: 0.5,
              }}
              renderLabel={({route, focused}) => (
                <InfoText
                  title={route.title!}
                  style={{
                    color: PlayerStyle.textColor(focused),
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
      </OptionalWapper>

      <DetailSheet
        top={playerHeight}
        height={layout.height + insets.top - playerHeight}
        title={title}
        src={imgUrl}
        infoSub={infoSub}
        info={info}
        visible={detailLineVisible}
        onPress={() => setDetailSheetVisible(false)}
      />

      <AnthologySheet
        top={playerHeight}
        height={layout.height + insets.top - playerHeight}
        state={infoSub.state}
        visible={anthologySheetVisible}
        onClose={() => {
          setAnthologySheetVisible(false);
        }}>
        <FlatGrid
          contentContainerStyle={{paddingBottom: 50}}
          numColumns={2}
          data={anthologys}
          renderItem={({index, item}) => (
            <Pressable
              style={{flex: 1}}
              onPress={() => changeAnthology(index)}
              key={index}>
              <View style={styles.itemContainer}>
                <SubTitle
                  title={item.title}
                  style={{
                    color: PlayerStyle.textColor(index === anthologyIndex),
                  }}
                />
              </View>
            </Pressable>
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

export default InfoPage;
export type {PlayerProps};
