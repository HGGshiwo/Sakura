import {
  Dimensions,
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
  OnSeekData,
} from 'react-native-video';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faExpand,
  faForwardFast,
  faSun,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import {ReactNode, useEffect, useRef, useState} from 'react';
import Orientation from 'react-native-orientation-locker';
import {Pressable, Text} from 'react-native';
import {LoadingText} from '../../../../component/Text';
import {PlayButton} from './PlayButton';
import {NextButton} from './NextButton';
import {RateMessage} from './RateMessage';
import {BackButton} from '../../../../component/Button';
import {LoadingBox} from '../../../../component/Loading';
import RateSheet from './RateSheet';
import Blank from './Blank';
import {useIsFocused, useNavigationState} from '@react-navigation/native';
import theme from '../../../../theme';
import SystemSetting from 'react-native-system-setting';
import {Bar} from 'react-native-progress';

interface PlayerProps {
  videoUrlAvailable: boolean; //video源是否解析成功
  nextVideoAvailable: boolean; //下一个视频是否可用
  videoUrl: string;
  videoType: string;
  title: string;
  onVideoErr: Function;
  onBack: () => void;
  toNextVideo: () => void;
  onProgress: (progress: number, perProgress: number) => void;
  defaultProgress: number; //初始的进度
  renderAnthologys: (
    visible: boolean,
    setVisible: (visible: boolean) => void,
  ) => ReactNode; //选集列表
}

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

const Player: React.FC<PlayerProps> = ({
  videoUrlAvailable,
  nextVideoAvailable,
  videoUrl,
  videoType,
  title,
  onVideoErr,
  onBack,
  toNextVideo,
  onProgress,
  defaultProgress,
  renderAnthologys,
}) => {
  const videoRef = useRef<Video | null>(null);

  const [fullscreen, setFullscreen] = useState(false); //视频是否全屏

  const [paused, setPaused] = useState(true); //视频是否暂停
  const [loading, setLoading] = useState(true); //视频是否在加载中
  const [erring, setErring] = useState(false); //视频是否播放错误
  const [progress, setProgress] = useState(defaultProgress); //当前视频播放进度
  const [duration, setDuration] = useState(0); //当前视频总时长
  const [cache, setCache] = useState(0); //当前视频缓存位置
  const seekingRef = useRef(false); //是否在加载
  const [fmtDuration, setFmtDuration] = useState('00:00'); //格式化后的视频位置
  const [fmtProgress, setFmtProgress] = useState('00:00'); //格式化后的视频时长
  const controlTimer = useRef(-1); //当前的计时器
  const [bitrateText, setBitrateText] = useState(''); //带宽

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

  useEffect(() => {
    if (videoUrlAvailable) {
      setControlVisible(true);
      setErring(false);
    } else {
      setPaused(true);
      pausedRef.current = true;
    }
  }, [videoUrlAvailable]);

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
        console.log(progressRef.current, durationRef.current);
        onProgress(
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

  const videoError = (err: any) => {
    console.log(err);
    setErring(true);
    onVideoErr();
  };

  const onLoad = (data: OnLoadData) => {
    setLoading(false);
    setFmtDuration(sec_to_time(data.duration));
    setDuration(data.duration);
    durationRef.current = data.duration;
    setPaused(false);
    pausedRef.current = false;
    onSlidingComplete(defaultProgress);
    waitCloseControl();
  };

  const _onProgress = (data: OnProgressData) => {
    setCache(data.playableDuration);
    if (!seekingRef.current) {
      //当seek时由slider更新progress
      setProgress(data.currentTime);
      progressRef.current = data.currentTime;
    }
  };

  const onSlidingComplete = (data: number) => {
    setProgress(data); //当seek时，由slide自己更新
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
    if (controlTimer.current !== -1) {
      clearTimeout(controlTimer.current);
      controlTimer.current = -1;
    }
    controlTimer.current = setTimeout(() => {
      console.log(seekingRef.current);
      if (!seekingRef.current) {
        setControlVisible(false);
        controlVisibleRef.current = false;
      }
    }, 3000);
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
      if (controlTimer.current !== -1) {
        clearTimeout(controlTimer.current);
        controlTimer.current = -1;
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
    orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
      ? (setFullscreen(true), StatusBar.setHidden(true))
      : (setFullscreen(false), StatusBar.setHidden(false));
  }

  //切换是否全屏
  const handleFullscreen = () => {
    fullscreen
      ? Orientation.lockToPortrait()
      : Orientation.lockToLandscapeLeft();
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
    setProgress(progressRef.current);
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
    let _bright = baseBrightRef.current - dy * 0.002;
    _bright = Math.max(Math.min(1, _bright), 0);
    setBright(_bright);
    console.log(_bright)
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
    let _volume = baseVolumeRef.current - dy * 0.002;
    _volume = Math.max(Math.min(1, _volume), 0);
    setVolume(_volume);
    SystemSetting.setVolume(_volume);
  };

  const onRightMoveYComplete = () => {
    setVolumeMessageVisible(false);
  };

  const {VideoStyle} = theme['red'];
  return (
    <View style={fullscreen ? styles.fullscreenContaner : styles.container}>
      {!videoUrlAvailable ? (
        <LoadingText title="解析视频地址中..." />
      ) : (
        <>
          <Video
            ref={videoRef}
            source={{
              uri: videoUrl,
              type: videoType,
            }}
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
          <View
            style={[
              styles.topBar,
              styles.bar,
              {
                display: controlVisible ? 'flex' : 'none',
                height: fullscreen ? 60 : 40,
              },
            ]}>
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
              <BackButton
                onPress={() => {
                  fullscreen ? handleFullscreen() : onBack();
                }}
              />
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
              styles.bottomBar,
              styles.bar,
              {display: controlVisible && !fullscreen ? 'flex' : 'none'},
            ]}>
            <PlayButton onPress={handlePlay} paused={paused} />
            <View style={styles.slider}>
              <Scrubber
                value={progress}
                bufferedValue={cache}
                onSlidingStart={onSlidingStart}
                onSlidingComplete={onSlidingComplete}
                totalDuration={duration}
                trackColor={VideoStyle.textColor(true)}
                scrubbedColor={VideoStyle.textColor(true)}
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
          </View>

          {/* bottom bar fullscreen*/}
          <View
            style={[
              styles.bottomBar,
              styles.fullscreenBottomBar,
              {
                display: controlVisible && fullscreen ? 'flex' : 'none',
              },
            ]}>
            <View style={styles.bottomBarRow}>
              <LoadingText title={fmtProgress} />
              <View style={styles.slider}>
                <Scrubber
                  value={progress}
                  bufferedValue={cache}
                  onSlidingStart={onSlidingStart}
                  onSlidingComplete={onSlidingComplete}
                  totalDuration={duration}
                  trackColor={VideoStyle.textColor(true)}
                  scrubbedColor={VideoStyle.textColor(true)}
                  displayValues={false}
                />
              </View>
              <LoadingText title={fmtDuration} />
            </View>
            <View style={styles.bottomBarRow}>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <PlayButton onPress={handlePlay} paused={paused} />
                <NextButton
                  onPress={toNextVideo}
                  disabled={!nextVideoAvailable}
                />
              </View>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <Pressable onPress={() => setRateSheetVisible(true)}>
                  <LoadingText title={rateText} />
                </Pressable>
                <Pressable onPress={() => setAnthologySheetVisible(true)}>
                  <LoadingText style={{marginLeft: 20}} title="选集" />
                </Pressable>
              </View>
            </View>
          </View>

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
            <FontAwesomeIcon color='white' icon={faSun} />
            <Bar
              style={{marginLeft: 10}}
              borderWidth={0}
              color={VideoStyle.indicatorColor}
              unfilledColor="lightgrey"
              progress={bright}
              width={100}
              height={5}
            />
          </RateMessage>

          {/* 声音 */}
          <RateMessage show={volumeMessageVisible}>
            <FontAwesomeIcon color='white' icon={faVolumeHigh} />
            <Bar
              style={{marginLeft: 10}}
              borderWidth={0}
              color={VideoStyle.indicatorColor}
              unfilledColor="lightgrey"
              progress={volume}
              width={100}
              height={5}
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
          {renderAnthologys(anthologySheetVisible, setAnthologySheetVisible)}
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
});

export {Player};
