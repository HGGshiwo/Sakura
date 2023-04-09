import {
  ReactNode,
  useRef,
  useState,
  useEffect,
  createRef,
  useContext,
  RefObject,
  ReactElement,
} from 'react';
import {
  View,
  useWindowDimensions,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import {ListItemInfo} from '../type/ListItemInfo';
import {DetailSheet} from '../component/DetailSheet';
import {AnthologySheet} from '../component/AnthologySheet';
import Context from '../models';
import History from '../models/History';
import RecmdInfoDb from '../models/RecmdInfoDb';
import Container from '../component/Container';
import {InfoText, SubTitle} from '../component/Text';
import {TabBar, TabView} from 'react-native-tab-view';
import AppContext from '../context';
import {useNavigation} from '@react-navigation/native';
import {VideoPageProps} from '../route';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SlidingUpPanel, {SlidingUpPanelProps} from 'rn-sliding-up-panel';
import {FlatGrid} from '../component/Grid';
import Profile from '../component/Profile';
import DownloadSheet from '../component/DownloadSheet';
import InfoPageInfo from '../type/PageInfo/InfoPageInfo';

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
  flashData?: boolean; //是否需要删除之前缓存的数据
}

const {useRealm} = Context;
const Command = () => <View style={{flex: 1}}></View>;

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
  const width = useRef(layout.width); //不希望profile宽度被修改
  const [dataAvailable, setDataAvailable] = useState(false); //playerd的数据源是否可用
  const dataAvailableRef = useRef(false); //playerd的数据源是否可用

  //页面展示的数据
  const [pageInfo, setPageInfo] = useState<InfoPageInfo>();

  //sheet是否可见
  const [detailLineVisible, setDetailSheetVisible] = useState(false);
  const [anthologySheetVisible, setAnthologySheetVisible] = useState(false);
  const [downloadSheetVisible, setDownloadSheetVisible] = useState(false);

  const [defaultProgress, setDefaultProgress] = useState(0);
  const [nextDataAvailable, setNextDataAvailable] = useState(false);

  const [anthologyIndex, setAnthologyIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false); //是否刷新
  const [loading, setLoading] = useState(true); //页面是否在加载中

  const history = useRef<History | null>(); //历史记录查询结果

  const navigation = useNavigation<VideoPageProps['navigation']>();
  const panelRef = useRef<SlidingUpPanel | null>(); // profile panel的ref
  const [flashData, setFlashData] = useState(true); //如果不是通过nextSource切换，则flash
  const [anthologyTitle, setAnthologyTitle] = useState(' '); //选集的名字，在player中显示

  const ProfileAnthologyListRef = createRef<FlatList<ListItemInfo>>();
  const playerAnthologyListRef = createRef<FlatList<ListItemInfo>>();

  const {theme: {PlayerStyle}, api} = useContext(AppContext);
  const {textColor, playerTextColor, indicatorColor} = PlayerStyle;

  const renderScene = ({route}: any) => {
    switch (route.key) {
      case 'profile':
        return (
          <Profile
            loading={loading}
            refreshing={refreshing}
            onRefresh={onRefresh}
            pageInfo={pageInfo!}
            url={url}
            tabName={tabName}
            setDetailSheetVisible={setDetailSheetVisible}
            setAnthologySheetVisible={setAnthologySheetVisible}
            setDownloadSheetVisible={setDownloadSheetVisible}
            renderAnthologys={() => (
              <FlatList
                ref={ProfileAnthologyListRef}
                getItemLayout={(item, index) => ({
                  length: 170,
                  offset: 170 * index,
                  index,
                })}
                style={{marginBottom: 20}}
                horizontal={true}
                data={pageInfo?.sources}
                renderItem={({item, index}) => (
                  <Pressable
                    onPress={() => {
                      setFlashData(true);
                      changeAnthology(item.id);
                    }}>
                    <View style={styles.itemContainer2}>
                      <SubTitle
                        title={item.title}
                        style={{color: textColor(anthologyIndex === index)}}
                      />
                    </View>
                  </Pressable>
                )}
                keyExtractor={item => `${item.id}`}
              />
            )}
          />
        );
      case 'command':
        return <Command />;
      default:
        return null;
    }
  };

  //数据相关
  const realm = useRealm();

  const onRefresh = () => {
    setRefreshing(true);
    console.log(tabName, apiName, url);
    const loadPage = api[tabName][apiName].pages.info!;
    loadPage(
      url,
      (pageInfo: InfoPageInfo) => {
        const {img, state, title, sources} = pageInfo;
        let _history = realm.objectForPrimaryKey(History, url);
        //更新番剧数据库
        RecmdInfoDb.update(realm, url, apiName, img, state, title);
        //更新历史记录数据库
        history.current = History.update(
          realm,
          tabName,
          url,
          apiName,
          _history!,
          sources[0],
        );
        setPageInfo(pageInfo);
        setDefaultProgress(history.current!.progress);

        setLoading(false); //页面内容获取成功，页面不再加载
        setRefreshing(false);
        const _anthologyIndex = history.current!.anthologyIndex;
        setNextDataAvailable(_anthologyIndex < pageInfo.sources.length);
        setAnthologyIndex(_anthologyIndex); //当前播放第一集
        setAnthologyTitle(
          `${pageInfo.title} ${history.current!.anthologyTitle}`,
        );
        setFlashData(true);
        getPlayerData(pageInfo.sources[_anthologyIndex].data);
      },
      (err: string) => console.log(err),
    );
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
    const {sources, title} = pageInfo!;
    //更新数据库, 记录下当前的位置
    realm.write(() => {
      history.current!.anthologyIndex = index;
      history.current!.anthologyTitle = sources[index].title;
    });
    setDefaultProgress(0);
    setNextDataAvailable(index + 1 < sources.length);
    setAnthologyIndex(index);
    setAnthologyTitle(`${title} ${sources[index].title}`);
    setDataAvailable(false);
    dataAvailableRef.current = false;
    getPlayerData(sources[index].data);
  };

  //在全屏下切换下一个source
  const toNextSource = () => {
    if (!dataAvailableRef.current) {
      return; //不允许在加载页面的时候切换
    }
    setFlashData(false);
    changeAnthology(anthologyIndex + 1);
  };

  //获取player的数据源
  const getPlayerData = (playerPageUrl: string, _times?: number) => {
    let times = _times === undefined ? 3 : _times; //默认尝试3次
    const loadPlayerSrc = api[tabName][apiName].pages.player!;
    if (times > 0) {
      loadPlayerSrc(
        playerPageUrl,
        (data: any) => {
          setPlayerData(data);
          setDataAvailable(true);
          dataAvailableRef.current = true;
        },
        (err: string) => {
          console.log(err, "下一次尝试开始")
          getPlayerData(playerPageUrl, times - 1)
        },
      );
    }
    else {
      console.log('无法获取到播放地址...')
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
    <View style={[{display: show ? 'flex' : 'none'}, styles.listContainer]}>
      <FlatList
        ref={playerAnthologyListRef}
        getItemLayout={(item, index) => ({
          length: 45,
          offset: 45 * index,
          index,
        })}
        data={pageInfo?.sources}
        renderItem={({item, index}) => (
          <Pressable
            style={{flex: 1}}
            onPress={() => {
              setFlashData(true);
              changeAnthology(index);
              setVisible(false);
            }}>
            <View
              style={[
                styles.card,
                {borderColor: playerTextColor(index === anthologyIndex)},
              ]}>
              <InfoText
                title={item.title}
                style={{
                  fontWeight: index === anthologyIndex ? 'bold' : 'normal',
                  color: playerTextColor(index === anthologyIndex),
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
        title: anthologyTitle,
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
        flashData,
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
          sceneContainerStyle={{width: width.current}}
          renderTabBar={(props: any) => (
            <TabBar
              scrollEnabled
              {...props}
              indicatorStyle={{
                backgroundColor: indicatorColor,
                width: 0.5,
              }}
              renderLabel={({route, focused}) => (
                <InfoText
                  title={route.title!}
                  style={{
                    color: textColor(focused),
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
        pageInfo={pageInfo!}
        visible={detailLineVisible}
        onPress={() => setDetailSheetVisible(false)}
      />

      <AnthologySheet
        top={playerHeight}
        height={layout.height + insets.top - playerHeight}
        state={pageInfo?.state}
        visible={anthologySheetVisible}
        onClose={() => setAnthologySheetVisible(false)}>
        <FlatGrid
          contentContainerStyle={{paddingBottom: 50}}
          numColumns={2}
          data={pageInfo?.sources}
          renderItem={({index, item}) => (
            <Pressable
              style={{flex: 1}}
              onPress={() => {
                setFlashData(true);
                changeAnthology(index);
              }}
              key={index}>
              <View style={styles.itemContainer}>
                <SubTitle
                  title={item.title}
                  style={{color: textColor(index === anthologyIndex)}}
                />
              </View>
            </Pressable>
          )}
        />
      </AnthologySheet>

      <DownloadSheet
        title={pageInfo?.title}
        tabName={tabName}
        apiName={apiName}
        top={playerHeight}
        height={layout.height + insets.top - playerHeight}
        state={pageInfo?.state}
        visible={downloadSheetVisible}
        url={url}
        onClose={() => setDownloadSheetVisible(false)}
        data={pageInfo?.sources}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    height: 40,
    padding: 10,
    margin: 5,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
  },
  listContainer: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,1)',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    right: 0,
    bottom: 0,
  },
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
