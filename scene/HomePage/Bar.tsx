import {View, Text, Dimensions, StyleSheet, FlatList} from 'react-native';
import {useEffect, useState} from 'react';
import {Agent} from '../../api/yinghuacd/HomeAgent';
import {RecommandInfo} from '../../type/RecommandInfo';
import {ParallaxCarousel} from './ParallaxCarousel';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faYoutube} from '@fortawesome/free-brands-svg-icons';
import {faBusinessTime, faClock, faClockRotateLeft, faRankingStar} from '@fortawesome/free-solid-svg-icons';


interface Props {
  navigation: any
}

const Bar:React.FC<Props> = ({navigation}) => {


  const data = [
    {title: '全部内容', icon: faYoutube},
    {title: '时间表', icon: faBusinessTime},
    {title: '排行榜', icon: faRankingStar},
    {title: '历史记录', icon: faClockRotateLeft},
  ];

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={data}
      renderItem={({item}) => {
        return (
          <View style={styles.itemContainer}>
            <FontAwesomeIcon color="deeppink" size={30} icon={item.icon} />
            <Text style={{fontSize: 14, paddingTop: 5}}>{`${item.title}`}</Text>
          </View>
        );
      }}
    />
  );
};

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 40,
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginTop: 20,
    },
    itemContainer: {
      alignItems:'center',
      justifyContent: 'space-between',
    },
  });

export {Bar};
