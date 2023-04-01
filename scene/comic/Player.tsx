import React, {
  ReactNode,
  createRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {FlatList, View, StyleSheet, Pressable, ViewToken} from 'react-native';
import {Image, ImageProps, useWindowDimensions} from 'react-native';
import {PlayerProps} from '../InfoPage';
import {BackButton} from '../../component/Button';
import {InfoText, LoadingText} from '../../component/Text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Scrubber from '../../component/Scrubber';
import AppContext from '../../context';
import {NextButton} from '../anime/Player/NextButton';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const ResizeImage = React.memo<{uri: string; onPress: () => void}>(
  ({uri, onPress}) => {
    const [aspectRatio, setAspectRatio] = useState(1);
    const layout = useWindowDimensions();
    const [dataAvailable, setDataAvailable] = useState(false);
    useEffect(() => {
      setDataAvailable(uri !== '');
      Image.getSize(uri, (width, height) => {
        setAspectRatio(width / height);
      });
    }, [uri]);

    return (
      <Pressable onPress={() => onPress()} style={{flex: 1}}>
        {dataAvailable ? (
          <Image
            style={{resizeMode: 'contain', width: layout.width, aspectRatio}}
            source={{uri}}
          />
        ) : (
          <View
            style={{
              height: 300,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <InfoText title="加载图片地址中..." />
          </View>
        )}
      </Pressable>
    );
  },
);
const ComicPlayer: React.FC<PlayerProps> = ({
  dataAvailable,
  nextDataAvailable,
  data,
  title,
  onErr,
  onBack,
  toNextSource,
  onProgress,
  defaultProgress,
  renderAnthologys,
  playerHeight,
  showPanel,
  hidePanel,
  flashData,
}) => {
  const [controlVisible, setControlVisible] = useState(false);
  const controlVisibleRef = useRef(false); //control是否可见
  const controlTimer = useRef(undefined); //当前的计时器
  const insents = useSafeAreaInsets();
  const {PlayerStyle} = useContext(AppContext).theme;
  const [progress, setProgress] = useState(defaultProgress); //当前视频播放进度
  const [duration, setDuration] = useState(0); //当前视频总时长
  const seekingRef = useRef(false); //是否在加载
  const listRef = createRef<FlatList<any>>();
  const [totalData, setTotalData] = useState<string[]>([]); //累计的图片地址
  const durationsRef = useRef<number[]>([]); //记录下选集的长度
  const dataIndexRef = useRef(0); //data累计的index
  const anthologyIndexRef = useRef(-1); //选集的index，data第一次切换+1
  const layout = useWindowDimensions();
  const lastOffset = useRef(0);
  const scrollUp = useRef(true);

  useEffect(() => {
    //切换了下一个选集，则需要更新长度，加入到累计数据，
    console.log(flashData);
    if (data) {
      console.log(999, data);
      setDuration(data.length);
      if (flashData) {
        setTotalData(data);
        durationsRef.current = [data.length]; //记录下长度
        anthologyIndexRef.current = -1;
        dataIndexRef.current = -1;
        console.log(222, durationsRef.current);
      } else {
        setTotalData(totalData.concat(data));
        durationsRef.current = [...durationsRef.current, data.length];
      }
    }
  }, [data]);

  //打开control并在一段时间之后关闭
  const openControl = () => {
    setControlVisible(true);
    controlVisibleRef.current = true;
    waitCloseControl();
  };

  //等待control消失的计时器
  const waitCloseControl: Function = () => {
    if (controlTimer.current !== undefined) {
      clearTimeout(controlTimer.current);
      controlTimer.current = undefined;
    }
    controlTimer.current = setTimeout(() => {
      if (!seekingRef.current) {
        setControlVisible(false);
        controlVisibleRef.current = false;
      }
    }, 3000) as any;
  };

  //点击了空白区域
  const handlePress = useCallback(() => {
    // setRateSheetVisible(false);
    // setAnthologySheetVisible(false);
    hidePanel();
    if (controlVisibleRef.current) {
      if (controlTimer.current !== undefined) {
        clearTimeout(controlTimer.current);
        controlTimer.current = undefined;
      }
      setControlVisible(false);
      controlVisibleRef.current = false;
    } else {
      openControl();
    }
  }, []);

  //使用进度条改进
  const onSlide = (data: number) => {
    listRef.current!.scrollToIndex({
      index: dataIndexRef.current + Math.round(data),
      viewPosition: 0.5,
    });
  };

  const onSlidingComplete = (data: number) => {
    setProgress(data); //当seek时，由slide自己更新
    seekingRef.current = false;
    waitCloseControl();
  };

  const onSlidingStart = () => {
    seekingRef.current = true;
  };

  const onViewCallBack = React.useCallback((viewableItems: any) => {
    const viewables = viewableItems.viewableItems as ViewToken[];
    if(viewables.length === 0) return
    if (scrollUp.current && viewables[0].index! <= dataIndexRef.current) {
      //上方图片出现，并且上一次的最后一个选集可见，选集-1
      if (anthologyIndexRef.current != -1) {
        setProgress(durationsRef.current[anthologyIndexRef.current]);
        console.log(666, durationsRef.current, anthologyIndexRef.current);
        setDuration(durationsRef.current[anthologyIndexRef.current]);
        dataIndexRef.current -= durationsRef.current[anthologyIndexRef.current];
        anthologyIndexRef.current -= 1; //先改再-1
      }
    } else if (
      !scrollUp.current &&
      viewables.at(-1).index! >
        dataIndexRef.current + durationsRef.current.at(-1)
    ) {
      //下方图片出现，并且下一次的第一个选集可见，选集+1
      anthologyIndexRef.current += 1; //先+1再改
      console.log(777, durationsRef.current, anthologyIndexRef.current);
      setProgress(1);
      setDuration(durationsRef.current[anthologyIndexRef.current]);
      dataIndexRef.current += durationsRef.current[anthologyIndexRef.current];
    } else if (viewables.length !== 0) {
      console.log(
        888,
        viewables[0].index,
        dataIndexRef.current,
        viewables[0].index! - dataIndexRef.current,
      );
      setProgress(viewables[0].index! - dataIndexRef.current);
    }
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <FlatList
        keyExtractor={item => item}
        ListEmptyComponent={
          <InfoText
            style={{paddingTop: layout.height / 2, alignSelf: 'center'}}
            title="加载图片地址中..."
          />
        }
        ListFooterComponent={
          totalData.length !== 0 ? (
            <InfoText
              style={{alignSelf: 'center', paddingVertical: layout.height / 2}}
              title={nextDataAvailable ? '加载图片中...' : '没有更多了...'}
            />
          ) : null
        }
        data={totalData}
        ref={listRef}
        viewabilityConfig={{
          waitForInteraction: true,
          itemVisiblePercentThreshold: 0.5,
        }}
        onViewableItemsChanged={onViewCallBack}
        onEndReached={nextDataAvailable ? toNextSource : null}
        onScroll={e => {
          scrollUp.current = e.nativeEvent.contentOffset.y < lastOffset.current;
          lastOffset.current = e.nativeEvent.contentOffset.y;
        }}
        renderItem={({item}) => (
          <ResizeImage uri={item} onPress={handlePress} />
        )}
      />

      {/* top bar  */}
      <View
        style={[
          styles.topBar,
          styles.bar,
          {
            display: controlVisible ? 'flex' : 'none',
            height: 60 + insents.top,
            paddingTop: insents.top,
          },
        ]}>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <BackButton onPress={onBack} />
          <LoadingText
            title={title}
            numberOfLines={1}
            style={{paddingLeft: 10}}
          />
        </View>
      </View>

      {/* bottom bar */}

      <View
        style={[
          styles.bar,
          styles.bottomBar,
          {display: controlVisible ? 'flex' : 'none'},
        ]}>
        <View style={styles.bottomBarRow}>
          <View style={{flex: 1, paddingHorizontal: 20}}>
            <GestureHandlerRootView style={{flex: 1}}>
              <Scrubber
                value={progress}
                onSlidingStart={onSlidingStart}
                onSlide={onSlide}
                onSlidingComplete={onSlidingComplete}
                trackColor={PlayerStyle.textColor(true)}
                scrubbedColor={PlayerStyle.textColor(true)}
                totalDuration={duration}
                displayValues={false}
              />
            </GestureHandlerRootView>
          </View>
          <NextButton onPress={toNextSource} disabled={!nextDataAvailable} />
        </View>
        <View
          style={[
            styles.bottomBarRow,
            {paddingBottom: 20, paddingHorizontal: 20},
          ]}>
          <Pressable onPress={() => {}}>
            <InfoText
              style={{color: 'white', fontWeight: 'bold'}}
              title="设置"
            />
          </Pressable>
          <Pressable onPress={() => {}}>
            <InfoText
              style={{color: 'white', fontWeight: 'bold'}}
              title="选集"
            />
          </Pressable>
          <Pressable onPress={() => showPanel()}>
            <InfoText
              style={{color: 'white', fontWeight: 'bold'}}
              title="详情"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  video: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  bar: {
    width: '100%',
    height: 40,
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  topBar: {
    top: 0,
    left: 0,
  },
  bottomBar: {
    height: undefined,
    width: undefined,
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 10,
    flexDirection: 'column',
  },
  bottomBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    justifyContent: 'space-between',
  },
});

export default ComicPlayer;
