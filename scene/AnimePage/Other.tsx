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
  navigate: (where: string, param?: any) => void;
  push: (where: string, param?: any) => void;
  url: string;
  title: string;
}

const Other: React.FC<Props> = ({navigate, push, url, title}) => {
  const [carousels, setCarousels] = useState<RecommandInfo[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

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
    <LoadingContainer loading={loading}>
      <SectionList
        contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 40}}
        ListHeaderComponent={
          <>
            <ParallaxCarousel carousels={carousels} />
            <NavBar
              onPress={href => {
                navigate(href, {title: '全部动漫', url: 'japan/'});
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
                  push('Video', {url: recent.href});
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
