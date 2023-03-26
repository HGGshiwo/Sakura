import {useNavigation, useRoute} from '@react-navigation/native';
import {Divider} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import loadPage from '../api/yinghuacd/index';
import Container from '../component/Container';
import HeadBar from '../component/HeadBar';
import {V3RecommandInfoItem} from '../component/ListItem';
import {LoadingContainer} from '../component/Loading';
import MultiItemRow from '../component/MultiItemRow';
import {SubTitleBold} from '../component/Text';
import {RecommandInfo} from '../type/RecommandInfo';
import {IndexPageProps} from '../type/route';

const IndexPage: React.FC<{}> = () => {
  const [results, setResults] = useState<RecommandInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute<IndexPageProps['route']>();
  const navigation = useNavigation<IndexPageProps['navigation']>();

  const {url, title} = route.params;

  useEffect(() => {
    loadPage(url, _results => {
      setResults(_results);
      setLoading(false);
    });
  }, []);

  return (
    <Container>
      <HeadBar
        onPress={() => {
          navigation.navigate('Tab');
        }}
        style={{paddingVertical: 20}}>
        <SubTitleBold style={{marginLeft: 10}} title={title} />
      </HeadBar>
      <Divider />
      <LoadingContainer loading={loading} style={{paddingTop: '30%'}}>
        <FlatList
          contentContainerStyle={{paddingHorizontal: 15}}
          keyExtractor={item => item.href}
          data={results}
          renderItem={({item, index}) => (
            <MultiItemRow
              numberOfItem={3}
              index={index}
              datas={results}
              children={(index, info: RecommandInfo) => (
                <V3RecommandInfoItem
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
