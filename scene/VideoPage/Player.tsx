import {Text} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';
import Video from 'react-native-video';

type playerProps = {
  loading: boolean;
  videoUrl: string;
  videoHeight: number;
  videoWidth: number;
  onVideoErr: Function;
};
const Player = ({
  loading,
  videoUrl,
  videoHeight,
  videoWidth,
  onVideoErr,
}: playerProps) => {
  console.log(loading, videoUrl);

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
