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
import {
  FlatList,
  View,
  StyleSheet,
  Pressable,
  ViewToken,
  SectionList,
  SectionListData,
} from 'react-native';
import {Image, ImageProps, useWindowDimensions} from 'react-native';
import {BackButton} from './Button';
import {InfoText, LoadingText} from './Text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Scrubber from './Scrubber';
import {NextButton} from './VideoPlayer/NextButton';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Text} from 'react-native';
import {useStore} from '../scene/InfoPage';
import {useNavigation} from '@react-navigation/native';
import {InfoPageProps} from '../route';
import useTheme from '../zustand/Theme';

const Paragraph = React.memo<{data: string; onPress: () => void}>(
  ({data, onPress}) => {
    return (
      <Pressable onPress={() => onPress()} style={{flex: 1, margin: 10}}>
        <Text style={{fontSize: 16}}>{data}</Text>
      </Pressable>
    );
  },
);
const TextPlayer: React.FC<{}> = () => {
  const [controlVisible, setControlVisible] = useState(false);
  const controlVisibleRef = useRef(false); //control是否可见
  const controlTimer = useRef(undefined); //当前的计时器
  const insents = useSafeAreaInsets();
  const {PlayerStyle} = useTheme().theme;
  const [sectionIndex, setSectionIndex] = useState(0); //当前的section的位置
  const seekingRef = useRef(false); //是否在加载
  const listRef = createRef<SectionList<any>>();
  const [totalData, setTotalData] = useState<SectionListData<string>[]>([]); //累计的图片地址
  const layout = useWindowDimensions();
  const {
    flashData,
    progress,
    nextDataAvailable,
    playerData,
    update,
    next,
    episode,
    pageInfo,
  } = useStore();

  const navigation = useNavigation<InfoPageProps['navigation']>();

  useEffect(() => {
    //切换了下一个选集，则需要更新长度，加入到累计数据，
    if (playerData) {
      if (flashData) {
        setTotalData([{...playerData, index: 0}]);
        setSectionIndex(0);
        update({progress: 0});
      } else {
        setTotalData(
          totalData.concat([{...playerData, index: totalData.length}]),
        );
      }
    }
  }, [playerData]);

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
    update({detailSheetVisible: false});
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
    listRef.current!.scrollToLocation({
      sectionIndex,
      itemIndex: Math.round(data),
      viewPosition: 0.5,
    });
  };

  const onSlidingComplete = (data: number) => {
    update({progress: data}); //当seek时，由slide自己更新
    seekingRef.current = false;
    waitCloseControl();
  };

  const onSlidingStart = () => {
    seekingRef.current = true;
  };

  const onViewCallBack = React.useCallback((viewableItems: any) => {
    const viewables = viewableItems.viewableItems as ViewToken[];
    if (viewables.length === 0) return;
    if (viewables[0].section.index !== sectionIndex) {
      //切换了section
      update({progress: viewables[0].index!});
      setSectionIndex(viewables[0].section.index);
    } else {
      update({progress: viewables[0].index!});
    }
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <SectionList
        renderSectionHeader={({section}) => (
          <Text style={{fontSize: 16, margin: 10, fontWeight: 'bold'}}>
            {section.title}
          </Text>
        )}
        ListEmptyComponent={
          <InfoText
            style={{paddingTop: layout.height / 2, alignSelf: 'center'}}
            title="加载小说地址中..."
          />
        }
        ListHeaderComponent={<View style={{height: 30, width: '100%'}} />}
        ListFooterComponent={
          totalData.length !== 0 ? (
            <InfoText
              style={{alignSelf: 'center', paddingVertical: layout.height / 2}}
              title={nextDataAvailable ? '加载小说中...' : '没有更多了...'}
            />
          ) : null
        }
        sections={totalData}
        ref={listRef}
        viewabilityConfig={{
          waitForInteraction: true,
          itemVisiblePercentThreshold: 0.5,
        }}
        onViewableItemsChanged={onViewCallBack}
        onEndReached={nextDataAvailable ? next : null}
        onEndReachedThreshold={0.8}
        renderItem={({item}) => <Paragraph data={item} onPress={handlePress} />}
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
          <BackButton onPress={() => navigation.goBack()} />
          <LoadingText
            title={`${pageInfo!.title} ${episode!.title}`}
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
                totalDuration={
                  totalData[sectionIndex]
                    ? totalData[sectionIndex].data.length
                    : 0
                }
                displayValues={false}
              />
            </GestureHandlerRootView>
          </View>
          <NextButton onPress={next} disabled={!nextDataAvailable} />
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
          <Pressable onPress={() => update({profleVisible: true})}>
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

export default TextPlayer;
