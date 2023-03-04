import {FAB} from '@rneui/themed';
import {Dimensions, StatusBar, StyleSheet, View} from 'react-native';
import Scrubber from '../Scrubber';
import Video, {
  OnBandwidthUpdateData,
  OnLoadData,
  OnProgressData,
  OnSeekData,
} from 'react-native-video';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {TouchableWithoutFeedback} from 'react-native';
import {faChevronLeft, faExpand} from '@fortawesome/free-solid-svg-icons';
import {ReactDOM, useEffect, useRef, useState} from 'react';
import sec_to_time from '../../../public/sec_to_time';
import Orientation from 'react-native-orientation-locker';
import {Pressable} from 'react-native';
import {LoadingText} from '../../../component/Text';
import {PlayButton} from './PlayButton';
import {NextButton} from './NextButton';
import {RateMessage} from './RateMessage';
import {BackButton} from '../../../component/Button';
import {LoadingBox} from '../../../component/Loading';
import RateSheet from './RateSheet';
import Blank from './Blank';

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
}

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
}) => {
  const videoRef = useRef<Video | null>(null);

  const [fullscreen, setFullscreen] = useState(false); //视频是否全屏
  const [rateSheetVisible, setRateSheetVisible] = useState(false); //速度sheet是否可见
  const [paused, setPaused] = useState(true); //视频是否暂停
  const [loading, setLoading] = useState(true); //视频是否在加载中
  const [erring, setErring] = useState(false); //视频是否播放错误
  const [progress, setProgress] = useState(defaultProgress); //当前视频播放进度
  const [duration, setDuration] = useState(0); //当前视频总时长
  const [cache, setCache] = useState(0); //当前视频缓存位置
  const seekingRef = useRef(false); //是否在加载
  const [fmtDuration, setFmtDuration] = useState('00:00'); //格式化后的视频位置
  const [fmtProgress, setFmtProgress] = useState('00:00'); //格式化后的视频时长
  const [controlVisible, setControlVisible] = useState(true); //是否展示control控件
  const controlTimer = useRef(-1); //当前的计时器
  const [bitrateText, setBitrateText] = useState(''); //带宽

  //速度控制
  const [rateText, setRateText] = useState('倍速');
  const [playRate, setPlayRate] = useState(1); //当前播放速度
  const [rateId, setRateId] = useState(2); //播放速度id
  const [rateMessageVisible, setRateMessageVisible] = useState(false); //加速消息是否可见
  const prePlayRate = useRef(1); //长按前的播放速度

  const progressRef = useRef(0);
  const durationRef = useRef(0);

  useEffect(() => {
    setControlVisible(true);
    setErring(false);
  }, [videoUrl]);

  useEffect(() => {
    // This would be inside componentDidMount()
    Orientation.addOrientationListener(handleOrientation);
    const interval = setInterval(() => {
      //每15s更新数据库
      console.log(progressRef.current, durationRef.current);
      if (durationRef.current) {
        onProgress(
          progressRef.current,
          progressRef.current / durationRef.current,
        );
      }
    }, 15000);
    return () => {
      // This would be inside componentWillUnmount()
      clearInterval(interval);
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
    onSlidingComplete(defaultProgress);
    waitCloseControl();
  };

  const _onProgress = (data: OnProgressData) => {
    setFmtProgress(sec_to_time(data.currentTime));
    setCache(data.playableDuration);
    if (!seekingRef.current) {
      //当seek时由video更新progress
      setProgress(data.currentTime);
      progressRef.current = data.currentTime;
    }
  };

  const onSlidingComplete = (data: number) => {
    setProgress(data); //当seek时，由slide自己更新
    videoRef.current?.seek(data);
    waitCloseControl();
  };

  const onSlidingStart = () => {
    seekingRef.current = true;
  };

  const onSeek = (data: OnSeekData) => {
    seekingRef.current = false;
  };

  //等待control消失的计时器
  const waitCloseControl: Function = () => {
    if (controlTimer.current !== -1) {
      clearTimeout(controlTimer.current);
      controlTimer.current = -1;
    }
    if (!seekingRef.current) {
      controlTimer.current = setTimeout(() => {
        setControlVisible(false);
      }, 3000);
    }
  };

  //打开control并在一段时间之后关闭
  const openControl = () => {
    setControlVisible(true);
    waitCloseControl();
  };

  //点击了视频空白区域
  const handlePressVideo = () => {
    setRateSheetVisible(false)
    if (controlVisible) {
      if (controlTimer.current !== -1) {
        clearTimeout(controlTimer.current);
        controlTimer.current = -1;
      }
      setControlVisible(false);
    } else {
      openControl();
    }
  };

  const handlePlay = () => {
    console.log('press');
    setPaused(!paused);
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
    setRateSheetVisible(false)
    prePlayRate.current = playRate;
    setRateMessageVisible(true);
    setPlayRate(3);
  };

  const onLongPressOut = () => {
    //取消长按返回原速
    setRateMessageVisible(false);
    setPlayRate(prePlayRate.current);
  };

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
            onDbPress={()=>setPaused(!paused)}
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
                trackColor="deeppink"
                scrubbedColor="deeppink"
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

          {/* bottom bar */}
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
                  trackColor="deeppink"
                  scrubbedColor="deeppink"
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
                <LoadingText style={{marginLeft: 20}} title="选集" />
              </View>
            </View>
          </View>
          <RateMessage show={rateMessageVisible} />
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
  }
});

export {Player};
