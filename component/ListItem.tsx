import {ReactNode} from 'react';
import {StyleSheet, View, Pressable, ImageBackground} from 'react-native';
import {InfoText, SubInfoText, SubTitle} from '../component/Text';
import HistoryInfo from '../type/HistoryInfo';
import RecmdInfo from '../type/RecmdInfo';
import SearchInfo from '../type/SearchInfo';
import LinearGradient from 'react-native-linear-gradient';
import {Bar} from 'react-native-progress';
import Task from '../type/Download/Task';
import DownloadItemInfo from '../type/Download/DownloadItemInfo';

interface Props<T> {
  index: number;
  onPress: (item: T) => void;
  item: T;
  imgVerticle?: boolean;
  children?: ReactNode;
}

//推荐列表的一项, 列表方向: 纵向，一行1个，包含信息： RecmdInfo
const V1RecmdInfoItem = ({
  item,
  onPress,
  children,
  imgVerticle,
}: Props<RecmdInfo>) => {
  return (
    <Pressable
      onPress={() => {
        onPress(item);
      }}>
      <View style={styles.itemContainerH}>
        <ImageBackground
          imageStyle={styles.ibImage}
          style={imgVerticle ? styles.ibContainer60V : styles.ibContainer80H}
          source={{uri: item.img}}
        />
        <View style={styles.infoContainer}>
          <SubTitle style={{color: 'black'}} title={item.title} />
          <SubInfoText title={item.state} />
        </View>
        <View style={styles.rateContainer}>{children}</View>
      </View>
    </Pressable>
  );
};

//主页列表的一项, 列表方向: 纵向，一行2个，包含信息：RecmdInfo
const V2RecmdInfoItem: React.FC<Props<RecmdInfo>> = ({
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
          loadingIndicatorSource={{
            uri: 'https://s1.hdslb.com/bfs/static/laputa-home/client/assets/load-error.685235d2.png',
          }}
          style={{flex: 1, height: 80}}
          imageStyle={styles.ibImage}
          source={{uri: item.img}}>
          <LinearGradient
            style={styles.ibTextContainer}
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}>
            <InfoText style={styles.ibText} title={item.state} />
          </LinearGradient>
        </ImageBackground>
      </Pressable>
      <InfoText title={item.title} />
    </View>
  );
};

//主页观看历史的一项，列表方向: 横向，一列1个，包含信息：HistoryInfo
const H1HistoryInfoItem: React.FC<Props<HistoryInfo & RecmdInfo>> = ({
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
          <LinearGradient
            style={styles.ibTextContainer}
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}>
            <InfoText style={styles.ibText} title={item.state} />
          </LinearGradient>
        </ImageBackground>
      </Pressable>
      <InfoText style={{width: 120}} title={item.title} />
      <SubInfoText
        style={{width: 120}}
        title={`看到${item.anthologyTitle} ${(item.progressPer * 100).toFixed(
          0,
        )}%`}
      />
    </View>
  );
};

const EmptyH1HistoryInfoItem: React.FC<{}> = ({}) => {
  return (
    <View style={styles.itemContainerV}>
      <View
        style={[
          styles.ibContainer60H,
          {alignItems: 'center', marginBottom: 20},
        ]}>
        <InfoText title="暂无数据" />
      </View>
    </View>
  );
};

//观看历史的一项，列表方向: 纵向，一行1个，包含信息：HistoryInfo & RecmdInfo
const V1HistoryInfoItem: React.FC<Props<HistoryInfo & RecmdInfo>> = ({
  item,
  children,
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
          <View>
            <SubInfoText title={item.state} />
            <SubInfoText
              title={`看到${item.anthologyTitle} ${(
                item.progressPer * 100
              ).toFixed(0)}%`}
            />
          </View>
        </View>
        <View style={{alignItems: 'center', flex: 1, alignSelf: 'center'}}>
          {children}
        </View>
      </View>
    </Pressable>
  );
};

//用户追番的一项，列表方向: 横向，一列1个，包含信息：RecmdInfo
const H1RecmdInfoItem: React.FC<Props<RecmdInfo>> = ({
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
          <LinearGradient
            style={styles.ibTextContainer}
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}>
            <InfoText style={styles.ibText} title={item.state} />
          </LinearGradient>
        </ImageBackground>
      </Pressable>
      <InfoText style={{width: 120}} title={item.title} />
    </View>
  );
};

//搜索结果的一项，列表方向: 纵向，一行1个，包含信息：SearchInfo
const V1SearchInfoItem: React.FC<Props<RecmdInfo & SearchInfo>> = ({
  item,
  index,
  onPress,
  children,
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
          <InfoText title={item.type.map(type => type.title).join('/')} />
          <InfoText title={item.info} numberOfLines={3} />
        </View>
        <View style={{alignItems: 'center', flex: 1}}>{children}</View>
      </View>
    </Pressable>
  );
};

//分类结果的一项，列表方向纵向，一行3个，包含信息: RecmdInfo
const V3RecmdInfoItem: React.FC<Props<RecmdInfo>> = ({
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
          style={{flex: 1, height: 140}}
          imageStyle={styles.ibImage}
          source={{uri: item.img}}
          resizeMode="cover">
          <LinearGradient
            style={styles.ibTextContainer}
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}>
            <InfoText style={styles.ibText} title={item.state} />
          </LinearGradient>
        </ImageBackground>
      </Pressable>
      <InfoText title={item.title} />
    </View>
  );
};

//下载进度的一项，列表方向纵向，一行1个，包含信息：DownloadItemInfo
const V1DownloadInfoItem: React.FC<Props<DownloadItemInfo>> = ({
  item,
  children,
  onPress,
}) => {
  return (
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
        <View style={[styles.infoContainer]}>
          <SubTitle style={{color: 'black'}} title={item.title} />
          <View style={{width: 150}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <SubInfoText title={(item.progress * 100).toFixed(2) + '%'} />
              <SubInfoText title={'20MB'}/>
            </View>
            <Bar
              style={{marginTop: 5}}
              progress={item.progress}
              height={3}
              unfilledColor="lightgrey"
              borderColor="white"
              color="grey"
            />
          </View>
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
    backgroundColor: 'white',
  },
  itemContainerV: {
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
  },
  ibImage: {
    borderRadius: 5,
    backgroundColor: 'grey',
  },
  ibTextContainer: {
    width: '100%',
    bottom: 0,
    right: 0,
    position: 'absolute',
    borderRadius: 5,
    padding: 2,
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
    color: 'white',
    fontSize: 12,
    maxWidth: '80%',
  },
  infoContainer: {
    justifyContent: 'space-between',
    flex: 3,
    paddingHorizontal: 10,
  },
  rateContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateTitle: {
    color: 'orange',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export {
  V1RecmdInfoItem,
  V2RecmdInfoItem,
  V3RecmdInfoItem,
  H1HistoryInfoItem,
  V1SearchInfoItem,
  H1RecmdInfoItem,
  EmptyH1HistoryInfoItem,
  V1HistoryInfoItem,
  V1DownloadInfoItem,
};
