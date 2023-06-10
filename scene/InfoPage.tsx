import {useRef, useState, useEffect, useContext, ReactElement} from 'react';
import {View, useWindowDimensions, StyleSheet} from 'react-native';
import {DetailSheet} from '../component/DetailSheet';
import {AnthologySheet} from '../component/AnthologySheet';
import Container from '../component/Container';
import {InfoText} from '../component/Text';
import {TabBar, TabView} from 'react-native-tab-view';
import {useNavigation, useRoute} from '@react-navigation/native';
import {InfoPageProps} from '../route';
import SlidingUpPanel, {SlidingUpPanelProps} from 'rn-sliding-up-panel';
import Profile from '../component/Profile';
import DownloadSheet from '../component/DownloadSheet';
import createContext from 'zustand/context';
import createStore, {State, Action} from '../zustand/PageInfo';
import {UseBoundStore, StoreApi} from 'zustand';
import ComicPlayer from '../component/ComicPlayer';
import VideoPlayer from '../component/VideoPlayer';
import TextPlayer from '../component/TextPlayer';
import useTheme from '../zustand/Theme';

const pageConfig = {
  Comic: {
    player: <ComicPlayer />,
    draggable: true,
    autoFullscreen: true,
  },
  Anime: {
    player: <VideoPlayer />,
    draggable: false,
    autoFullscreen: false,
  },
  Novel: {
    player: <TextPlayer />,
    draggable: true,
    autoFullscreen: true,
  },
};

const {Provider, useStore} =
  createContext<UseBoundStore<StoreApi<State & Action>>>();
const Command = () => <View style={{flex: 1}}></View>;

const routes = [
  {key: 'profile', title: '简介'},
  {key: 'command', title: '评论'},
] as any;

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

const renderScene = ({route}: {route: {key: 'profile' | 'command'}}) => {
  return {
    profile: <Profile />,
    command: <Command />,
  }[route.key];
};

const InfoPage: React.FC<{}> = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const width = useRef(layout.width); //不希望profile宽度被修改
  const navigation = useNavigation<InfoPageProps['navigation']>();
  const panelRef = useRef<SlidingUpPanel | null>(); // profile panel的ref

  const {PlayerStyle} = useTheme().theme;
  const {textColor, playerTextColor, indicatorColor} = PlayerStyle;
  const route = useRoute<InfoPageProps['route']>();
  const {infoUrl, taskUrl, tabName, apiName} = route.params;

  const {
    load,
    playerHeight,
    detailSheetVisible,
    episodeSheetVisible,
    downloadSheetVisible,
  } = useStore();
  //数据相关
  load(infoUrl, taskUrl, tabName, apiName);

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <Container tabName={tabName}>
      {pageConfig[tabName].player}
      <OptionalWapper
        panelRef={panelRef}
        draggableRange={{
          top: layout.height - playerHeight,
          bottom: pageConfig[tabName].draggable
            ? 0
            : layout.height - playerHeight,
        }}
        usePanel={!!pageConfig[tabName].autoFullscreen}>
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
      {detailSheetVisible && <DetailSheet />}
      {episodeSheetVisible && <AnthologySheet />}
      {downloadSheetVisible && <DownloadSheet />}
    </Container>
  );
};

const InfoPageWithStore: React.FC<{}> = () => {
  const route = useRoute<InfoPageProps['route']>();
  const {tabName} = route.params;
  return (
    <Provider createStore={() => createStore(tabName)}>
      <InfoPage />
    </Provider>
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

export default InfoPageWithStore;
export {useStore};
