import {SectionList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RecommandInfo} from '../../../type/RecommandInfo';
import {ParallaxCarousel} from '../../../component/ParallaxCarousel';
import {NavBar} from '../../../component/NavBar';
import MultiItemRow from '../../../component/MultiItemRow';
import {ListTitleLine} from '../../../component/ListTitleLine';
import {FlatList} from 'react-native-gesture-handler';
import {
  H1HistoryInfoItem,
  V2RecommandInfoItem,
} from '../../../component/ListItem';
import Context from '../../../models';
import History from '../../../models/History';
import HistoryInfo from '../../../type/HistoryInfo';
import {LoadingContainer} from '../../../component/Loading';
import Anime from '../../../models/Anime';
import {useNavigation} from '@react-navigation/native';
import {AnimeHomeProps} from '../../../type/route';
import loadPage from '../../../api/yinghuacd/home';
import Toast from 'react-native-root-toast';
const {useRealm, useQuery} = Context;

const Home: React.FC<{}> = () => {
  const [carousels, setCarousels] = useState<RecommandInfo[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [historys, setHistorys] = useState<HistoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('加载中...');
  const _historys = useQuery<History>(History);
  const realm = useRealm();
  const navigation = useNavigation<AnimeHomeProps['navigation']>();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let historys = [..._historys.sorted('time', true)]
      .slice(0, 10)
      .map(_history => {
        const _animes = realm.objectForPrimaryKey(Anime, _history.href);
        return {
          href: _history.href,
          progress: _history.progress,
          progressPer: _history.progressPer,
          anthologyIndex: _history.anthologyIndex,
          anthologyTitle: _history.anthologyTitle,
          time: _history.time,
          img: _animes!.img,
          title: _animes!.title,
          state: _animes!.state,
        };
      });
    setHistorys(historys);
  }, [_historys]);

  const init = () => {
    setRefreshing(true);
    loadPage(
      ({carousels, sections, dailys}) => {
        setCarousels(carousels);
        setSections(sections);
        setLoading(false);
        setRefreshing(false);
        if (!loading) {
          Toast.show(`刷新成功`, {
            backgroundColor: 'black',
            textStyle: {fontSize: 14, color: 'white'},
            duration: 1000,
            position: -100,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
      },
      (err: string) => {
        setText(err);
      },
    );
  };

  useEffect(init, []);

  return (
    <LoadingContainer loading={loading} text={text} style={{paddingTop: '30%'}}>
      <SectionList
        refreshing={refreshing}
        onRefresh={init}
        contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 40}}
        ListHeaderComponent={
          <>
            <ParallaxCarousel carousels={carousels} />
            <NavBar />
            <ListTitleLine
              show={historys.length !== 0}
              title="最近在看"
              buttonText="更多"
              onPress={() => {
                navigation.navigate('History');
              }}
            />
            <FlatList
              horizontal
              data={historys}
              renderItem={({item, index}) => (
                <H1HistoryInfoItem
                  item={item}
                  index={index}
                  onPress={item => {
                    navigation.push('Video', {url: item.href});
                  }}
                />
              )}
            />
          </>
        }
        sections={sections}
        keyExtractor={(item, index) => item + index}
        renderItem={({index, section}) => (
          <MultiItemRow
            numberOfItem={2}
            children={(index, info) => (
              <V2RecommandInfoItem
                index={index}
                item={info}
                key={index}
                onPress={(recent: RecommandInfo) => {
                  navigation.push('Video', {url: recent.href});
                }}
              />
            )}
            index={index}
            datas={section.data}
          />
        )}
        renderSectionHeader={({section: {title, href}}) => (
          <ListTitleLine
            title={title}
            buttonText="更多"
            onPress={() => {
              navigation.navigate('Index', {url: 'japan/', title});
            }}
          />
        )}
      />
    </LoadingContainer>
  );
};

export default Home;
