import {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  View,
  useWindowDimensions,
  SectionList,
  Pressable,
} from 'react-native';
import {
  EmptyH1HistoryInfoItem,
  H1HistoryInfoItem,
  H1RecommandInfoItem,
} from '../../component/ListItem';
import {ListTitleLine} from '../../component/ListTitleLine';
import History from '../../models/History';
import Context from '../../models';
import HistoryInfo from '../../type/HistoryInfo';

import Anime from '../../models/Anime';
import {
  InfoText,
  NumberText,
  SubInfoText,
  SubTitleBold,
  Title,
} from '../../component/Text';
import Follow from '../../models/Follow';
import {RecommandInfo} from '../../type/RecommandInfo';
const {useRealm, useQuery} = Context;
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useNavigation} from '@react-navigation/native';
import {UserPageProps} from '../../type/route';
import Container from '../../component/Container';
import {Divider} from '@rneui/themed';
import {StyleSheet} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import ThemeContext from '../../theme';
import {faYoutube} from '@fortawesome/free-brands-svg-icons';
import {
  faBusinessTime,
  faCarrot,
  faClockRotateLeft,
  faHeart,
  faLemon,
  faRankingStar,
} from '@fortawesome/free-solid-svg-icons';
import MultiItemRow from '../../component/MultiItemRow';
import {NavBarButton} from '../../component/Button';
import alert from '../../component/Toast';

const UserPage: React.FC<{}> = () => {
  const [historys, setHistorys] = useState<HistoryInfo[]>([]);
  const [follows, setFollows] = useState<RecommandInfo[]>([]);
  const [index, setIndex] = useState(0);
  const navigation = useNavigation<UserPageProps['navigation']>();
  const _historys = useQuery<History>(History);
  const _follows = useQuery<Follow>(Follow);
  const {theme, themeName, changeTheme} = useContext(ThemeContext);
  const realm = useRealm();

  const [routes] = useState([
    {key: 'first', title: '番剧'},
    {key: 'second', title: '小说'},
    {key: 'third', title: '漫画'},
    {key: 'forth', title: '设置'},
  ]);
  useEffect(() => {
    let historys = [..._historys.sorted('time', true)].map(_history => {
      const _animes = realm.objectForPrimaryKey(Anime, _history.href);
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
      };
    });
    setHistorys(historys);
  }, [_historys]);

  type Data = {
    title: string;
    icon: any;
    data: string;
  };

  const onPress = (item: Data) => {
    switch (item.data) {
      case 'all':
        navigation.navigate('Index', {url: 'japan/', title: '全部内容'});
        break;
      case 'japan':
        navigation.navigate('Index', {url: 'japan/', title: '日本动漫'});
        break;
      case 'china':
        navigation.navigate('Index', {url: 'china/', title: '国产动漫'});
        break;
      default:
        navigation.navigate(
          item.data as 'Follow' | 'History' | 'Ranking' | 'Schedule',
        );
        break;
    }
  };

  const data: Data[] = [
    {title: '全部内容', icon: faYoutube, data: 'all'},
    {title: '时间表', icon: faBusinessTime, data: 'Schedule'},
    {title: '排行榜', icon: faRankingStar, data: 'Ranking'},
    {title: '历史记录', icon: faClockRotateLeft, data: 'History'},
    {title: '国创', icon: faCarrot, data: 'china'},
    {title: '日漫', icon: faLemon, data: 'japan'},
    {title: '我的追番', icon: faHeart, data: 'Follow'},
  ];

  const themes = [
    {name: 'red', color: 'red'},
    {name: 'blue', color: 'dodgerblue'},
    {name: 'black', color: 'black'},
    {name: 'gold', color: 'gold'},
  ];

  const sources = ['yinghuadm', 'scyinghua'];

  useEffect(() => {
    let follows = [..._follows]
      .filter(follow => follow.following)
      .reverse()
      .map(_history => {
        const _animes = realm.objectForPrimaryKey(Anime, _history.href);
        return {
          href: _history.href,
          img: _animes!.img,
          title: _animes!.title,
          state: _animes!.state,
        };
      });
    setFollows(follows);
  }, [_follows]);

  const FirstRoute = () => (
    <FlatList
      data={data}
      renderItem={({index, item}) => (
        <MultiItemRow
          containerStyle={{backgroundColor: 'white', padding: 10}}
          index={index}
          numberOfItem={4}
          datas={data}>
          {(index, item) => (
            <NavBarButton
              key={index}
              onPress={() => onPress(item)}
              title={item.title}
              icon={item.icon}
            />
          )}
        </MultiItemRow>
      )}
      ListHeaderComponent={
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            paddingTop: 30,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <View style={styles.numberContainer}>
              <NumberText title={`${_historys.length}`} />
              <SubInfoText style={{fontSize: 12}} title="浏览" />
            </View>
            <View style={styles.numberContainer}>
              <NumberText title={`${_follows.length}`} />
              <SubInfoText style={{fontSize: 12}} title="收藏" />
            </View>
            <View style={styles.numberContainer}>
              <NumberText title={`${0}`} />
              <SubInfoText style={{fontSize: 12}} title="下载" />
            </View>
            <View style={styles.numberContainer}>
              <NumberText title={`${0}`} />
              <SubInfoText style={{fontSize: 12}} title="点赞" />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}></View>
        </View>
      }
      ListFooterComponent={
        <>
          <View style={styles.cardContainer}>
            <ListTitleLine
              title="历史记录"
              buttonText="更多"
              onPress={() => {
                navigation.navigate('History');
              }}
            />
            <Divider />
            <FlatList
              horizontal
              data={historys}
              renderItem={({item, index}) => (
                <H1HistoryInfoItem
                  item={item}
                  index={index}
                  onPress={item => {
                    navigation.push('Video', {url: item.href});
                  }}
                />
              )}
              ListEmptyComponent={() => <EmptyH1HistoryInfoItem />}
            />
          </View>
          <View style={styles.cardContainer}>
            <ListTitleLine
              title="追番"
              buttonText="更多"
              onPress={() => {
                navigation.navigate('Follow');
              }}
            />
            <Divider />
            <FlatList
              horizontal
              data={follows}
              renderItem={({item, index}) => (
                <H1RecommandInfoItem
                  item={item}
                  index={index}
                  onPress={item => {
                    navigation.push('Video', {url: item.href});
                  }}
                />
              )}
              ListEmptyComponent={() => <EmptyH1HistoryInfoItem />}
            />
          </View>
          <View style={styles.cardContainer}>
            <ListTitleLine
              title="下载管理"
              buttonText="更多"
              onPress={() => {
                navigation.navigate('Follow');
              }}
            />
            <Divider />
            <FlatList
              horizontal
              data={[]}
              renderItem={({item, index}) => (
                <H1RecommandInfoItem
                  item={item}
                  index={index}
                  onPress={item => {
                    navigation.push('Video', {url: item.href});
                  }}
                />
              )}
              ListEmptyComponent={() => <EmptyH1HistoryInfoItem />}
            />
          </View>
        </>
      }
    />
  );

  const SecondRoute = () => <View style={{flex: 1}} />;

  const thirdRoute = () => <View style={{flex: 1}} />;

  const forthRoute = () => {
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
                  changeTheme(item.name as any);
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
                  value={true}
                  onValueChange={newValue => {
                    alert('切换数据源成功');
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
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: thirdRoute,
    forth: forthRoute,
  });

  const layout = useWindowDimensions();
  const {HeaderStyle} = useContext(ThemeContext).theme;

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
