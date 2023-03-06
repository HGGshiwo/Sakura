import {useEffect, useState} from 'react';
import {FlatList, View, useWindowDimensions} from 'react-native';
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
import {Title} from '../../component/Text';
import Follow from '../../models/Follow';
import {RecommandInfo} from '../../type/RecommandInfo';
const {useRealm, useQuery} = Context;
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useNavigation} from '@react-navigation/native';
import {UserPageProps} from '../../type/route';
import Container from '../../component/Container';
import {Divider} from '@rneui/themed';

const UserPage: React.FC<{}> = () => {
  const [historys, setHistorys] = useState<HistoryInfo[]>([]);
  const [follows, setFollows] = useState<RecommandInfo[]>([]);
  const [index, setIndex] = useState(0);
  const navigation = useNavigation<UserPageProps['navigation']>();
  const _historys = useQuery<History>(History);
  const _follows = useQuery<Follow>(Follow);

  const realm = useRealm();

  const [routes] = useState([
    {key: 'first', title: '番剧'},
    {key: 'second', title: '小说'},
    {key: 'third', title: '漫画'},
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
    <View style={{paddingHorizontal: 10}}>
      <ListTitleLine
        title="历史记录"
        buttonText="更多"
        onPress={() => {
          navigation.navigate('History');
        }}
      />
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
      <Divider />
      <ListTitleLine
        title="追番"
        buttonText="更多"
        onPress={() => {
          navigation.navigate('Follow');
        }}
      />
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
      <Divider />
    </View>
  );

  const SecondRoute = () => <View style={{flex: 1}} />;

  const thirdRoute = () => <View style={{flex: 1}} />;

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: thirdRoute,
  });

  const layout = useWindowDimensions();

  return (
    <Container>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          backgroundColor: '#ff4081',
        }}>
        <View
          style={{
            marginTop: 20,
            height: 40,
            width: '100%',
            backgroundColor: '#ff4081',
          }}>
          <Title style={{color: 'white'}} title="我的" />
        </View>
      </View>
      <TabView
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{backgroundColor: 'white'}}
            style={{backgroundColor: '#ff4081'}}
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

export default UserPage;
