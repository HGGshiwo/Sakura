import React, {createRef, useContext, useEffect, useRef, useState} from 'react';
import {FlatList, View, StyleSheet, Pressable} from 'react-native';
import {Image, ImageProps, useWindowDimensions} from 'react-native';
import {PlayerProps} from '../InfoPage';
import {BackButton} from '../../component/Button';
import {InfoText, LoadingText} from '../../component/Text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Scrubber from '../../component/Scrubber';
import AppContext from '../../context';
import {NextButton} from '../anime/Player/NextButton';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const ResizeImage: React.FC<ImageProps> = props => {
  const [aspectRatio, setAspectRatio] = useState(1);
  const layout = useWindowDimensions();
  useEffect(() => {
    Image.getSize((props.source as any).uri, (width, height) => {
      setAspectRatio(width / height);
    });
  }, []);
  return (
    <Image
      style={{resizeMode: 'contain', width: layout.width, aspectRatio}}
      {...props}
    />
  );
};

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
  useEffect(() => {
    setDuration(data ? data.length - 1 : 0);
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

  //点击了视频空白区域
  const handlePress = () => {
    // setRateSheetVisible(false);
    // setAnthologySheetVisible(false);
    hidePanel()
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
  };
  const onSlide = (data: number) => {
    listRef.current!.scrollToIndex({
      index: Math.round(data),
      viewPosition: 0.5,
    });
  };
  const onSlidingComplete = (data: number) => {
    setProgress(data); //当seek时，由slide自己更新
    seekingRef.current = false;
    waitCloseControl();
  };
  const onSlidingStart = () => {
    console.log('start');
    seekingRef.current = true;
  };

  const onViewCallBack = React.useCallback((viewableItems: any) => {
    const items = viewableItems.viewableItems;
    setProgress(items[items.length - 1].index);
  }, []);

  return (
    <View style={{flex: 1}}>
      {!dataAvailable ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}>
          <InfoText title="加载图片地址中..." />
        </View>
      ) : (
        <FlatList
          ListEmptyComponent={
            <InfoText style={{paddingTop: '50%'}} title="加载图片中..." />
          }
          data={data}
          ref={listRef}
          onViewableItemsChanged={onViewCallBack}
          onEndReached={nextDataAvailable ? toNextSource : null}
          renderItem={({item}) => (
            <Pressable onPress={handlePress} style={{flex: 1}}>
              <ResizeImage source={{uri: item}} />
            </Pressable>
          )}
        />
      )}

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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
