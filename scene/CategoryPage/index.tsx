import React, {useEffect, useState} from 'react';
import {SectionList, View} from 'react-native';
import {Agent} from '../../api/yinghuacd/CategoryAgent';
import EndLine from '../../component/EndLine';
import HeadBar from '../../component/HeadBar';
import {V3RecommandInfoItemItem} from '../../component/ListItem';
import {LoadingContainer} from '../../component/Loading';
import MultiItemRow from '../../component/MultiItemRow';
import {NavBar} from '../../component/NavBar';
import {ParallaxCarousel} from '../../component/ParallaxCarousel';
import {SearchBar} from '../../component/SearchBar';
import {SubTitleBold} from '../../component/Text';
import {RecommandInfo} from '../../type/RecommandInfo';
import {Section} from '../../type/Section';

interface Props {
  navigation: any;
  url: string;
  title: string;
  route: any;
}

const CategoryPage: React.FC<Props> = ({navigation, route}) => {
  const [carousels, setCarousels] = useState<RecommandInfo[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  const [loading, setLoading] = useState(true);
  const {url, title} = route.params;

  useEffect(() => {
    const agent = new Agent();
    agent.afterLoad(({carousels, sections}) => {
      setCarousels(carousels);
      setSections(sections);
      setLoading(false);
    });
    agent.load(url);
  }, []);

  return (
    <View style={{flex: 1}}>
      <HeadBar
        onPress={() => {
          navigation.navigate('Tab');
        }}>
        <View style={{flexDirection: 'row', width:'100%', justifyContent: 'space-between', alignItems:'center'}}>
          <SubTitleBold style={{color: 'grey'}} title={title} />
          <SearchBar style={{width: 200}} />
        </View>
      </HeadBar>
      <LoadingContainer loading={loading}>
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
            </>
          }
          sections={sections}
          keyExtractor={(item, index) => item.title + index}
          renderItem={({index, section}) => (
            <MultiItemRow
              numberOfItem={3}
              children={(index, info) => (
                <V3RecommandInfoItemItem
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
          renderSectionHeader={({section: {title}}) => (
            <SubTitleBold title={title} />
          )}
          ListFooterComponent={<EndLine />}
        />
      </LoadingContainer>
    </View>
  );
};

export default CategoryPage;
