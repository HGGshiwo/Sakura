import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SectionList} from 'react-native';
import loadPage from '../../../api/yinghuacd/category';
import EndLine from '../../../component/EndLine';
import {V3RecommandInfoItemItem} from '../../../component/ListItem';
import {LoadingContainer} from '../../../component/Loading';
import MultiItemRow from '../../../component/MultiItemRow';
import {NavBar} from '../../../component/NavBar';
import {ParallaxCarousel} from '../../../component/ParallaxCarousel';
import {SubTitleBold} from '../../../component/Text';
import {RecommandInfo} from '../../../type/RecommandInfo';
import {AnimeOtherProps} from '../../../type/route';
import {Section} from '../../../type/Section';

interface Props {
  url: string;
  title: string;
}

const Other: React.FC<Props> = ({url, title}) => {
  const [carousels, setCarousels] = useState<RecommandInfo[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<AnimeOtherProps['navigation']>();

  useEffect(() => {
    loadPage(url, ({carousels, sections}) => {
      setCarousels(carousels);
      setSections(sections);
      setLoading(false);
    });
  }, []);

  return (
    <LoadingContainer loading={loading} style={{paddingTop: '30%'}}>
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
  );
};

export default Other;
