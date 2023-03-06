import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
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
import {NoParamProps} from '../type/route';

type Data = {
  title: string;
  icon: any;
  data: string;
};

const NavBar: React.FC<{}> = () => {
  const navigation = useNavigation<NoParamProps['navigation']>();
  const data: Data[] = [
    {title: '全部内容', icon: faYoutube, data: 'all'},
    {title: '时间表', icon: faBusinessTime, data: 'Schedule'},
    {title: '排行榜', icon: faRankingStar, data: 'Ranking'},
    {title: '历史记录', icon: faClockRotateLeft, data: 'History'},
    {title: '国创', icon: faCarrot, data: 'china'},
    {title: '日漫', icon: faLemon, data: 'japan'},
    {title: '我的追番', icon: faHeart, data: 'Follow'},
  ];

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

  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.container}
      data={data}
      ItemSeparatorComponent={() => <View style={{width: 30}} />}
      renderItem={({item}) => {
        return (
          <Pressable onPress={() => onPress(item)}>
            <View style={styles.itemContainer}>
              <FontAwesomeIcon color="deeppink" size={25} icon={item.icon} />
              <Text
                style={{fontSize: 12, paddingTop: 5}}>{`${item.title}`}</Text>
            </View>
          </Pressable>
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
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export {NavBar};
