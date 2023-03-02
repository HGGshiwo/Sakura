import {View, StyleSheet, SectionList} from 'react-native';

import React, {useEffect, useState} from 'react';
import {Agent} from '../../api/yinghuacd/HomeAgent';
import {SearchBar} from '../../component/SearchBar';
import {RecommandInfo} from '../../type/RecommandInfo';
import {ParallaxCarousel} from '../../component/ParallaxCarousel';
import {NavBar} from '../../component/NavBar';
import MultiItemRow from '../../component/MultiItemRow';
import {ListTitleLine} from '../../component/ListTitleLine';
import {FlatList} from 'react-native-gesture-handler';
import {
  H1HistoryInfoItem,
  V2RecommandInfoItemItem,
} from '../../component/ListItem';
import Context, {History} from '../../models';
import {HistoryInfo} from '../../type/HistoryInfo';
import {LoadingBox, LoadingContainer} from '../../component/Loading';
const {useRealm, useQuery} = Context;

interface Props {
  navigation: any;
}

const AnimationPage: React.FC<Props> = ({navigation}) => {
  // const realm = useRealm();
  // realm.write(()=>{
  //   realm.deleteAll()
  // })

  const [carousels, setCarousels] = useState<RecommandInfo[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [historys, setHistorys] = useState<HistoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('加载中...');
  const _historys = useQuery(History);

  useEffect(() => {
    setHistorys([..._historys.sorted('time', true)]);
  }, [_historys]);

  useEffect(() => {
    console.log('mount');
    const agent = new Agent();
    agent.afterLoad(({carousels, sections, dailys}) => {
      setCarousels(carousels);
      setSections(sections);
      setLoading(false);
    });

    agent.afterErr((err: string) => {
      setText(err);
    });

    agent.load();

    return () => {
      console.log('anime unmount');
    };
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          // paddingVertical: 15,
        }}>
        <SearchBar
          placeholder="查找关键词"
          isButton={true}
          onPress={() => {
            navigation.navigate('Search');
          }}
        />
      </View>
      <LoadingContainer
        loading={loading}
        text={text}
        style={{paddingTop: '30%'}}>
        <SectionList
          contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 40}}
          ListHeaderComponent={
            <>
              <ParallaxCarousel carousels={carousels} />
              <NavBar
                onPress={href => {
                  navigation.navigate(href, {title: '全部动漫', url: 'japan/'});
                }}
              />
              <ListTitleLine
                show={historys.length !== 0}
                title="最近在看"
                buttonText="更多"
                onPress={() => {}}
              />
              <FlatList
                horizontal
                data={historys}
                renderItem={({item, index}) => {
                  return (
                    <H1HistoryInfoItem
                      item={item}
                      index={index}
                      onPress={item => {
                        navigation.push('Video', {url: item.href});
                      }}
                    />
                  );
                }}
              />
            </>
          }
          sections={sections}
          keyExtractor={(item, index) => item + index}
          renderItem={({index, section}) => (
            <MultiItemRow
              numberOfItem={2}
              children={(index, info) => (
                <V2RecommandInfoItemItem
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
                // console.log(title, href)
                navigation.navigate('Category', {url: href, title});
              }}
            />
          )}
        />
      </LoadingContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: 'white',
  },
});

export default AnimationPage;
