import {useCallback, useContext, useEffect, useState} from 'react';
import {
  FlatList,
  View,
  useWindowDimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import {
  EmptyH1HistoryInfoItem,
  H1HistoryInfoItem,
  H1RecommandInfoItem,
} from '../component/ListItem';
import {ListTitleLine} from '../component/ListTitleLine';
import History from '../models/History';
import Context from '../models';
import HistoryInfo from '../type/HistoryInfo';
import RecmdInfoDb from '../models/RecmdInfoDb';
import {
  InfoText,
  NumberText,
  SubInfoText,
  SubTitleBold,
  Title,
} from '../component/Text';
import Follow from '../models/Follow';
import RecommandInfo from '../type/RecommandInfo';
import {TabView, TabBar} from 'react-native-tab-view';
import {useNavigation} from '@react-navigation/native';
import {TabName, targets, UserPageProps} from '../route';
import Container from '../component/Container';
import {Divider} from '@rneui/themed';
import {StyleSheet} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AppContext from '../context';
import {faYoutube} from '@fortawesome/free-brands-svg-icons';
import {
  faBusinessTime,
  faCarrot,
  faClockRotateLeft,
  faHeart,
  faLemon,
  faRankingStar,
} from '@fortawesome/free-solid-svg-icons';

import {NavBarButton} from '../component/Button';
import alert from '../component/Toast';
import {FlatGrid} from '../component/Grid';

type Data = {
  title: string;
  icon: any;
  data: string;
};

const data: Data[] = [
  {title: '全部内容', icon: faYoutube, data: 'all'},
  {title: '时间表', icon: faBusinessTime, data: 'Schedule'},
  {title: '排行榜', icon: faRankingStar, data: 'Ranking'},
  {title: '历史记录', icon: faClockRotateLeft, data: 'History'},
];

const themes = [
  {name: 'red', color: 'red'},
  {name: 'blue', color: 'dodgerblue'},
  {name: 'black', color: 'white'},
  {name: 'gold', color: 'gold'},
];

const sources = ['yinghuacd', 'scyinghua'];
const {useRealm, useQuery} = Context;

const SubPage: React.FC<{
  tabName: TabName;
}> = ({tabName}) => {
  const [historys, setHistorys] = useState<(HistoryInfo & RecommandInfo)[]>([]);
  const [follows, setFollows] = useState<RecommandInfo[]>([]);
  const navigation = useNavigation<UserPageProps['navigation']>();
  const _historys = useQuery<History>(History);
  const _follows = useQuery<Follow>(Follow);
  const realm = useRealm();
  const [numberDatas, setNumberDatas] = useState([
    {title: '浏览', number: 0, key: 'history'},
    {title: '收藏', number: 0, key: 'follow'},
    {title: '下载', number: 0, key: 'download'},
    {title: '点赞', number: 0, key: 'like'},
  ]);

  const onRefresh = () => {
    let historys = [..._historys.sorted('time', true)]
      .map(_history => {
        const _animes = realm.objectForPrimaryKey(RecmdInfoDb, _history.href);
        return {
          href: _history.href,
          progress: _history.progress,
          progressPer: _history.progressPer,
          anthologyIndex: _history.anthologyIndex,
          anthologyTitle: _history.anthologyTitle,
          time: _history.time,
          img: _animes!.img,
          title: _animes!.title,
          state: _animes!.state,
          apiName: _animes!.apiName,
          tabName: _history.tabName,
        };
      })
      .filter(history => history.tabName === tabName);
    setHistorys(historys);
    let follows = [..._follows]
      .filter(follow => follow.following)
      .reverse()
      .map(_follow => {
        const _animes = realm.objectForPrimaryKey(RecmdInfoDb, _follow.href);
        return {
          href: _follow.href,
          apiName: _animes!.apiName,
          img: _animes!.img,
          title: _animes!.title,
          state: _animes!.state,
          tabName: _follow.tabName,
        };
      })
      .filter(item => item.tabName === tabName);
    setFollows(follows);
    const newData = numberDatas.map(data => ({
      ...data,
      number:
        data.key === 'history'
          ? historys.length
          : data.key === 'follow'
          ? follows.length
          : 0,
    }));
    setNumberDatas(newData);
  };

  useEffect(onRefresh, [_historys, _follows]);
  useEffect(onRefresh, []);

  const onPress = (item: Data) => {
    switch (item.data) {
      case 'all':
        navigation.navigate('Index', {
          url: 'japan/',
          title: '全部内容',
          tabName,
        });
        break;
      case 'japan':
        navigation.navigate('Index', {
          url: 'japan/',
          title: '日本动漫',
          tabName,
        });
        break;
      case 'china':
        navigation.navigate('Index', {
          url: 'china/',
          title: '国产动漫',
          tabName,
        });
        break;
      default:
        navigation.navigate(item.data as any, {tabName});
        break;
    }
  };

  const handlePressItem = useCallback(
    (item: RecommandInfo) =>
      navigation.push(targets[tabName], {
        url: item.href,
        apiName: item.apiName,
      }),
    [],
  );

  return (
    <>
      {/* <ScrollView style={{flex: 1}}> */}
      <View
        style={{
          backgroundColor: 'white',
          padding: 10,
          paddingTop: 30,
        }}>
        <FlatList
          data={numberDatas}
          contentContainerStyle={{justifyContent: 'space-around', flex: 1}}
          horizontal
          renderItem={({item}) => (
            <View key={item.key} style={styles.numberContainer}>
              <NumberText title={`${item.number}`} />
              <SubInfoText style={{fontSize: 12}} title={item.title} />
            </View>
          )}
        />
        <FlatList
          data={data}
          contentContainerStyle={{
            marginVertical: 10,
            justifyContent: 'space-around',
            width: '100%',
          }}
          horizontal
          renderItem={({item}) => (
            <NavBarButton
              key={item.title}
              onPress={() => onPress(item)}
              title={item.title}
              icon={item.icon}
            />
          )}
        />
      </View>

      <View style={styles.cardContainer}>
        <ListTitleLine
          title="历史记录"
          buttonText="更多"
          onPress={() => navigation.navigate('History', {tabName})}
        />
        <Divider />
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
          ListEmptyComponent={() => <EmptyH1HistoryInfoItem />}
        />
      </View>
      <View style={styles.cardContainer}>
        <ListTitleLine
          title="追番"
          buttonText="更多"
          onPress={() => navigation.navigate('Follow', {tabName})}
        />
        <Divider />
        <FlatList
          horizontal
          data={follows}
          renderItem={({item, index}) => (
            <H1RecommandInfoItem
              item={item}
              index={index}
              onPress={handlePressItem}
            />
          )}
          ListEmptyComponent={() => <EmptyH1HistoryInfoItem />}
        />
      </View>
      <View style={styles.cardContainer}>
        <ListTitleLine
          title="下载管理"
          buttonText="更多"
          onPress={() => navigation.navigate('Follow', {tabName})}
        />
        <Divider />
        <FlatList
          horizontal
          data={[]}
          renderItem={({item, index}) => (
            <H1RecommandInfoItem
              item={item}
              index={index}
              onPress={handlePressItem}
            />
          )}
          ListEmptyComponent={() => <EmptyH1HistoryInfoItem />}
        />
      </View>
    </>
    // </ScrollView>
  );
};

const SettingPage = () => {
  const {theme, themeName, changeTheme, source, changeSource} =
    useContext(AppContext);
  return (
    <View style={{padding: 10}}>
      <View style={styles.cardContainer}>
        <SubTitleBold style={{marginVertical: 10}} title="用户主题" />
        <Divider />
        <FlatList
          horizontal
          data={themes}
          renderItem={({item, index}) => (
            <Pressable
              onPress={() => {
                changeTheme(item.name);
                alert('切换主题成功');
              }}
              style={{
                height: 40,
                width: 40,
                backgroundColor: item.color,
                margin: 20,
                borderWidth: 2,
                borderColor: item.name === themeName ? 'brown' : 'lightgrey',
              }}
            />
          )}
        />
      </View>
      <View style={styles.cardContainer}>
        <SubTitleBold style={{marginVertical: 10}} title="番剧数据源" />
        <Divider />
        <FlatList
          horizontal
          data={sources}
          renderItem={({item, index}) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
              }}>
              <CheckBox
                value={item === source.Anime}
                onValueChange={newValue => {
                  if (newValue) {
                    changeSource('Anime', item);
                    alert('切换数据源成功');
                  }
                }}
              />
              <InfoText title={item} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const UserPage: React.FC<{}> = () => {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {key: 'Anime', title: '番剧'},
    {key: 'Novel', title: '小说'},
    {key: 'Comic', title: '漫画'},
    {key: 'settings', title: '设置'},
  ]);

  const renderScene = ({route}: any) =>
    route.key === 'settings' ? (
      <SettingPage />
    ) : (
      <SubPage tabName={route.key} />
    );

  const layout = useWindowDimensions();
  const {HeaderStyle} = useContext(AppContext).theme;

  return (
    <Container style={{backgroundColor: '#f7f8f9'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          backgroundColor: HeaderStyle.backgroundColor,
        }}>
        <View
          style={{
            marginTop: 20,
            height: 40,
            width: '100%',
            backgroundColor: HeaderStyle.backgroundColor,
          }}>
          <Title title="我的" style={{color: HeaderStyle.textColor(false)}} />
        </View>
      </View>
      <TabView
        renderTabBar={props => (
          <TabBar
            scrollEnabled
            {...props}
            indicatorStyle={{
              backgroundColor: HeaderStyle.indicatorColor,
              width: 0.5,
            }}
            renderLabel={({route, focused, color}) => (
              <InfoText
                title={route.title}
                style={{
                  color: HeaderStyle.textColor(focused),
                  paddingHorizontal: 5,
                  fontWeight: focused ? '900' : 'normal',
                }}
              />
            )}
            style={{backgroundColor: HeaderStyle.backgroundColor}}
            tabStyle={{width: 'auto'}}
          />
        )}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 5,
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    elevation: 1.5,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 1.5,
  },
  numberContainer: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'space-between',
  },
});
export default UserPage;
