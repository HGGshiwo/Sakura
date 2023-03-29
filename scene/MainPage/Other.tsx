import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SectionList} from 'react-native';
import loadPage from '../../api/Anime/yinghuacd/category';
import EndLine from '../../component/EndLine';
import {V3RecommandInfoItem} from '../../component/ListItem';
import {LoadingContainer} from '../../component/Loading';
import MultiItemRow from '../../component/MultiItemRow';
import {ParallaxCarousel} from '../../component/ParallaxCarousel';
import {SubTitleBold} from '../../component/Text';
import {MainPageProps, TabName, targets} from '../../route';
import RecommandInfo from '../../type/RecommandInfo';
import {Section} from '../../type/Section';

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

  useEffect(init, []);

  return (
    <LoadingContainer loading={loading} style={{paddingTop: '30%'}}>
      <SectionList
        refreshing={refreshing}
        onRefresh={init}
        contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 40}}
        ListHeaderComponent={
          <ParallaxCarousel
            onPress={item =>
              navigation.navigate(targets[tabName], {
                url: item.href,
                apiName: item.apiName,
              })
            }
            carousels={carousels}
          />
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
                  navigation.push('Video', {
                    url: recent.href,
                    apiName: recent.apiName,
                  });
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
  );
};

export default Other;
