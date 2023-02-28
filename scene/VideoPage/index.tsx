import {Tab, TabView} from '@rneui/themed';
import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, View, FlatList, StatusBar} from 'react-native';
import {Agent} from '../../api/yinghuacd/VideoAgent';
import {ListItemInfo} from '../../type/ListItemInfo';
import {Source} from '../../type/Source';
import {InfoSub} from '../../type/InfoSub';
import {DetailSheet} from './DetailSheet';
import {RecommandLine} from './RecommandLine';
import {ListLine} from './ListLine';
import {DetailButtonLine} from './DetailButtonLine';
import {ListTitleLine} from '../../component/ListTitleLine';
import {Player} from './Player';
import {RelaviteLine} from './RelaviteLine';
import {TitleLine} from './TitleLine';
import {AnthologySheet} from './AnthologySheet';
import {RecommandInfo} from '../../type/RecommandInfo';
import {VideoPageProps} from '../../App';
import { V1RecommandInfoItem } from '../../component/ListItem';

const VideoPage: React.FC<VideoPageProps> = ({route, navigation}) => {
  const emptyInfoSub = {
    author: '未知',
    alias: [],
    state: '',
    time: '',
    type: [],
    produce: '',
  };

  const {url} = route.params;

  const [index, setIndex] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  //视频播放相关
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState('')
  const [videoHeight, setVideoHeight] = useState(0);
  const [loading, setLoading] = useState(true); //url是否准备好
  const curSourceIndex = useRef(0); //当前的source源
  const curSources = useRef<string[]>([]); //当前可用的源
  const videoSolved = useRef(false); //视频是否可以播放，不能使用useState

  //页面显示相关
  const [title, setTitle] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [infoSub, setInfoSub] = useState<InfoSub>(emptyInfoSub);
  const [info, setInfo] = useState('');
  const [sources, setSources] = useState<Source[]>([]); //完整的播放列表
  const [relatives, setRelatives] = useState<ListItemInfo[]>([]); //同系列列表
  const [anthologys, setAnthologys] = useState<ListItemInfo[]>([]); //选集列表
  const [recommands, setRecommands] = useState<RecommandInfo[]>([]); //同系列列表
  const [anthologyIndex, setAnthologyIndex] = useState(0);
  const [detailLineVisible, setDetailSheetVisible] = useState(false);
  const [anthologySheetVisible, setAnthologySheetVisible] = useState(false);
  const [nextVideoAvailable, setNextVideoAvailable] = useState(false);

  const ratio = 0.56; //视频长宽比例

  const agent = useRef(new Agent(url));
  useEffect(() => {
    const {height, width} = Dimensions.get('window');
    setWindowHeight(height);
    setWindowWidth(width);
    setVideoHeight(width * ratio);

    agent.current.afterLoadTitle((_title: string) => {
      setTitle(_title);
    });

    agent.current.afterLoadSources((_sources: Source[]) => {
      setSources(_sources);
      const _anthologys = _sources.map((_source, index) => {
        return {id: index, data: _source.data, title: _source.key};
      });
      setAnthologys(_anthologys);
      //切换到第一集
      setLoading(true);
      setAnthologyIndex(0); //当前播放第一集
      videoSolved.current = false;
      curSourceIndex.current = 0;
      curSources.current = _sources[0].data;
      switchVideoSrc();
    });

    agent.current.afterLoadInfoSub((_infoSub: InfoSub) => {
      setInfoSub(_infoSub);
    });

    agent.current.afterLoadInfo((_info: string) => {
      setInfo(_info);
    });

    agent.current.afterLoadImgSrc((src: string) => {
      setImgUrl(src);
    });

    agent.current.afterLoadRelatives((_relatives: ListItemInfo[]) => {
      setRelatives(_relatives);
    });

    agent.current.afterLoadRecommands((_recommands: RecommandInfo[]) => {
      setRecommands(_recommands);
    });
    agent.current.load();
  }, []);

  //切换视频选集
  const changeAnthology = (index: number) => {
    setNextVideoAvailable(index + 1 < anthologys.length);
    setAnthologyIndex(index);
    setLoading(true);
    videoSolved.current = false;
    curSourceIndex.current = 0;
    console.log(sources, index);
    curSources.current = sources[index].data;
    switchVideoSrc();
  };

  const toNextVideo = () => {
    changeAnthology(anthologyIndex + 1);
  };

  const switchVideoSrc = () => {
    //设置视频播放源
    if (curSourceIndex.current < curSources.current.length) {
      console.log(
        `尝试源: ${curSourceIndex.current + 1}/${curSources.current.length}`,
      );
      const vUrl = curSources.current[curSourceIndex.current];
      curSourceIndex.current += 1;
      agent.current.loadVideoSrc(
        vUrl,
        (state: boolean, src: string, type: string) => {
          if (videoSolved.current) return;
          console.log(state, src, type);
          if (state) {
            setVideoUrl(src);
            setVideoType(type)
            setLoading(false);
            videoSolved.current = true;
          } else {
            switchVideoSrc();
          }
        },
      );
    }
  };

  const onPressRecommand = (item: RecommandInfo) => {
    navigation.push('Video', {url: item.href});
  };

  return (
    <>
      <Player
        title={`${title} ${
          anthologys[anthologyIndex] ? anthologys[anthologyIndex].title : ''
        }`}
        onBack={() => {
          navigation.navigate('Animation');
        }}
        videoUrl={videoUrl}
        videoType={videoType}
        videoUrlAvailable={!loading}
        nextVideoAvailable={nextVideoAvailable}
        onVideoErr={switchVideoSrc}
        toNextVideo={toNextVideo}
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
                  <TitleLine
                    title={title}
                    onPress={()=>{}}
                    followed={false}
                  />
                  <DetailButtonLine
                    author={infoSub.author}
                    onPress={() => setDetailSheetVisible(true)}
                  />
                  <ListTitleLine
                    title={'选集'}
                    buttonText={infoSub?.state}
                    onPress={() => setAnthologySheetVisible(true)}
                  />
                  {relatives.length == 0 ? null : (
                    <RelaviteLine relatives={relatives} />
                  )}
                  <ListLine
                    data={anthologys}
                    onPress={changeAnthology}
                    activeIndex={anthologyIndex}
                  />
                </View>
              </>
            }
            data={recommands}
            renderItem={({item, index}) => {
              return <V1RecommandInfoItem index={index} item={item} onPress={onPressRecommand} />;
            }}
            keyExtractor={item => `${item.id}`}
          />
        </TabView.Item>
        <TabView.Item></TabView.Item>
      </TabView>

      <DetailSheet
        top={videoHeight}
        height={windowHeight - videoHeight}
        title={title}
        src={imgUrl}
        infoSub={infoSub}
        info={info}
        visible={detailLineVisible}
        onPress={() => {
          setDetailSheetVisible(false);
        }}
      />

      <AnthologySheet
        top={videoHeight}
        height={windowHeight - videoHeight}
        anthologys={anthologys}
        activeIndex={anthologyIndex}
        state={infoSub.state}
        visible={anthologySheetVisible}
        onClose={() => {
          console.log('close');
          setAnthologySheetVisible(false);
        }}
        onPress={changeAnthology}
      />
    </>
  );
};

// Later on in your styles..
var styles = StyleSheet.create({
  tabContainer: {
    width: '30%',
    marginLeft: 10,
  },
});

export default VideoPage;
