import { useNavigation, useRoute } from '@react-navigation/native';
import {Divider} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import {Agent} from '../../api/yinghuacd/IndexAgent';
import Container from '../../component/Container';
import HeadBar from '../../component/HeadBar';
import {
  V3RecommandInfoItemItem,
} from '../../component/ListItem';
import {LoadingContainer} from '../../component/Loading';
import MultiItemRow from '../../component/MultiItemRow';
import {SubTitleBold} from '../../component/Text';
import {RecommandInfo} from '../../type/RecommandInfo';
import { IndexPageProps } from '../../type/route';
import {SearchInfo} from '../../type/SearchInfo';


const IndexPage: React.FC<{}> = () => {
  const [results, setResults] = useState<SearchInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute<IndexPageProps['route']>()
  const navigation = useNavigation<IndexPageProps['navigation']>()

  const {url, title} = route.params
  
  useEffect(() => {
    const agent = new Agent();
    agent.afterSearch(_results => {
      setResults(_results);
      setLoading(false);
    });
    agent.search([url]);
    
  }, []);

  return (
    <Container>
      <HeadBar
        onPress={() => {
          navigation.navigate('Tab');
        }}>
        <SubTitleBold title={title} />
      </HeadBar>
      <LoadingContainer loading={loading}>
        <FlatList
          contentContainerStyle={{paddingHorizontal: 15}}
          ItemSeparatorComponent={() => {
            return <Divider />;
          }}
          keyExtractor={item => `${item.id}`}
          data={results}
          renderItem={({item, index}) => (
            <MultiItemRow
              numberOfItem={3}
              index={index}
              datas={results}
              children={(index, info: RecommandInfo) => (
                <V3RecommandInfoItemItem
                  index={index}
                  item={info}
                  key={index}
                  onPress={() => {
                    navigation.navigate('Video', {url: info.href});
                  }}
                />
              )}
            />
          )}
        />
      </LoadingContainer>
    </Container>
  );
};

export default IndexPage;
