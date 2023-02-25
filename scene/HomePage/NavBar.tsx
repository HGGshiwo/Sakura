import {View, Text, Dimensions, StyleSheet, FlatList} from 'react-native';
import {useEffect, useState} from 'react';
import {Agent} from '../../api/yinghuacd/HomeAgent';
import {RecommandInfo} from '../../type/RecommandInfo';
import {ParallaxCarousel} from './ParallaxCarousel';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faYoutube} from '@fortawesome/free-brands-svg-icons';
import {
  faBusinessTime,
  faCarrot,
  faClock,
  faClockRotateLeft,
  faHeart,
  faLemon,
  faRankingStar,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  navigation: any;
}

const NavBar: React.FC<Props> = ({navigation}) => {
  const data = [
    {title: '全部内容', icon: faYoutube},
    {title: '时间表', icon: faBusinessTime},
    {title: '排行榜', icon: faRankingStar},
    {title: '历史记录', icon: faClockRotateLeft},
    {title: '国创', icon: faCarrot},
    {title: '日漫', icon: faLemon},
    {title: '我的追番', icon: faHeart}
  ];

  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.container}
      data={data}
      ItemSeparatorComponent={() => <View style={{width: 30}} />}
      renderItem={({item}) => {
        return (
          <View style={styles.itemContainer}>
            <FontAwesomeIcon color="deeppink" size={25} icon={item.icon} />
            <Text style={{fontSize: 12, paddingTop: 5}}>{`${item.title}`}</Text>
          </View>
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
