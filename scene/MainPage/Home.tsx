import React, {useCallback, useContext, useEffect, useState} from 'react';
import RecmdInfo from '../../type/RecmdInfo';
import {ParallaxCarousel} from '../../component/ParallaxCarousel';
import {NavBar} from '../../component/NavBar';
import {ListTitleLine} from '../../component/ListTitleLine';
import {FlatList} from 'react-native-gesture-handler';
import {H1HistoryInfoItem, V2RecmdInfoItem} from '../../component/ListItem';
import Context from '../../models';
import History from '../../models/HistoryDb';
import HistoryInfo from '../../type/HistoryInfo';
import {LoadingContainer} from '../../component/Loading';
import {useNavigation} from '@react-navigation/native';
import {MainPageProps, TabName, targets} from '../../route';
import alert from '../../component/Toast';
import {SectionGrid} from '../../component/Grid';
import HomePageInfo from '../../type/PageInfo/HomePageInfo';
import {SrcContext} from '../../context/SrcContext';
import {ApiContext} from '../../context/ApiContext';
import SectionDb from '../../models/SectionDb';

const {useRealm, useQuery} = Context;

const Home: React.FC<{
  tabName: TabName;
  home: boolean;
  apiName: string;
  url: string;
}> = ({tabName, home, apiName, url}) => {
  const [pageInfo, setPageInfo] = useState<HomePageInfo>();
  const [historys, setHistorys] = useState<(HistoryInfo & RecmdInfo)[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('加载中...');
  const _historys = useQuery<History>(History);
  const realm = useRealm();
  const navigation = useNavigation<MainPageProps['navigation']>();
  const [refreshing, setRefreshing] = useState(false);
  const {source} = useContext(SrcContext);
  const {api} = useContext(ApiContext);

  const onRefresh = () => {
    setRefreshing(true);
    console.log(tabName, apiName, url);
    const _api = api[tabName][apiName].pages;
    const loadPage = home ? _api.home : _api.other;
    loadPage(
      url,
      (data: any) => {
        //debugger;
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

  useEffect(() => {
    let historys = [..._historys.sorted('time', true)]
      .map(_history => {
        const _animes = realm.objectForPrimaryKey(SectionDb, _history.infoUrl)!;
        return {
          ..._history.extract(),
          ..._animes.toRecmdInfo(),
        };
      })
      .filter(history => history.tabName === tabName)
      .slice(0, 10);
    setHistorys(historys);
  }, [_historys]);

  useEffect(onRefresh, [source]);
  useEffect(onRefresh, []);

  const handlePressItem = useCallback(
    (item: RecmdInfo) =>
      navigation.push(targets[tabName], {
        url: item.infoUrl,
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
            {!!pageInfo?.carousels?.length && (
              <ParallaxCarousel
                onPress={handlePressItem}
                carousels={pageInfo.carousels}
              />
            )}
            {!!home && (
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
        keyExtractor={item => item.infoUrl}
        renderItem={({index, item}) => (
          <V2RecmdInfoItem
            index={index}
            item={item}
            key={index}
            onPress={handlePressItem}
          />
        )}
        renderSectionHeader={({section: {title, infoUrl}}) => (
          <ListTitleLine
            title={title}
            buttonText={!!infoUrl && infoUrl !== '' ? '更多' : ''}
            onPress={() =>
              navigation.navigate('Index', {
                url: infoUrl,
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
