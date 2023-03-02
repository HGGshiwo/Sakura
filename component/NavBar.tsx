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

interface Props {
  onPress: (href: string)=>void;
}

const NavBar: React.FC<Props> = ({onPress}) => {
  const data = [
    {title: '全部内容', icon: faYoutube, href: 'Index'},
    {title: '时间表', icon: faBusinessTime, href: 'Tab'},
    {title: '排行榜', icon: faRankingStar, href: 'Tab'},
    {title: '历史记录', icon: faClockRotateLeft, href: 'Tab'},
    {title: '国创', icon: faCarrot, href: 'Tab'},
    {title: '日漫', icon: faLemon, href: 'Tab'},
    {title: '我的追番', icon: faHeart, href: 'Tab'}
  ];

  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.container}
      data={data}
      ItemSeparatorComponent={() => <View style={{width: 30}} />}
      renderItem={({item}) => {
        return (
          <Pressable onPress={()=>onPress(item.href)}>
          <View style={styles.itemContainer}>
            <FontAwesomeIcon color="deeppink" size={25} icon={item.icon} />
            <Text style={{fontSize: 12, paddingTop: 5}}>{`${item.title}`}</Text>
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
    justifyContent:'flex-start'
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export {NavBar};
