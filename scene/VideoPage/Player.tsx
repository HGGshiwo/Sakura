import {Text} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';
import Scrubber from './Scrubber';
import Video, {OnLoadData, OnProgressData, OnSeekData} from 'react-native-video';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlay} from '@fortawesome/free-solid-svg-icons/faPlay';
import {TouchableNativeFeedback} from 'react-native-gesture-handler'

import {
  faChevronLeft,
  faExpand,
  faPause,
} from '@fortawesome/free-solid-svg-icons';
import {useRef, useState} from 'react';
import sec_to_time from '../../public/sec_to_time';

type playerProps = {
  videoUrlAvaliable: boolean;
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

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [cache, setCache] = useState(0);
  const [seeking, setSeeking] = useState(false)  //是否在加载
  const seekingRef = useRef(false) 

  const [fmtDuration, setFmtDuration] = useState('00:00');
  const [fmtProgress, setFmtProgress] = useState('00:00');

  const videoError = (err: any) => {
    console.log(err);
    onVideoErr();
  };

  const onLoad = (data: OnLoadData) => {
    console.log(data);
    setLoading(!data.canPlaySlowForward);
    setFmtDuration(sec_to_time(data.duration));
    setDuration(data.duration);
  };

  const onProgress = (data: OnProgressData) => {
    setFmtProgress(sec_to_time(data.currentTime));
    setCache(data.playableDuration);
    if(!seekingRef.current) { //当seek时由video更新progress
      setProgress(data.currentTime);
    }
  };

  const onSlidingComplete = (data: number) => {
    console.log(data)
    setProgress(data) //当seek时，由slide自己更新
    videoRef.current?.seek(data);
  };

  const onSlidingStart = ()=>{
    seekingRef.current = true
    setSeeking(true)
  }

  const onSeek = (data: OnSeekData)=>{
    setSeeking(false)
    seekingRef.current = false
  }

  var styles = StyleSheet.create({
    container: {
      overflow: 'hidden',
      height: videoHeight,
      width: videoWidth,
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
      height: 30,
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
  });

  return (
    <View style={{...styles.container}}>
      {!videoUrlAvaliable ? (
        <Text style={styles.loadingText}>加载播放地址中...</Text>
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
          <View style={{...styles.topBar, ...styles.bar}}>
            <FontAwesomeIcon color="white" icon={faChevronLeft} />
          </View>
          {loading || seeking ? (
            <Text style={styles.loadingText}>加载视频中...</Text>
          ) : (
            <></>
          )}
          <View style={{...styles.bottomBar, ...styles.bar}}>
            <TouchableNativeFeedback onPress={() => {console.log('presss'); setPaused(!paused)}}>
              {paused ? (
                <FontAwesomeIcon color="white" icon={faPlay} />
              ) : (
                <FontAwesomeIcon color="white" icon={faPause} />
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
            <FontAwesomeIcon color="white" icon={faExpand} />
          </View>
        </>
      )}
    </View>
  );
};

export {Player};
