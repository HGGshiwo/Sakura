import {Text} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';

const Video = require('react-native-video');

const Player = ({loading, videoUrl, videoHeight, videoWidth}: any) => {


  var styles = StyleSheet.create({
    video: {
      height: videoHeight,
      width: videoWidth,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: 'white',
      fontSize: 18,
    },
  });

  const videoError = (err: any) => {
    console.log(err);
  };

  const onBuffer = (data: any) => {
    console.log(data);
  };
  return loading ? (
    <View style={{...styles.video}}>
      <Text style={styles.loadingText}>加载中...</Text>
    </View>
  ) : (
    <Video
      source={{
        uri: videoUrl,
        type: 'm3u8',
      }}
      onBuffer={onBuffer} // Callback when remote video is buffering
      onError={videoError} // Callback when video cannot be loaded
      style={styles.video}
    />
  );
};

export {Player};
