import {Tab, TabView, Button, Text, Image} from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import {useState, useEffect} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import {Agent} from '../api/yhdm';
import {Source} from '../type/Source';
import {PlayList} from '../type/PlayList';

const Video = require('react-native-video');

const Player = ({loading, videoUrl, videoHeight, videoWidth}: any) => {
  var styles = StyleSheet.create({
    video: {
      height: videoHeight,
      width: videoWidth,
      backgroundColor: 'black',
      justifyContent: "center",
      alignItems: "center"
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

const TitleLine = ({title}: any) => {
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
      paddingHorizontal: 20,
    },
    buttonContainer: {
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
      height: 38,
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

const ListTitleLine = ({title, buttonText}: any) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonContainer: {
      height: 38,
      paddingLeft: 50,
    },
    buttonTitle: {
      color: 'gray',
    },
    text: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <Button
        type="clear"
        titleStyle={styles.buttonTitle}
        containerStyle={styles.buttonContainer}>
        {buttonText}
      </Button>
    </View>
  );
};

const RelaviteLine = ({data}: any) => {
  const styles = StyleSheet.create({
    title: {
      fontSize: 18,
      color: 'black',
      fontWeight: 'normal',
    },
  });
  const renderItem = ({item}: {item: Source}) => {
    return <Button titleStyle={styles.title} type="clear" title={item.title} />;
  };
  return (
    <FlatList
      horizontal={true}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => `${item.id}`}
    />
  );
};

const ListLine = ({data, onPress}: {data: Source[]; onPress?: Function}) => {
  const [activeIndex, setActiveIndex] = useState(0); //当前活跃的块
  
  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    itemContainer: {
      backgroundColor: 'gainsboro',
      width: 150,
      height: 75,
      marginHorizontal: 10,
      padding: 10,
    },
    text: {
      fontSize: 20,
    },
    active: {
      color: 'deeppink'
    }
  });

  const renderItem = ({item, index}: {item: Source, index:number}) => {
    let textStyle = (index === activeIndex) ? styles.active:{}
    textStyle = {...textStyle, ...styles.text}
    return (
      <TouchableHighlight
        onPress={() => {
          if (onPress) onPress(item.id);
          setActiveIndex(index)
        }}>
        <View style={styles.itemContainer}>
          <Text style={textStyle}>{item.title}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  console.log(data);

  return data.length != 0 ? (
    <FlatList
      style={styles.container}
      horizontal={true}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => `${item.id}`}
    />
  ) : (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Text style={styles.text}>暂无数据</Text>
      </View>
    </View>
  );
};

const RecommandLine = ({item}: any) => {
  const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      height: 200,
      width: '100%',
    },
    image: {
      flex: 2,
    },
    infoContainer: {
      flex: 3,
    },
    rateContainer: {
      flex: 1,
    },
  });
  return (
    <View style={styles.itemContainer}>
      <Image containerStyle={styles.image} source={{uri: item.src}} />
      <View style={styles.infoContainer}>
        <Text>{item.title}</Text>
        <Text>{item.detail}</Text>
      </View>
      <View style={styles.rateContainer}>
        <View>
          <Text>9.7分</Text>
        </View>
      </View>
    </View>
  );
};

const VideoPlay = () => {
  const url = 'https://m.yhdmp.net/showp/22598.html';

  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [videoHeight, setVideoHeight] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);
  const [astate, setAstate] = useState('');
  const [atitle, setAtitle] = useState('');
  const [aplayList, setAplayList] = useState<PlayList>(); //完整的播放列表
  const [arelatives, setArelatives] = useState<Source[]>([]); //同系列列表
  const [anthologys, setAnthologys] = useState<Source[]>([]); //选集列表
  const [asources, setAsources] = useState<Source[]>([]); //播放源列表
  const ratio = 0.56; //视频长宽比例

  const relatives = [
    {title: '第一季', id: 0},
    {title: '第二季', id: 1},
  ];

  const recommands = [
    {
      title: '飙速宅男',
      id: 0,
      detail: '全11话',
      src: 'https://lz.sinaimg.cn/large/008kBpBlgy1h0j7utzk1xj305i07njrp.jpg',
    },
    {
      title: '飙速宅男',
      id: 1,
      detail: '全11话',
      src: 'https://lz.sinaimg.cn/large/008kBpBlgy1h0j7utzk1xj305i07njrp.jpg',
    },
  ];

  useEffect(() => {
    const agent = new Agent(url);
    agent.afterLoadTitle(setAtitle);
    agent.afterLoadPlayList((playList: PlayList) => {
      console.log(playList);
      setAplayList(playList);
      let sources = Object.keys(playList).map((title, id) => {
        return {title, id};
      });
      setAsources(sources);
      setAnthologys(playList[sources[0].title as keyof PlayList]);
    });
    agent.afterLoadInfoSub(({state}: {state: string}) => {
      console.log(state);
      setAstate(state);
    });
    setVideoWidth(Dimensions.get('window').width);
    setVideoHeight(Dimensions.get('window').width * ratio);

    agent.load();
  }, []);

  // Later on in your styles..
  var styles = StyleSheet.create({});

  const [index, setIndex] = useState(0);

  const handlePressSource = (sourceIndex: number) => {
    console.log(sourceIndex);
    setAnthologys(aplayList![asources[sourceIndex].title as keyof PlayList]);
  };

  return (
    <>
      <Player
        videoHeight={videoHeight}
        videoWidth={videoWidth}
        videoUrl={videoUrl}
        loading={loading}
      />
      <Tab
        value={index}
        onChange={setIndex}
        dense
        style={{width: '30%', marginLeft: 10}}>
        <Tab.Item>简介</Tab.Item>
        <Tab.Item>评论</Tab.Item>
      </Tab>
      <TabView value={index} onChange={setIndex}>
        <TabView.Item>
          <FlatList
            ListHeaderComponent={
              <>
                <View style={{padding: 10}}>
                  <TitleLine title={atitle} />
                  <DetailLine />
                  <ListTitleLine
                    title={'播放列表'}
                    buttonText={`共${asources.length}个播放列表 >`}
                  />
                  <ListLine data={asources} onPress={handlePressSource} />
                  <ListTitleLine title={'选集'} buttonText={`${astate} >`} />
                  {relatives.length == 0 ? null : (
                    <RelaviteLine data={relatives} />
                  )}
                  <ListLine data={anthologys} />
                </View>
              </>
            }
            data={recommands}
            renderItem={RecommandLine}
            keyExtractor={item => `${item.id}`}
          />
        </TabView.Item>
        <TabView.Item></TabView.Item>
      </TabView>
    </>
  );
};

export default VideoPlay;
