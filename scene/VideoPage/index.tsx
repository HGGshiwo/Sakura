import {Tab, TabView} from '@rneui/themed';
import {useState, useEffect} from 'react';
import {StyleSheet, Dimensions, View, FlatList, StatusBar} from 'react-native';
import {Agent} from '../../api/yhdm';
import {ListItemInfo} from '../../type/ListItemInfo';
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
import { RecommandInfo } from '../../type/RecommandInfo';

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
  const [imgUrl, setImgUrl] = useState('');

  const [ainfoSub, setAinfoSub] = useState<InfoSub>(emptyInfoSub);
  const [ainfo, setAinfo] = useState('');
  const [aplayList, setAplayList] = useState<PlayList>(); //完整的播放列表
  const [arelatives, setArelatives] = useState<ListItemInfo[]>([]); //同系列列表
  const [anthologys, setAnthologys] = useState<ListItemInfo[]>([]); //选集列表
  const [arecommands, setArecommands] = useState<RecommandInfo[]>([]); //同系列列表

  const [detailLineVisible, setDetailSheetVisible] = useState(false);
  const [anthologySheetVisible, setAnthologySheetVisible] = useState(false);
  const ratio = 0.56; //视频长宽比例


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
      setAnthologys(
        Object.keys(playList).map((key, index) => {
          return {title:key, id:index, data:key};
        }),
      );
    });

    agent.afterLoadInfoSub((infoSub: InfoSub) => {
      setAinfoSub(infoSub);
    });

    agent.afterLoadInfo((info: string) => {
      setAinfo(info);
    });

    agent.afterLoadImgSrc((src: string) => {
      setImgUrl(src);
    });

    agent.afterLoadRelatives((relatives: ListItemInfo[])=>{
      setArelatives(relatives)
    })

    agent.afterLoadRecommands((recommands: RecommandInfo[])=>{
      setArecommands(recommands)
    })

    agent.loadVideoSrc('https://m.yhdmp.net/vp/22598-1-0.html', (state: boolean, src: string)=>{
      if(state) {
        console.log(src)
        setVideoUrl(src)
        setLoading(false)
      }
    })

    agent.load();
  }, []);

  // Later on in your styles..
  var styles = StyleSheet.create({
    tabContainer: {
      width: '30%',
      marginLeft: 10,
    },
  });

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
                    title={'选集'}
                    buttonText={`${ainfoSub?.state} >`}
                    onPress={() => setAnthologySheetVisible(true)}
                  />
                  {arelatives.length == 0 ? null : (
                    <RelaviteLine relatives={arelatives} />
                  )}
                  <ListLine data={anthologys} />
                </View>
              </>
            }
            data={arecommands}
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
        height={windowHeight - videoHeight - StatusBar.currentHeight!}
        anthologys={anthologys}
        state={ainfoSub.state}
        visible={anthologySheetVisible}
        onPress={() => {
          setAnthologySheetVisible(false);
        }}
      />
    </>
  );
};

export default VideoPage;
