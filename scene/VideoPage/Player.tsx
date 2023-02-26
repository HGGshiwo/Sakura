import {FAB, Text} from '@rneui/themed';
import {Dimensions, StatusBar, StyleSheet, View} from 'react-native';
import Scrubber from './Scrubber';
import Video, {
  OnBandwidthUpdateData,
  OnLoadData,
  OnProgressData,
  OnSeekData,
} from 'react-native-video';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlay} from '@fortawesome/free-solid-svg-icons/faPlay';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import {TouchableWithoutFeedback} from 'react-native';
import {
  faChevronLeft,
  faExpand,
  faPause,
} from '@fortawesome/free-solid-svg-icons';
import {useEffect, useRef, useState} from 'react';
import sec_to_time from '../../public/sec_to_time';
import Orientation from 'react-native-orientation-locker';

interface playerProps {
  videoUrlAvaliable: boolean; //video源是否解析成功
  videoUrl: string;
  title: string;
  onVideoErr: Function;
  onBack: () => void;
}

const Player: React.FC<playerProps> = ({
  videoUrlAvaliable,
  videoUrl,
  title,
  onVideoErr,
  onBack,
}) => {
  const videoRef = useRef<Video | null>(null);

  const [fullscreen, setFullscreen] = useState(false); //视频是否全屏
  const [paused, setPaused] = useState(true); //视频是否暂停
  const [loading, setLoading] = useState(true); //视频是否在加载中
  const [erring, setErring] = useState(false); //视频是否播放错误
  const [progress, setProgress] = useState(0); //当前视频播放进度
  const [duration, setDuration] = useState(0); //当前视频总时长
  const [cache, setCache] = useState(0); //当前视频缓存位置
  const seekingRef = useRef(false); //是否在加载
  const [fmtDuration, setFmtDuration] = useState('00:00'); //格式化后的视频位置
  const [fmtProgress, setFmtProgress] = useState('00:00'); //格式化后的视频时长
  const [controlVisible, setControlVisible] = useState(true); //是否展示control控件
  const controlTimer = useRef(-1)
  const [bitrateText, setBitrateText] = useState(''); //带宽

  useEffect(() => {
    setControlVisible(true);
  }, [videoUrl]);

  useEffect(() => {
    // This would be inside componentDidMount()
    Orientation.addOrientationListener(handleOrientation);
    return () => {
      // This would be inside componentWillUnmount()
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
    setPaused(false);
    waitCloseControl();
  };

  const onProgress = (data: OnProgressData) => {
    setFmtProgress(sec_to_time(data.currentTime));
    setCache(data.playableDuration);
    if (!seekingRef.current) {
      //当seek时由video更新progress
      setProgress(data.currentTime);
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
    if(controlTimer.current !== -1) {
      clearTimeout(controlTimer.current)
      controlTimer.current = -1
    }
    controlTimer.current = setTimeout(() => {
      if(!seekingRef.current) {
        setControlVisible(false);
      }
    }, 3000);
  };

  //打开control并在一段时间之后关闭
  const openControl = () => {
    setControlVisible(true);
    waitCloseControl();
  };

  //点击了视频空白区域
  const handlePressVideo = () => {
    controlVisible ? setControlVisible(false):openControl()
  };

  const handlePlay = () => {
    setPaused(!paused);
  };

  function handleOrientation(orientation: string) {
    orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
      ? (setFullscreen(true), StatusBar.setHidden(true))
      : (setFullscreen(false), StatusBar.setHidden(false));
  }

  const handleFullscreen = () => {
    fullscreen
      ? Orientation.lockToPortrait()
      : Orientation.lockToLandscapeLeft();
  };

  //显示带宽
  const onBandwithUpdate = ({bitrate}: OnBandwidthUpdateData) => {
    const M = 1 << 20;
    const K = 1 << 10;
    let text =
      bitrate > M
        ? `${(bitrate / M).toFixed(2)}Mb/s`
        : bitrate > K
        ? `${(bitrate / K).toFixed(2)}Kb/s`
        : `${bitrate}b/s`;
    setBitrateText(text);
  };

  return (
    <View style={fullscreen ? styles.fullscreenContaner : styles.container}>
      {!videoUrlAvaliable ? (
        <Text style={styles.loadingText}>解析视频地址中...</Text>
      ) : (
        <>
          <Video
            ref={videoRef}
            source={{
              uri: videoUrl,
              type: 'm3u8',
            }}
            onLoad={onLoad} // Callback when remote video is buffering
            onError={videoError} // Callback when video cannot be loaded
            onSeek={onSeek}
            style={styles.video}
            paused={paused}
            onProgress={onProgress}
            reportBandwidth={loading}
            onBandwidthUpdate={onBandwithUpdate}
          />
          <TouchableWithoutFeedback
            style={{height: '100%'}}
            onPress={handlePressVideo}>
            <View style={styles.touchable}></View>
          </TouchableWithoutFeedback>
          {erring ? <Text>视频源不可用...</Text> : null}
          {!erring && loading ? (
            <>
              <FAB color="black" loading size="small" />
              <Text style={styles.loadingText}>{bitrateText}</Text>
            </>
          ) : null}
          <View
            style={[
              styles.topBar,
              styles.bar,
              {display: controlVisible ? 'flex' : 'none'},
            ]}>
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
              <TouchableNativeFeedback onPress={onBack}>
                <FontAwesomeIcon color="white" icon={faChevronLeft} />
              </TouchableNativeFeedback>
              <Text style={[styles.loadingText, {paddingLeft: 10}]}>
                {title}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.bottomBar,
              styles.bar,
              {display: controlVisible ? 'flex' : 'none'},
            ]}>
            <TouchableNativeFeedback onPress={handlePlay}>
              {paused ? (
                <FontAwesomeIcon color="white" size={24} icon={faPlay} />
              ) : (
                <FontAwesomeIcon color="white" size={24} icon={faPause} />
              )}
            </TouchableNativeFeedback>
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
            <Text style={styles.text}>{`${fmtProgress}/${fmtDuration}`}</Text>
            <TouchableNativeFeedback onPress={handleFullscreen}>
              <FontAwesomeIcon color="white" size={24} icon={faExpand} />
            </TouchableNativeFeedback>
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
  loadingText: {
    color: 'white',
    elevation: 1,
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
  slider: {
    flex: 1,
    marginHorizontal: 15,
  },
  text: {
    color: 'white',
    marginRight: 10,
  },
  touchable: {
    position: 'absolute',
    width: '100%',
    top: 40,
    bottom: 40,
  },
});

export {Player};
