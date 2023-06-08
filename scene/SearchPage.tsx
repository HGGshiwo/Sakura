import {useContext, useEffect, useState} from 'react';
import {View, FlatList, useWindowDimensions} from 'react-native';
import {SearchBar} from '../component/SearchBar';
import {InfoText} from '../component/Text';
import {Divider} from '@rneui/themed';
import SearchInfo from '../type/SearchInfo';
import {V1SearchInfoItem} from '../component/ListItem';
import HeadBar from '../component/HeadBar';
import {LoadingContainer} from '../component/Loading';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SearchPageProps, TabName, targets} from '../route';
import Container from '../component/Container';
import {FollowButton, RoundButton} from '../component/Button';
import Context from '../models';
import Follow from '../models/FollowDb';
import alert from '../component/Toast';
import {TabBar, TabView} from 'react-native-tab-view';
import SearchPageInfo from '../type/PageInfo/SearchPageInfo';
import {ApiContext} from '../context/ApiContext';
import {ThemeContext} from '../context/ThemeContext';
import RecmdInfo from '../type/RecmdInfo';

const {useRealm} = Context;

const ResultView: React.FC<{
  searchValue: string;
  apiName: string;
  tabName: TabName;
}> = ({searchValue, apiName, tabName}) => {
  const [results, setResults] = useState<(SearchInfo & RecmdInfo)[]>([]);
  const [loading, setLoading] = useState(false);
  const [follows, setFollows] = useState<boolean[]>([]); //是否追番
  const navigation = useNavigation<SearchPageProps['navigation']>();
  const realm = useRealm();
  const {api} = useContext(ApiContext);

  useEffect(() => {
    setLoading(true);
    const loadPage = api[tabName][apiName].pages.search;
    loadPage(searchValue, ({results}: SearchPageInfo) => {
      setResults(results);
      const _follows = results.map(_result => {
        const follow = realm.objectForPrimaryKey(Follow, _result.href);
        return !!follow && follow.following;
      });
      setFollows(_follows);
      setLoading(false);
    });
  }, [searchValue]);

  // const onPress = (item: SearchInfo & RecmdInfo, index: number) => {
  //   //更新番剧数据库
  //   RecmdInfoDb.create(
  //     realm,
  //     item.id,
  //     tabName,
  //     apiName,
  //     item.img,
  //     item.state,
  //     item.title,
  //   );
  //   //更新追番记录
  //   Follow.update(realm, item.infoUrl, !follows[index]);
  //   const _follows = [...follows];
  //   _follows[index] = !_follows[index];
  //   setFollows([..._follows]);

  //   alert(`${!follows![index] ? '' : '取消'}追番成功`);
  // };

  return (
    <LoadingContainer style={{paddingTop: '30%'}} loading={loading}>
      <FlatList
        contentContainerStyle={{paddingHorizontal: 15}}
        ItemSeparatorComponent={() => {
          return <Divider />;
        }}
        keyExtractor={item => `${item.id}`}
        data={results}
        renderItem={({item, index}) => {
          return (
            <V1SearchInfoItem
              item={item}
              index={index}
              onPress={() => {
                navigation.navigate(targets[tabName], {
                  url: item.infoUrl,
                  apiName: item.apiName,
                });
              }}>
              {/* <FollowButton
                onPress={() => onPress(item, index)}
                followed={follows![index]}
              /> */}
            </V1SearchInfoItem>
          );
        }}
        ListEmptyComponent={() => (
          <View style={{alignItems: 'center', paddingTop: '20%'}}>
            <InfoText title="找不到结果" />
          </View>
        )}
      />
    </LoadingContainer>
  );
};

const SearchPage: React.FC<{}> = () => {
  const navigation = useNavigation<SearchPageProps['navigation']>();
  const route = useRoute<SearchPageProps['route']>();
  const {tabName} = route.params;
  const [searchValue, setSearchValue] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [historyVisible, setHistoryVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const {TabBarStyle} = useContext(ThemeContext).theme;
  const {api} = useContext(ApiContext);
  const [routes] = useState(
    Object.entries(api[tabName]).map(([apiName, apiObj]) => ({
      key: apiName,
      title: apiObj.name,
    })),
  );
  const layout = useWindowDimensions();

  const handleSearch = () => {
    setHistoryVisible(false);
    setSearchValue2(searchValue);
  };

  return (
    <Container>
      <HeadBar onPress={navigation.goBack}>
        <SearchBar
          searchValue={searchValue}
          style={{marginLeft: 10}}
          onChangeText={setSearchValue}
          autoFocus={true}
          onClose={() => {
            setSearchValue('');
            setHistoryVisible(true);
          }}
        />
        <RoundButton title="搜索" onPress={handleSearch} />
      </HeadBar>
      {historyVisible ? (
        <View></View>
      ) : (
        <TabView
          renderTabBar={props => (
            <TabBar
              scrollEnabled
              {...props}
              indicatorStyle={{
                backgroundColor: TabBarStyle.indicatorColor,
                width: 0.5,
              }}
              renderLabel={({route, focused, color}) => (
                <InfoText
                  title={route.title}
                  style={{
                    color: TabBarStyle.textColor(focused),
                    paddingHorizontal: 5,
                    fontWeight: focused ? '900' : 'normal',
                    width: 50,
                  }}
                />
              )}
              style={{
                backgroundColor: 'white',
              }}
              tabStyle={{width: 'auto'}}
            />
          )}
          navigationState={{index, routes}}
          renderScene={({route}) => (
            <ResultView
              searchValue={searchValue2}
              apiName={route.key}
              tabName={tabName}
            />
          )}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
      )}
    </Container>
  );
};

export default SearchPage;
