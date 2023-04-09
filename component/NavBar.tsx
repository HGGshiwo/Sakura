import {View, StyleSheet, FlatList} from 'react-native';
import {faYoutube} from '@fortawesome/free-brands-svg-icons';
import {
  faBusinessTime,
  faCarrot,
  faClockRotateLeft,
  faHeart,
  faLemon,
  faRankingStar,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {UserPageProps} from '../route';
import {NavBarButton} from './Button';

type Data = {
  title: string;
  icon: any;
  data:
    | 'Follow'
    | 'History'
    | 'Ranking'
    | 'Schedule'
    | 'all'
    | 'japan'
    | 'china';
};

const NavBar: React.FC<{}> = () => {
  const navigation = useNavigation<UserPageProps['navigation']>();
  const data: Data[] = [
    {title: '全部内容', icon: faYoutube, data: 'all'},
    {title: '时间表', icon: faBusinessTime, data: 'Schedule'},
    {title: '排行榜', icon: faRankingStar, data: 'Ranking'},
    {title: '历史记录', icon: faClockRotateLeft, data: 'History'},
    {title: '国创', icon: faCarrot, data: 'china'},
    {title: '日漫', icon: faLemon, data: 'japan'},
    {title: '我的追番', icon: faHeart, data: 'Follow'},
  ];
  const tabName = 'Anime';
  const apiName = 'yinghuacd';
  const onPress = (item: Data) => {
    switch (item.data) {
      case 'all':
        navigation.navigate('Index', {
          url: 'japan',
          title: '全部内容',
          tabName,
          apiName,
        });
        break;
      case 'japan':
        navigation.navigate('Index', {
          url: 'japan',
          title: '日本动漫',
          tabName,
          apiName,
        });
        break;
      case 'china':
        navigation.navigate('Index', {
          url: 'china',
          title: '国产动漫',
          tabName,
          apiName,
        });
        break;
      default:
        navigation.navigate(item.data, {tabName});
        break;
    }
  };

  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.container}
      data={data}
      ItemSeparatorComponent={() => <View style={{width: 10}} />}
      renderItem={({item}) => {
        return (
          <NavBarButton
            onPress={() => onPress(item)}
            title={item.title}
            icon={item.icon}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export {NavBar};
