import {Tab, TabView} from '@rneui/themed';
import {useState, useEffect} from 'react';
import {StyleSheet, Dimensions, View, FlatList, StatusBar} from 'react-native';
import {Agent} from '../../api/yhdm';
import {Source} from '../../type/Source';
import {PlayList} from '../../type/PlayList';
import {InfoSub} from '../../type/InfoSub';
import {DetailSheet} from './DetailSheet';
import {RecommandLine} from './RecommandLine';
import {ListLine} from './ListLine';
import {DetailButtonLine} from './DetailButtonLine';
import {ListTitleLine} from './ListTitleLine';
import {Player} from './Player';
import {RelaviteLine} from './RelaviteLine';
import {TitleLine} from './TitleLine';
import {AnthologySheet} from './AnthologySheet';

const VideoPage = () => {
  const url = 'https://m.yhdmp.net/showp/22598.html';

  const emptyInfoSub = {
    author: '未知',
    alias: [],
    state: '',
    time: '',
    type: [],
    produce: '',
  };

  const [index, setIndex] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [videoHeight, setVideoHeight] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);

  const [atitle, setAtitle] = useState('');
  const [asrc, setAsrc] = useState('');

  const [ainfoSub, setAinfoSub] = useState<InfoSub>(emptyInfoSub);
  const [ainfo, setAinfo] = useState('');
  const [aplayList, setAplayList] = useState<PlayList>(); //完整的播放列表
  const [arelatives, setArelatives] = useState<Source[]>([]); //同系列列表
  const [anthologys, setAnthologys] = useState<Source[]>([]); //选集列表
  const [asources, setAsources] = useState<Source[]>([]); //播放源列表

  const [detailLineVisible, setDetailSheetVisible] = useState(false);
  const [anthologySheetVisible, setAnthologySheetVisible] = useState(false);
  const [sourcesVisible, setSourcesVisible] = useState(false)
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
    const height = Dimensions.get('window').height;
    const width = Dimensions.get('window').width;
    setWindowHeight(height);
    setWindowWidth(width);
    setVideoWidth(width);
    setVideoHeight(width * ratio);

    const agent = new Agent(url);
    agent.afterLoadTitle(setAtitle);

    agent.afterLoadPlayList((playList: PlayList) => {
      setAplayList(playList);
      let sources = Object.keys(playList).map((title, id) => {
        return {title, id};
      });
      setAsources(sources);
      setAnthologys(playList[sources[0].title as keyof PlayList]);
    });

    agent.afterLoadInfoSub((infoSub: InfoSub) => {
      setAinfoSub(infoSub);
      console.log(infoSub);
    });

    agent.afterLoadInfo((info: string) => {
      console.log(info);
      setAinfo(info);
    });

    agent.afterLoadSrc((src: string) => {
      console.log(src);
      setAsrc(src);
    });

    agent.load();
  }, []);

  // Later on in your styles..
  var styles = StyleSheet.create({
    tabContainer: {
      width: '30%',
      marginLeft: 10,
    },
  });

  const handlePressSource = (sourceIndex: number) => {
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

      <Tab value={index} onChange={setIndex} dense style={styles.tabContainer}>
        <Tab.Item>简介</Tab.Item>
        <Tab.Item>评论</Tab.Item>
      </Tab>

      <TabView value={index} onChange={setIndex}>
        <TabView.Item>
          <FlatList
            ListHeaderComponent={
              <>
                <View style={{padding: 10, width: windowWidth}}>
                  <TitleLine title={atitle} />
                  <DetailButtonLine
                    author={ainfoSub.author}
                    onPress={() => setDetailSheetVisible(true)}
                  />
                  <ListTitleLine
                    title={'播放列表'}
                    buttonText={`共${asources.length}个播放列表 >`}
                    onPress={() => setSourcesVisible(!sourcesVisible)}
                  />
                  {sourcesVisible?<ListLine data={asources} onPress={handlePressSource} />:<></>}
                  <ListTitleLine
                    title={'选集'}
                    buttonText={`${ainfoSub?.state} >`}
                    onPress={() => setAnthologySheetVisible(true)}
                  />
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

      <DetailSheet
        top={videoHeight}
        height={windowHeight - videoHeight - StatusBar.currentHeight!}
        title={atitle}
        src={asrc}
        infoSub={ainfoSub}
        info={ainfo}
        visible={detailLineVisible}
        onPress={() => {
          setDetailSheetVisible(false);
        }}
      />

      <AnthologySheet
        top={videoHeight}
        height={windowHeight - videoHeight - StatusBar.currentHeight!}
        playList={aplayList!}
        sources={asources}
        state={ainfoSub.state}
        visible={anthologySheetVisible}
        defaultActive={0}
        onPress={() => {
          setAnthologySheetVisible(false);
        }}
      />
    </>
  );
};

export default VideoPage;
