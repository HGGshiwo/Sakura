import {Text} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';
import Scrubber from './Scrubber';
import Video, {
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

type playerProps = {
  videoUrlAvaliable: boolean; //video源是否解析成功
  videoUrl: string;
  videoType: string;
  videoHeight: number;
  videoWidth: number;
  onVideoErr: Function;
};

const Player = ({
  videoUrlAvaliable,
  videoUrl,
  videoType,
  videoHeight,
  videoWidth,
  onVideoErr,
}: playerProps) => {
  const videoRef = useRef<Video | null>(null);

  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('视频加载中...'); //video源不可用时的提示信息

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [cache, setCache] = useState(0);
  const [seeking, setSeeking] = useState(false); //是否在加载
  const seekingRef = useRef(false);

  const [fmtDuration, setFmtDuration] = useState('00:00');
  const [fmtProgress, setFmtProgress] = useState('00:00');

  const [controlVisible, setControlVisible] = useState(true); //是否展示control控件
  const visiblePeriod = useRef(0); //control可显示的时间

  useEffect(()=>{
    setControlVisible(true)
  }, [videoUrl])

  const videoError = (err: any) => {
    console.log(err);
    setLoadingText('视频加载失败');
    onVideoErr();
  };

  const onLoad = (data: OnLoadData) => {
    setLoading(false);
    setFmtDuration(sec_to_time(data.duration));
    setDuration(data.duration);
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
    setSeeking(true);
  };

  const onSeek = (data: OnSeekData) => {
    setSeeking(false);
    seekingRef.current = false;
  };

  //等待control消失的计时器
  const waitCloseControl: Function = () => {
    setTimeout(() => {
      visiblePeriod.current -= 1;
      if (seekingRef.current) {
        return;
      }
      if (visiblePeriod.current > 0) {
        waitCloseControl();
      } else {
        setControlVisible(false);
      }
    }, 1000);
  };

  //打开control并在一段时间之后关闭
  const openControl = () => {
    setControlVisible(true);
    visiblePeriod.current = 5;
    waitCloseControl();
  };

  //点击了视频
  const handlePressVideo = () => {
    console.log('press');
    if (controlVisible) {
      //立即关闭control
      setControlVisible(false);
      visiblePeriod.current = -1;
    } else {
      openControl();
    }
  };

  const handlePressPlay = () => {
    setPaused(!paused);
  };

  return (
    <View style={[styles.container, {height: videoHeight, width: videoWidth}]}>
      {!videoUrlAvaliable ? (
        <Text style={styles.loadingText}>解析视频地址中...</Text>
      ) : (
        <>
          <Video
            ref={videoRef}
            source={{uri: videoUrl, type: videoType}}
            onLoad={onLoad} // Callback when remote video is buffering
            onError={videoError} // Callback when video cannot be loaded
            onSeek={onSeek}
            style={styles.video}
            paused={paused}
            onProgress={onProgress}
          />
          <TouchableWithoutFeedback
            style={{height: '100%'}}
            onPress={handlePressVideo}>
            <View style={styles.touchable}></View>
          </TouchableWithoutFeedback>
          {loading || seeking ? (
            <Text style={styles.loadingText}>{loadingText}</Text>
          ) : (
            <></>
          )}
          <View
            style={[
              styles.topBar,
              styles.bar,
              {display: controlVisible ? 'flex' : 'none'},
            ]}>
            <FontAwesomeIcon color="white" icon={faChevronLeft} />
          </View>
          <View
            style={[
              styles.bottomBar,
              styles.bar,
              {display: controlVisible ? 'flex' : 'none'},
            ]}>
            <TouchableNativeFeedback onPress={handlePressPlay}>
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
            <FontAwesomeIcon color="white" size={20} icon={faExpand} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
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
    fontSize: 18,
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
