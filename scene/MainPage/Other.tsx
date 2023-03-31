import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import loadPage from '../../api/Anime/yinghuacd/category';
import EndLine from '../../component/EndLine';
import {V3RecommandInfoItem} from '../../component/ListItem';
import {LoadingContainer} from '../../component/Loading';
import {ParallaxCarousel} from '../../component/ParallaxCarousel';
import {SubTitleBold} from '../../component/Text';
import {MainPageProps, TabName, targets} from '../../route';
import RecommandInfo from '../../type/RecommandInfo';
import {Section} from '../../type/Section';
import {SectionGrid} from '../../component/Grid';

interface Props {
  url: string;
  title: string;
  tabName: TabName;
}

const Other: React.FC<Props> = ({url, title, tabName}) => {
  const [carousels, setCarousels] = useState<RecommandInfo[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<MainPageProps['navigation']>();

  const init = () => {
    setRefreshing(true);
    loadPage(url, (carousels, sections) => {
      setCarousels(carousels);
      setSections(sections);
      setLoading(false);
      setRefreshing(false);
    });
  };

  const handlePressItem = useCallback(
    (item: RecommandInfo) =>
      navigation.navigate(targets[tabName], {
        url: item.href,
        apiName: item.apiName,
      }),
    [],
  );

  useEffect(init, []);

  return (
    <LoadingContainer loading={loading} style={{paddingTop: '30%'}}>
      <SectionGrid
        numColumns={3}
        refreshing={refreshing}
        onRefresh={init}
        contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 40}}
        ListHeaderComponent={
          <ParallaxCarousel onPress={handlePressItem} carousels={carousels} />
        }
        sections={sections}
        keyExtractor={(item, index) => item.href}
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
  );
};

export default Other;
