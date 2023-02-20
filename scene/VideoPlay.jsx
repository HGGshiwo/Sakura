import {Tab, TabView, Button, Text} from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import {useState, useEffect} from 'react';
import {StyleSheet, Dimensions, View, FlatList} from 'react-native';
import Video from 'react-native-video';
import {Vp} from '../api/yhdm';

const Player = ({loading, videoUrl, videoHeight, videoWidth}) => {
  var styles = StyleSheet.create({
    video: {
      height: videoHeight,
      width: videoWidth,
      backgroundColor: 'black',
    },
    loadingText: {
      color: 'white',
    },
  });

  const videoError = err => {
    console.log(err);
  };

  const onBuffer = data => {
    console.log(data);
  };
  return loading ? (
    <View style={{...styles.video, alignContent: 'center'}}>
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

const TitleLine = ({title}) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    text: {
      width: '50%',
    },
    button: {
      borderRadius: 20,
    },
    buttonContainer: {
      width: 100,
      height: 38,
    },
    buttonDone: {
      backgroundColor: 'lightgray',
      color: 'gray',
    },
  });
  return (
    <View style={styles.container}>
      <Text h4 style={styles.text}>
        {title}
      </Text>
      <Button
        size="sm"
        buttonStyle={{...styles.button, ...styles.buttonDone}}
        titleStyle={{...styles.buttonDone}}
        containerStyle={styles.buttonContainer}>
        {/* <Icon name='menu-outline'/> */}
        已追番
      </Button>
    </View>
  );
};

const DetailLine = () => {
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'flex-end',
      flexDirection: 'row',
    },
    buttonContainer: {
      width: 150,
      height: 38,
      paddingLeft: 50,
    },
    buttonTitle: {
      color: 'gray',
    },
  });
  return (
    <View style={styles.container}>
      <Button
        type="clear"
        containerStyle={styles.buttonContainer}
        titleStyle={styles.buttonTitle}>
        {'详情 >'}
      </Button>
    </View>
  );
};

const AnthologyTitleLine = () => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonContainer: {
      width: 200,
      height: 38,
      paddingLeft: 50,
    },
    buttonTitle: {
      color: 'gray',
    },
    text: {
      fontSize: 18,
      fontWeight:'bold'
    }
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>选集</Text>
      <Button
        type="clear"
        titleStyle={styles.buttonTitle}
        containerStyle={styles.buttonContainer}>
        {`已完结，全${12}话 >`}
      </Button>
    </View>
  );
};

const AnthologyLine = () => {
  const anthologys = [
    {title: '第1集', id: 0},
    {title: '第2集', id: 1},
    {title: '第3集', id: 2},
  ];

  const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    anthologysContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    anthologyContainer: {
      backgroundColor: 'lightgray',
      width: 150,
      height: 75,
      marginHorizontal: 10,
      padding: 10,
    },
    buttonContainer: {
      width: 150,
      height: 38,
      paddingLeft: 50,
    },
    buttonTitle: {
      color: 'gray',
    },
    text: {
      fontSize: 20,
    }
  });
  const renderItem = ({item}) => {
    return (
      <View style={styles.anthologyContainer}>
        <Text style={styles.text}>{item.title}</Text>
      </View>
    );
  };
  return (
    <FlatList
      horizontal={true}
      data={anthologys}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const VideoPlay = () => {
  const url = 'https://m.yhdmp.net/vp/23116-2-0.html';
  const [title, setTitle] = useState('title');
  const [episode, setEpisode] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [videoHeight, setVideoHeight] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);
  const ratio = 0.56; //视频长宽比例

  useEffect(() => {
    const vp = new Vp(url);
    setVideoWidth(Dimensions.get('window').width);
    setVideoHeight(Dimensions.get('window').width * ratio);

    vp.load(() => {
      console.log('loaded');
      setVideoUrl(vp.src);
      setEpisode(vp.episode);
      setTitle(vp.title);
      setLoading(false);
    });
  }, []);

  // Later on in your styles..
  var styles = StyleSheet.create({});

  const [index, setIndex] = useState(0);
  return (
    <>
      <Player
        videoHeight={videoHeight}
        videoWidth={videoWidth}
        videoUrl={videoUrl}
        loading={loading}
      />
      <Tab value={index} onChange={setIndex} dense style={{width: '30%'}}>
        <Tab.Item>简介</Tab.Item>
        <Tab.Item>评论</Tab.Item>
      </Tab>
      <TabView value={index} onChange={setIndex} style={{width: '100%'}}>
        <TabView.Item style={{width: '100%'}}>
          <View style={{padding: 10}}>
            <TitleLine title={title} />
            <DetailLine />
            <AnthologyTitleLine />
            <AnthologyLine />
          </View>
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'red', width: '100%'}}>
          <Text h1>五六七之暗影宿命</Text>
          <Text h1>{`episode: ${episode}`}</Text>
          <Text h1>{`video url: ${videoUrl}`}</Text>
          <Button>Start</Button>
        </TabView.Item>
      </TabView>
    </>
  );
};

export default VideoPlay;
