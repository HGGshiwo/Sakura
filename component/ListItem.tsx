import {Divider, Image} from '@rneui/themed';
import {StyleSheet, View, Pressable, ImageBackground} from 'react-native';
import {InfoText, RateText, SubInfoText, SubTitle} from '../component/Text';
import {HistoryInfo} from '../type/HistoryInfo';
import {RecommandInfo} from '../type/RecommandInfo';
import {SearchInfo} from '../type/SearchInfo';
import {FollowButton, RoundButton} from './Button';

interface Props<T> {
  index: number;
  onPress: (item: T) => void;
  item: T;
}

//推荐列表的一项, 列表方向: 纵向，一行1个，包含信息： RecommandInfo
const V1RecommandInfoItem = ({item, onPress}: Props<RecommandInfo>) => {
  return (
    <>
      <Divider></Divider>
      <Pressable
        onPress={() => {
          onPress(item);
        }}>
        <View style={styles.itemContainerH}>
          <ImageBackground
            imageStyle={styles.ibImage}
            style={styles.ibContainer80H}
            source={{uri: item.img}}
          />
          <View style={styles.infoContainer}>
            <SubTitle title={item.title} />
            <SubInfoText title={item.state} />
          </View>
          <View style={styles.rateContainer}>
            <RateText title="9.7" />
          </View>
        </View>
      </Pressable>
    </>
  );
};

//主页列表的一项, 列表方向: 纵向，一行2个，包含信息：RecommandInfo
const V2RecommandInfoItemItem: React.FC<Props<RecommandInfo>> = ({
  index,
  item,
  onPress,
}) => {
  return (
    <View style={styles.itemContainerV}>
      <Pressable
        onPress={() => {
          onPress(item);
        }}
        key={index}>
        <ImageBackground
          style={{flex: 1, height: 80}}
          imageStyle={styles.ibImage}
          source={{uri: item.img}}
          resizeMode="cover">
          <InfoText style={styles.ibText} title={item.state} />
        </ImageBackground>
      </Pressable>
      <InfoText title={item.title} />
    </View>
  );
};

//主页观看历史的一项，列表方向: 横向，一列1个，包含信息：HistoryInfo
const H1HistoryInfoItem: React.FC<Props<HistoryInfo>> = ({
  item,
  index,
  onPress,
}) => {
  return (
    <View style={styles.itemContainerV}>
      <Pressable
        onPress={() => {
          onPress(item);
        }}
        key={index}>
        <ImageBackground
          style={styles.ibContainer60H}
          imageStyle={styles.ibImage}
          source={{uri: item.img}}
          resizeMode="cover">
          <InfoText style={styles.ibText} title={item.state} />
        </ImageBackground>
      </Pressable>
      <InfoText style={{width: 120}} title={item.title} />
      <SubInfoText title={'看到第1话20%'} />
    </View>
  );
};

//搜索结果的一项，列表方向: 纵向，一行1个，包含信息：SearchInfo
const V1SearchInfoItem: React.FC<Props<SearchInfo>> = ({
  item,
  index,
  onPress,
}) => {
  return (
    <Pressable onPress={() => onPress(item)}>
      <View style={styles.itemContainerH}>
        <ImageBackground
          imageStyle={styles.ibImage}
          style={styles.ibContainer60V}
          source={{uri: item.img}}
        />
        <View style={styles.infoContainer}>
          <SubTitle numberOfLines={1} title={item.title} />
          <InfoText title={item.state} />
          <InfoText title={item.type.join('/')} />
          <InfoText title={item.info} numberOfLines={3} />
        </View>
        <View style={{alignItems: 'center', flex: 1}}>
          <RoundButton style={{marginVertical: 20}} text="立即观看" />
          <FollowButton onPress={() => {}} defaultFollowed={false} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemContainerH: {
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  itemContainerV: {
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  ibImage: {
    borderRadius: 5,
  },
  ibContainer60H: {
    //height 60, horizantal
    justifyContent: 'center',
    resizeMode: 'cover',
    width: 120,
    height: 60,
  },
  ibContainer80H: {
    //height 80, horizantal
    justifyContent: 'center',
    resizeMode: 'cover',
    width: 160,
    height: 80,
  },
  ibContainer60V: {
    //height 60, vertical
    justifyContent: 'center',
    resizeMode: 'cover',
    height: 120,
    width: 80,
  },
  ibText: {
    bottom: 2,
    right: 2,
    position: 'absolute',
    color: 'white',
    backgroundColor: '#rgba(0,0,0,0.5)',
  },
  infoContainer: {
    justifyContent: 'space-between',
    flex: 3,
    paddingHorizontal: 10,
  },
  rateContainer: {
    flex: 1,
    padding: 10,
  },
  rateTitle: {
    color: 'orange',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export {
  V1RecommandInfoItem,
  V2RecommandInfoItemItem,
  H1HistoryInfoItem,
  V1SearchInfoItem,
};
