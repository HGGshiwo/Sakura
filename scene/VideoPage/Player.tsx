import {Text} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';

import Video from 'react-native-video';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlay, height} from '@fortawesome/free-solid-svg-icons/faPlay';
import {faChevronLeft, faExpand, faPause} from '@fortawesome/free-solid-svg-icons';

type playerProps = {
  loading: boolean;
  videoUrl: string;
  videoType: string;
  videoHeight: number;
  videoWidth: number;
  onVideoErr: Function;
};

const Player = ({
  loading,
  videoUrl,
  videoType,
  videoHeight,
  videoWidth,
  onVideoErr,
}: playerProps) => {
  var styles = StyleSheet.create({
    video: {
      height: videoHeight,
      width: videoWidth,
      backgroundColor: 'black',
      // justifyContent: 'center',
      // alignItems: 'center',
      justifyContent: 'space-between',
    },
    loadingText: {
      color: 'white',
      fontSize: 18,
    },
    bar:{
      width: '100%',
      height: 30,
      elevation: 1,
      flexDirection: 'row',
      backgroundColor: "rgba(0,0,0,0.5)",
      position: 'absolute',
      alignItems:'center',
      paddingHorizontal: 10,
      justifyContent: 'space-between'
    },
    topBar: {   
      top: 0,
    },
    bottomBar: {
      bottom: 0,
    },
  });

  const videoError = (err: any) => {
    console.log(err);
    onVideoErr();
  };

  const onBuffer = (data: any) => {
    console.log(data);
  };
  return loading ? (
    <View style={{...styles.video}}>
      <Text style={styles.loadingText}>加载中...</Text>
    </View>
  ) : (
    <>
      <Video
        source={{
          uri: videoUrl,
          type: videoType,
        }}
        onBuffer={onBuffer} // Callback when remote video is buffering
        onError={videoError} // Callback when video cannot be loaded
        style={styles.video}>
          <View style={{...styles.bar, ...styles.topBar}}>
            <FontAwesomeIcon color="white" icon={faChevronLeft} />
          </View>
          <View style={{...styles.bar, ...styles.bottomBar}}>
            <FontAwesomeIcon color="white" icon={faPlay} />
            <FontAwesomeIcon color="white" icon={faPause} />
            <FontAwesomeIcon color="white" icon={faExpand} />
          </View>
      </Video>
    </>
  );
};

export {Player};
