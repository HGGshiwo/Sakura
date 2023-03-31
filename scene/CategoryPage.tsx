import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import loadPage from '../api/Anime/yinghuacd/category';
import Container from '../component/Container';
import EndLine from '../component/EndLine';
import HeadBar from '../component/HeadBar';
import {V3RecommandInfoItem} from '../component/ListItem';
import {LoadingContainer} from '../component/Loading';
import {NavBar} from '../component/NavBar';
import {ParallaxCarousel} from '../component/ParallaxCarousel';
import {SearchBar} from '../component/SearchBar';
import {SubTitleBold} from '../component/Text';
import RecommandInfo from '../type/RecommandInfo';
import {CategoryPageProps, targets} from '../route';
import {Section} from '../type/Section';
import {SectionGrid} from '../component/Grid';

const CategoryPage: React.FC<{}> = () => {
  const [carousels, setCarousels] = useState<RecommandInfo[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const route = useRoute<CategoryPageProps['route']>();
  const navigation = useNavigation<CategoryPageProps['navigation']>();
  const [loading, setLoading] = useState(true);
  const {url, title, tabName} = route.params;

  useEffect(() => {
    loadPage(url, (carousels, sections) => {
      setCarousels(carousels);
      setSections(sections);
      setLoading(false);
    });
  }, []);

  const handlePressItem = useCallback(
    (item: RecommandInfo) =>
      navigation.navigate(targets[tabName], {
        url: item.href,
        apiName: item.apiName,
      }),
    [],
  );

  return (
    <Container>
      <HeadBar onPress={() => navigation.goBack()}>
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
        <SectionGrid
          contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 40}}
          ListHeaderComponent={
            <>
              <ParallaxCarousel
                onPress={handlePressItem}
                carousels={carousels}
              />
              <NavBar />
            </>
          }
          numColumns={3}
          sections={sections}
          keyExtractor={(item, index) => item.title + index}
          renderItem={({index, item}) => (
            <V3RecommandInfoItem
              index={index}
              item={item}
              key={index}
              onPress={handlePressItem}
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
