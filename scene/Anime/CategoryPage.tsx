import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SectionList, View} from 'react-native';
import loadPage from '../../api/yinghuacd/category';
import Container from '../../component/Container';
import EndLine from '../../component/EndLine';
import HeadBar from '../../component/HeadBar';
import {V3RecommandInfoItem} from '../../component/ListItem';
import {LoadingContainer} from '../../component/Loading';
import MultiItemRow from '../../component/MultiItemRow';
import {NavBar} from '../../component/NavBar';
import {ParallaxCarousel} from '../../component/ParallaxCarousel';
import {SearchBar} from '../../component/SearchBar';
import {SubTitleBold} from '../../component/Text';
import {RecommandInfo} from '../../type/RecommandInfo';
import {CategoryPageProps} from '../../type/route';
import {Section} from '../../type/Section';

const CategoryPage: React.FC<{}> = () => {
  const [carousels, setCarousels] = useState<RecommandInfo[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const route = useRoute<CategoryPageProps['route']>();
  const navigation = useNavigation<CategoryPageProps['navigation']>();
  const [loading, setLoading] = useState(true);
  const {url, title} = route.params;

  useEffect(() => {
    loadPage(url, (carousels, sections) => {
      setCarousels(carousels);
      setSections(sections);
      setLoading(false);
    });
  }, []);

  return (
    <Container>
      <HeadBar
        onPress={() => {
          navigation.navigate('Tab');
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
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
              <NavBar />
            </>
          }
          sections={sections}
          keyExtractor={(item, index) => item.title + index}
          renderItem={({index, section}) => (
            <MultiItemRow
              numberOfItem={3}
              children={(index, info) => (
                <V3RecommandInfoItem
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
    </Container>
  );
};

export default CategoryPage;
