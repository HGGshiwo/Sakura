import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Scrubber from '../Scrubber';
import Video, {
  OnBandwidthUpdateData,
  OnLoadData,
  OnProgressData,
} from 'react-native-video';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faExpand,
  faForwardFast,
  faSun,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import {useContext, useEffect, useRef, useState, createRef} from 'react';
import Orientation, {PORTRAIT} from 'react-native-orientation-locker';
import {Pressable} from 'react-native';
import {InfoText, LoadingText} from '../Text';
import {PlayButton} from './PlayButton';
import {NextButton} from './NextButton';
import {RateMessage} from './RateMessage';
import {BackButton} from '../Button';
import {LoadingBox} from '../Loading';
import RateSheet from './RateSheet';
import Blank from './Blank';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import SystemSetting from 'react-native-system-setting';
import {Bar} from 'react-native-progress';
import React from 'react';
import ControlBar, {ControlBarRow} from '../ControlBar';
import Episode from '../../type/Download/Episode';
import {useStore} from '../../scene/InfoPage';
import {InfoPageProps} from '../../route';
import useTheme from '../../zustand/Theme';

//时间转化函数
var sec_to_time = (s: number): string => {
  var t = '';
  if (s > -1) {
    var hour = Math.floor(s / 3600);
    var min = Math.floor(s / 60) % 60;
    var sec = Math.floor(s % 60);
    if (hour > 0) {
      t = hour < 10 ? `0${hour}:` : `${hour}:`;
    }
    t = min < 10 ? `${t}0${min}` : `${t}${min}`;
    t = sec < 10 ? `${t}:0${sec}` : `${t}:${sec}`;
  }
  return t;
};

const VideoPlayer: React.FC<{}> = () => {
  const videoRef = useRef<Video | null>(null);
  const playerAnthologyListRef = createRef<FlatList<Episode>>();
  const [fullscreen, setFullscreen] = useState(false); //视频是否全屏

  const [paused, setPaused] = useState(true); //视频是否暂停
  const [loading, setLoading] = useState(true); //视频是否在加载中
  const [erring, setErring] = useState(false); //视频是否播放错误
  const [duration, setDuration] = useState(0); //当前视频总时长
  const [cache, setCache] = useState(0); //当前视频缓存位置
  const seekingRef = useRef(false); //是否在加载
  const [fmtDuration, setFmtDuration] = useState('00:00'); //格式化后的视频位置
  const [fmtProgress, setFmtProgress] = useState('00:00'); //格式化后的视频时长
  const controlTimer = useRef(undefined); //当前的计时器
  const [bitrateText, setBitrateText] = useState(''); //带宽

  const {
    pageInfo,
    episode,
    playerLoading,
    next,
    nextDataAvailable,
    updateProgress,
    progress,
    update,
    playerData,
  } = useStore();

  //控制是否可见
  const [controlVisible, setControlVisible] = useState(true); //是否展示control控件
  const [rateSheetVisible, setRateSheetVisible] = useState(false); //速度sheet是否可见
  const [rateMessageVisible, setRateMessageVisible] = useState(false); //加速消息是否可见
  const [anthologySheetVisible, setAnthologySheetVisible] = useState(false); //选集消息是否可见
  const [progressMessageVisible, setProgressMessageVisible] = useState(false);
  const [brightMessageVisible, setBrightMessageVisible] = useState(false);
  const [volumeMessageVisible, setVolumeMessageVisible] = useState(false);

  const [rateText, setRateText] = useState('倍速'); //速度控制
  const [playRate, setPlayRate] = useState(1); //当前播放速度
  const [rateId, setRateId] = useState(2); //播放速度id
  const prePlayRate = useRef(1); //长按前的播放速度

  const progressRef = useRef(0); //进度条记录
  const baseProgressRef = useRef(0); //移动进度条时的原始路径
  const baseVolumeRef = useRef(0); //音量原始大小
  const baseBrightRef = useRef(0);

  const durationRef = useRef(0); //时长记录
  const isFocused = useIsFocused(); //页面是否隐藏，隐藏则暂停播放
  const controlVisibleRef = useRef(false); //control是否可见
  const pausedRef = useRef(false); //是否暂停
  const layout = useWindowDimensions();

  const [bright, setBright] = useState(0); //亮度
  const [volume, setVolume] = useState(0); //声音

  const navigation = useNavigation<InfoPageProps['navigation']>();

  useEffect(() => {
    if (!playerLoading) {
      setControlVisible(true);
      setErring(false);
    } else {
      setPaused(true);
      pausedRef.current = true;
    }
  }, [playerLoading]);

  useEffect(() => {
    setFmtProgress(sec_to_time(progressRef.current));
  }, [progressRef.current]);

  useEffect(() => {
    setPaused(!isFocused || pausedRef.current);
    pausedRef.current = !isFocused || pausedRef.current;
  }, [isFocused]);

  useEffect(() => {
    // This would be inside componentDidMount()
    Orientation.addOrientationListener(handleOrientation);
    const interval = setInterval(() => {
      //每15s更新数据库
      if (durationRef.current && !pausedRef.current) {
        updateProgress(
          progressRef.current,
          progressRef.current / durationRef.current,
        );
      }
    }, 15000);
    return () => {
      // This would be inside componentWillUnmount()
      clearInterval(interval);
      Orientation.lockToPortrait();
      Orientation.removeOrientationListener(handleOrientation);
    };
  }, []);

  //滚动全屏后播放器选集列表
  useEffect(() => {
    if (playerAnthologyListRef.current && !!episode && !!pageInfo) {
      playerAnthologyListRef.current!.scrollToIndex({
        index: pageInfo!.episodes.findIndex(
          obj => obj.taskUrl == episode.taskUrl,
        ),
      });
    }
  }, [playerAnthologyListRef.current]);

  const videoError = (err: any) => {
    console.log(err);
    setErring(true);
    // onErr();
  };

  const onLoad = (data: OnLoadData) => {
    setLoading(false);
    setFmtDuration(sec_to_time(data.duration));
    setDuration(data.duration);
    durationRef.current = data.duration;
    setPaused(false);
    pausedRef.current = false;
    onSlidingComplete(progress);
    waitCloseControl();
  };

  const _onProgress = (data: OnProgressData) => {
    setCache(data.playableDuration);
    if (!seekingRef.current) {
      //当seek时由slider更新progress
      update;
      update({progress: data.currentTime});
      progressRef.current = data.currentTime;
    }
  };

  const onSlidingComplete = (data: number) => {
    update({progress: data}); //当seek时，由slide自己更新
    setLoading(true);
    videoRef.current?.seek(data);
    waitCloseControl();
  };

  const onSeek = () => {
    //加载完成
    setLoading(false);
    seekingRef.current = false;
  };

  const onSlidingStart = () => {
    seekingRef.current = true;
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

  //打开control并在一段时间之后关闭
  const openControl = () => {
    setControlVisible(true);
    controlVisibleRef.current = true;
    waitCloseControl();
  };

  //点击了视频空白区域
  const handlePressVideo = () => {
    setRateSheetVisible(false);
    setAnthologySheetVisible(false);
    if (controlVisibleRef.current) {
      if (controlTimer.current !== undefined) {
        clearTimeout(controlTimer.current);
        controlTimer.current = undefined;
      }
      setControlVisible(false);
      controlVisibleRef.current = false;
    } else {
      console.log('open');
      openControl();
    }
  };

  //点击播放按钮
  const handlePlay = () => {
    console.log(paused);
    setPaused(!pausedRef.current);
    pausedRef.current = !pausedRef.current;
    openControl();
  };

  function handleOrientation(orientation: string) {
    console.log(orientation);
    if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
      setFullscreen(true);
      StatusBar.setHidden(true);
    } else {
      setFullscreen(false);
      StatusBar.setHidden(false);
    }
    // setOrientation(orientation);
  }

  //切换是否全屏
  const handleFullscreen = () => {
    if (fullscreen) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscapeLeft();
    }
  };

  //显示带宽
  const onBandwithUpdate = ({bitrate}: OnBandwidthUpdateData) => {
    const M = 1 << 20;
    const K = 1 << 10;
    bitrate = bitrate / 8;
    let text =
      bitrate > M
        ? `${(bitrate / M).toFixed(2)}MB/s`
        : bitrate > K
        ? `${(bitrate / K).toFixed(2)}KB/s`
        : `${bitrate}B/s`;
    setBitrateText(text);
  };

  //长按加速
  const onLongPress = () => {
    setRateSheetVisible(false);
    prePlayRate.current = playRate;
    setRateMessageVisible(true);
    setPlayRate(3);
  };

  //取消长按返回原速
  const onLongPressOut = () => {
    setRateMessageVisible(false);
    setPlayRate(prePlayRate.current);
  };

  const onMoveXStart = () => {
    baseProgressRef.current = progressRef.current;
    seekingRef.current = true;
    setProgressMessageVisible(true);
  };

  const onMoveX = (dprogress: number) => {
    progressRef.current =
      baseProgressRef.current + (dprogress / layout.width) * 300; //必须使用progress，否则更新对不上
    update({progress: progressRef.current});
  };

  const onMoveXComplete = () => {
    setProgressMessageVisible(false);
    onSlidingComplete(progressRef.current);
  };

  //调整亮度
  const onLeftMoveYStart = () => {
    SystemSetting.getAppBrightness().then(brightness => {
      setBright(brightness);
      baseBrightRef.current = brightness;
      setBrightMessageVisible(true);
    });
  };

  const onLeftMoveY = (dy: number) => {
    const ratio = fullscreen ? layout.height : layout.width * 0.56;
    let _bright = baseBrightRef.current - (dy - 10) / ratio; //增加一个偏移可以优化用户体验
    _bright = Math.round(Math.max(Math.min(1, _bright), 0) * 1000) / 1000;
    setBright(_bright);
    SystemSetting.setAppBrightness(_bright);
  };

  const onLeftMoveYComplete = () => {
    setBrightMessageVisible(false);
  };

  //调整音量
  const onRightMoveYStart = () => {
    SystemSetting.getVolume().then(volume => {
      setVolume(volume);
      baseVolumeRef.current = volume;
      setVolumeMessageVisible(true);
    });
  };

  const onRightMoveY = (dy: number) => {
    const ratio = fullscreen ? layout.height : layout.width * 0.56;
    let _volume = baseVolumeRef.current - (dy - 10) / ratio;
    _volume = Math.round(Math.max(Math.min(1, _volume), 0) * 1000) / 1000;
    setVolume(_volume);
    SystemSetting.setVolume(_volume);
  };

  const onRightMoveYComplete = () => {
    setVolumeMessageVisible(false);
  };

  const onEnd = () => {
    console.log('end');
    nextDataAvailable ? next() : null;
  };

  const {PlayerStyle} = useTheme().theme;
  const {playerTextColor} = PlayerStyle;

  function setFlashData(arg0: boolean) {
    throw new Error('Function not implemented.');
  }

  function changeAnthology(index: any) {
    throw new Error('Function not implemented.');
  }

  function setVisible(arg0: boolean) {
    throw new Error('Function not implemented.');
  }

  return (
    <View style={fullscreen ? styles.fullscreenContaner : styles.container}>
      {playerLoading ? (
        <LoadingText title="解析视频地址中..." />
      ) : (
        <>
          {/* <OrientationLocker orientation={orientation} /> */}
          <Video
            ref={videoRef}
            source={JSON.parse(playerData)}
            onLoad={onLoad} // Callback when remote video is buffering
            onError={videoError} // Callback when video cannot be loaded
            onSeek={onSeek}
            style={styles.video}
            paused={paused}
            onProgress={_onProgress}
            reportBandwidth={loading}
            onBandwidthUpdate={onBandwithUpdate}
            rate={playRate}
            progressUpdateInterval={1000}
            onEnd={onEnd}
          />

          <Blank
            onPress={handlePressVideo}
            onLongPress={onLongPress}
            onLongPressOut={onLongPressOut}
            onDbPress={handlePlay}
            onMoveX={onMoveX}
            onMoveXStart={onMoveXStart}
            onMoveXComplete={onMoveXComplete}
            onLeftMoveYStart={onLeftMoveYStart}
            onLeftMoveY={onLeftMoveY}
            onLeftMoveYComplete={onLeftMoveYComplete}
            onRightMoveYStart={onRightMoveYStart}
            onRightMoveY={onRightMoveY}
            onRightMoveYComplete={onRightMoveYComplete}
          />

          {erring ? <LoadingText title="视频源不可用..." /> : null}

          <LoadingBox show={!erring && loading} text={bitrateText} />

          {/* top bar  */}
          <ControlBar top show={controlVisible} fullscreen={fullscreen}>
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
              <BackButton
                onPress={() => {
                  fullscreen ? handleFullscreen() : navigation.goBack();
                }}
              />
              <LoadingText
                title={`${pageInfo?.title} ${episode?.title}`}
                numberOfLines={1}
                style={{paddingLeft: 10}}
              />
            </View>
          </ControlBar>

          {/* bottom bar */}
          <ControlBar
            top={false}
            show={controlVisible && !fullscreen}
            fullscreen={fullscreen}>
            <PlayButton onPress={handlePlay} paused={paused} />
            <View style={styles.slider}>
              <Scrubber
                value={progress}
                bufferedValue={cache}
                onSlidingStart={onSlidingStart}
                onSlidingComplete={onSlidingComplete}
                totalDuration={duration}
                trackColor={PlayerStyle.textColor(true)}
                scrubbedColor={PlayerStyle.textColor(true)}
                displayValues={false}
              />
            </View>
            <LoadingText
              title={`${fmtProgress}/${fmtDuration}`}
              style={{marginRight: 10}}
            />
            <Pressable onPress={handleFullscreen}>
              <FontAwesomeIcon color="white" size={24} icon={faExpand} />
            </Pressable>
          </ControlBar>
          <ControlBar
            top={false}
            show={controlVisible && fullscreen}
            fullscreen={fullscreen}>
            <ControlBarRow>
              <LoadingText title={fmtProgress} />
              <View style={styles.slider}>
                <Scrubber
                  value={progress}
                  bufferedValue={cache}
                  onSlidingStart={onSlidingStart}
                  onSlidingComplete={onSlidingComplete}
                  totalDuration={duration}
                  trackColor={PlayerStyle.textColor(true)}
                  scrubbedColor={PlayerStyle.textColor(true)}
                  displayValues={false}
                />
              </View>
              <LoadingText title={fmtDuration} />
            </ControlBarRow>
            <ControlBarRow>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <PlayButton onPress={handlePlay} paused={paused} />
                <NextButton onPress={next} disabled={!nextDataAvailable} />
              </View>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <Pressable onPress={() => setRateSheetVisible(true)}>
                  <LoadingText title={rateText} />
                </Pressable>
                <Pressable onPress={() => setAnthologySheetVisible(true)}>
                  <LoadingText style={{marginLeft: 20}} title="选集" />
                </Pressable>
              </View>
            </ControlBarRow>
          </ControlBar>
          {/* 倍速播放信息 */}
          <RateMessage show={rateMessageVisible}>
            <FontAwesomeIcon color="white" icon={faForwardFast} />
            <LoadingText style={{paddingLeft: 10}} title="倍速播放中" />
          </RateMessage>

          {/* 进度跳拖动信息 */}
          <RateMessage show={progressMessageVisible}>
            <LoadingText
              style={{paddingLeft: 10}}
              title={`${fmtProgress}/${fmtDuration}`}
            />
          </RateMessage>

          {/* 亮度 */}
          <RateMessage show={brightMessageVisible}>
            <FontAwesomeIcon color="white" icon={faSun} />
            <Bar
              style={{marginLeft: 10}}
              borderWidth={0}
              color={PlayerStyle.indicatorColor}
              unfilledColor="lightgrey"
              progress={bright}
              width={100}
              height={2}
            />
          </RateMessage>

          {/* 声音 */}
          <RateMessage show={volumeMessageVisible}>
            <FontAwesomeIcon color="white" icon={faVolumeHigh} />
            <Bar
              style={{marginLeft: 10}}
              borderWidth={0}
              color={PlayerStyle.indicatorColor}
              unfilledColor="lightgrey"
              progress={volume}
              width={100}
              height={2}
            />
          </RateMessage>

          {/* rate sheet  */}
          <RateSheet
            defaultActive={rateId}
            show={rateSheetVisible}
            onPress={(data, title, id) => {
              setRateSheetVisible(false);
              setRateText(title);
              setPlayRate(data);
              setRateId(id);
            }}
          />
          <View
            style={[
              {display: anthologySheetVisible ? 'flex' : 'none'},
              styles.listContainer,
            ]}>
            <FlatList
              ref={playerAnthologyListRef}
              getItemLayout={(item, index) => ({
                length: 45,
                offset: 45 * index,
                index,
              })}
              data={pageInfo?.episodes}
              renderItem={({item, index}) => (
                <Pressable
                  style={{flex: 1}}
                  onPress={() => {
                    setFlashData(true);
                    changeAnthology(index);
                    setVisible(false);
                  }}>
                  <View
                    style={[
                      styles.card,
                      {
                        borderColor: playerTextColor(
                          item.taskUrl === episode!.taskUrl,
                        ),
                      },
                    ]}>
                    <InfoText
                      title={item.title}
                      style={{
                        fontWeight:
                          item.taskUrl === episode!.taskUrl ? 'bold' : 'normal',
                        color: playerTextColor(
                          item.taskUrl === episode!.taskUrl,
                        ),
                      }}
                    />
                  </View>
                </Pressable>
              )}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').width * (9 / 16),
    width: Dimensions.get('window').width,
    overflow: 'hidden',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenContaner: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').height,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  topBar: {
    top: 0,
    left: 0,
  },
  bottomBar: {
    bottom: 0,
    left: 0,
  },
  fullscreenBottomBar: {
    width: '100%',
    height: 80,
    position: 'absolute',
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: 'space-around',
  },
  bottomBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  slider: {
    flex: 1,
    marginHorizontal: 15,
  },
  card: {
    borderWidth: 2,
    height: 40,
    padding: 10,
    margin: 5,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
  },
  listContainer: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,1)',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    right: 0,
    bottom: 0,
  },
});

export default VideoPlayer;
