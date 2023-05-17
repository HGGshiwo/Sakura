import React, {useCallback, useContext, useEffect, useState} from 'react';
import RecommandInfo from '../../type/RecommandInfo';
import {ParallaxCarousel} from '../../component/ParallaxCarousel';
import {NavBar} from '../../component/NavBar';
import {ListTitleLine} from '../../component/ListTitleLine';
import {FlatList} from 'react-native-gesture-handler';
import {H1HistoryInfoItem, V2RecommandInfoItem} from '../../component/ListItem';
import Context from '../../models';
import History from '../../models/History';
import HistoryInfo from '../../type/HistoryInfo';
import {LoadingContainer} from '../../component/Loading';
import RecmdInfoDb from '../../models/RecmdInfoDb';
import {useNavigation} from '@react-navigation/native';
import {MainPageProps, TabName, targets} from '../../route';
import api from '../../api';
import alert from '../../component/Toast';
import AppContext from '../../context';
import {SectionGrid} from '../../component/Grid';
import HomePageInfo from '../../type/PageInfo/HomePageInfo';
import { SrcContext } from '../../context/SrcContext';
import { ApiContext } from '../../context/ApiContext';

const {useRealm, useQuery} = Context;

const Home: React.FC<{
  tabName: TabName;
  home: boolean;
  apiName: string;
  url: string;
}> = ({tabName, home, apiName, url}) => {
  const [pageInfo, setPageInfo] = useState<HomePageInfo>();
  const [historys, setHistorys] = useState<(HistoryInfo & RecommandInfo)[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('加载中...');
  const _historys = useQuery<History>(History);
  const realm = useRealm();
  const navigation = useNavigation<MainPageProps['navigation']>();
  const [refreshing, setRefreshing] = useState(false);
  const {source} = useContext(SrcContext);
  const {api} = useContext(ApiContext)

  const onRefresh = () => {
    setRefreshing(true);
    console.log(tabName, apiName, url);
    const _api = api[tabName][apiName].pages;
    const loadPage = home ? _api.home : _api.other;
    loadPage(
      url,
      (data: any) => {
        setPageInfo(data);
        setLoading(false);
        setRefreshing(false);
        if (!loading) {
          alert('刷新成功');
        }
      },
      (err: string) => console.log(err),
    );
  };

  const mergeHistoryRecmdItem = (_history: History, _animes: RecmdInfoDb) => ({
    href: _history.href,
    apiName: _animes!.apiName,
    progress: _history.progress,
    progressPer: _history.progressPer,
    anthologyIndex: _history.anthologyIndex,
    anthologyTitle: _history.anthologyTitle,
    time: _history.time,
    img: _animes!.img,
    title: _animes!.title,
    state: _animes!.state,
  });

  useEffect(() => {
    let historys = [..._historys.sorted('time', true)]
      .filter(history => history.tabName === tabName)
      .slice(0, 10)
      .map(_history => {
        const _animes = realm.objectForPrimaryKey(RecmdInfoDb, _history.href)!;
        return mergeHistoryRecmdItem(_history, _animes);
      });
    setHistorys(historys);
  }, [_historys]);

  useEffect(onRefresh, [source]);
  useEffect(onRefresh, []);

  const handlePressItem = useCallback(
    (item: RecommandInfo) =>
      navigation.push(targets[tabName], {
        url: item.href,
        apiName: item.apiName,
      }),
    [],
  );

  return (
    <LoadingContainer loading={loading} text={text} style={{paddingTop: '30%'}}>
      <SectionGrid
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 40}}
        ListHeaderComponent={
          <>
            {pageInfo?.carousels?.length && (
              <ParallaxCarousel
                onPress={handlePressItem}
                carousels={pageInfo.carousels}
              />
            )}
            {home && (
              <>
                <NavBar />
                <ListTitleLine
                  show={historys.length !== 0}
                  title="最近在看"
                  buttonText="更多"
                  onPress={() => navigation.navigate('History', {tabName})}
                />
                <FlatList
                  horizontal
                  data={historys}
                  renderItem={({item, index}) => (
                    <H1HistoryInfoItem
                      item={item}
                      index={index}
                      onPress={handlePressItem}
                    />
                  )}
                />
              </>
            )}
          </>
        }
        sections={pageInfo ? pageInfo.sections : []}
        numColumns={2}
        keyExtractor={item => item.href}
        renderItem={({index, item}) => (
          <V2RecommandInfoItem
            index={index}
            item={item}
            key={index}
            onPress={handlePressItem}
          />
        )}
        renderSectionHeader={({section: {title, href}}) => (
          <ListTitleLine
            title={title}
            buttonText={(!!href && href !== '') ? '更多' : ''}
            onPress={() =>
              navigation.navigate('Index', {
                url: href,
                title,
                tabName,
                apiName,
              })
            }
          />
        )}
      />
    </LoadingContainer>
  );
};

export default Home;
