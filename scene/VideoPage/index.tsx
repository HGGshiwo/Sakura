import {Tab, TabView} from '@rneui/themed';
import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, View, FlatList, StatusBar} from 'react-native';
import {Agent} from '../../api/yinghuacd/VideoAgent';
import {ListItemInfo} from '../../type/ListItemInfo';
import {PlayList} from '../../type/PlayList';
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

interface Props {
  route: any;
  navigation: any;
}

const VideoPage: React.FC<Props> = ({route, navigation}) => {
  const emptyInfoSub = {
    author: '未知',
    alias: [],
    state: '',
    time: '',
    type: [],
    produce: '',
  };

  const {url} = route.params;
  console.log(666, url);

  const [index, setIndex] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  //视频播放相关
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState('');
  const [videoHeight, setVideoHeight] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);
  const [loading, setLoading] = useState(true); //url是否准备好
  const curSourceIndex = useRef(0); //当前的source源
  const curSources = useRef<string[]>([]); //当前可用的源
  const videoSolved = useRef(false); //视频是否可以播放，不能使用useState

  //页面显示相关
  const [atitle, setAtitle] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [ainfoSub, setAinfoSub] = useState<InfoSub>(emptyInfoSub);
  const [ainfo, setAinfo] = useState('');
  const [aplayList, setAplayList] = useState<PlayList>(); //完整的播放列表
  const [arelatives, setArelatives] = useState<ListItemInfo[]>([]); //同系列列表
  const [anthologys, setAnthologys] = useState<ListItemInfo[]>([]); //选集列表
  const [arecommands, setArecommands] = useState<RecommandInfo[]>([]); //同系列列表
  const [followed, setFollowed] = useState(false); //是否是追番
  const [anthologyIndex, setAnthologyIndex] = useState(0);
  const [detailLineVisible, setDetailSheetVisible] = useState(false);
  const [anthologySheetVisible, setAnthologySheetVisible] = useState(false);
  const ratio = 0.56; //视频长宽比例

  const agent = useRef(new Agent(url));
  useEffect(() => {
    const {height, width} = Dimensions.get('window');
    setWindowHeight(height);
    setWindowWidth(width);
    setVideoWidth(width);
    setVideoHeight(width * ratio);

    agent.current.afterLoadTitle((title: string) => {
      console.log(title);
      setAtitle(title);
    });

    agent.current.afterLoadPlayList((playList: PlayList) => {
      console.log(777);
      setAplayList(playList);
      setAnthologys(
        Object.keys(playList)
          .sort()
          .map((key, index) => {
            return {title: key, id: index, data: key};
          }),
      );
      //切换到第一集
      let data = Object.keys(playList).sort()[0];

      setLoading(true);
      setAnthologyIndex(0); //当前播放第一集
      videoSolved.current = false;
      curSourceIndex.current = 0;
      curSources.current = playList[data as keyof PlayList];
      switchVideoSrc();
    });

    agent.current.afterLoadInfoSub((infoSub: InfoSub) => {
      setAinfoSub(infoSub);
    });

    agent.current.afterLoadInfo((info: string) => {
      setAinfo(info);
    });

    agent.current.afterLoadImgSrc((src: string) => {
      setImgUrl(src);
    });

    agent.current.afterLoadRelatives((relatives: ListItemInfo[]) => {
      setArelatives(relatives);
    });

    agent.current.afterLoadRecommands((recommands: RecommandInfo[]) => {
      setArecommands(recommands);
    });
    agent.current.load();
  }, []);

  //切换视频选集
  const changeAnthology = (item: ListItemInfo) => {
    setAnthologyIndex(item.id);
    setLoading(true);
    videoSolved.current = false;
    curSourceIndex.current = 0;
    curSources.current = aplayList![item.data as keyof PlayList];
    switchVideoSrc();
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
            setVideoType(type);
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
    navigation.push('video', {url: item.href});
  };

  return (
    <>
      <Player
        videoHeight={videoHeight}
        videoWidth={videoWidth}
        videoUrl={videoUrl}
        videoType={videoType}
        videoUrlAvaliable={!loading}
        onVideoErr={switchVideoSrc}
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
                    title={atitle}
                    onPress={setFollowed}
                    followed={followed}
                  />
                  <DetailButtonLine
                    author={ainfoSub.author}
                    onPress={() => setDetailSheetVisible(true)}
                  />
                  <ListTitleLine
                    title={'选集'}
                    buttonText={ainfoSub?.state}
                    onPress={() => setAnthologySheetVisible(true)}
                  />
                  {arelatives.length == 0 ? null : (
                    <RelaviteLine relatives={arelatives} />
                  )}
                  <ListLine
                    data={anthologys}
                    onPress={changeAnthology}
                    activeIndex={anthologyIndex}
                  />
                </View>
              </>
            }
            data={arecommands}
            renderItem={({item}) => {
              return <RecommandLine item={item} onPress={onPressRecommand} />;
            }}
            keyExtractor={item => `${item.id}`}
          />
        </TabView.Item>
        <TabView.Item></TabView.Item>
      </TabView>

      <DetailSheet
        top={videoHeight}
        height={windowHeight - videoHeight}
        title={atitle}
        src={imgUrl}
        infoSub={ainfoSub}
        info={ainfo}
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
        state={ainfoSub.state}
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
