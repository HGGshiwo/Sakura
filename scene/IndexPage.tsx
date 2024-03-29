import {useNavigation, useRoute} from '@react-navigation/native';
import {Divider} from '@rneui/themed';
import React, {useContext, useEffect, useState} from 'react';
import Container from '../component/Container';
import HeadBar from '../component/HeadBar';
import {V3RecmdInfoItem} from '../component/ListItem';
import {LoadingContainer} from '../component/Loading';
import {SubTitleBold} from '../component/Text';
import RecommandInfo from '../type/RecmdInfo';
import {IndexPageProps, targets} from '../route';
import {FlatGrid} from '../component/Grid';
import IndexPageInfo from '../type/PageInfo/IndexPageInf';
import useApi from '../zustand/Api';

const IndexPage: React.FC<{}> = () => {
  const [results, setResults] = useState<RecommandInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute<IndexPageProps['route']>();
  const navigation = useNavigation<IndexPageProps['navigation']>();
  const {url, title, tabName, apiName} = route.params;
  const {api} = useApi();
  
  const loadPage = api[tabName][apiName].pages.index!;
  useEffect(() => {
    loadPage(url, ({results}: IndexPageInfo) => {
      console.log(url, results);
      setResults(results);
      setLoading(false);
    });
  }, []);

  return (
    <Container>
      <HeadBar
        onPress={() => navigation.goBack()}
        style={{paddingVertical: 20}}>
        <SubTitleBold style={{marginLeft: 10}} title={title} />
      </HeadBar>
      <Divider />
      <LoadingContainer loading={loading} style={{paddingTop: '30%'}}>
        <FlatGrid
          contentContainerStyle={{paddingHorizontal: 15}}
          keyExtractor={item => item.infoUrl}
          data={results}
          numColumns={3}
          renderItem={({item, index}) => (
            <V3RecmdInfoItem
              index={index}
              item={item}
              key={index}
              onPress={() => {
                navigation.navigate('Info', {
                  infoUrl: item.infoUrl,
                  tabName,
                  apiName: item.apiName,
                });
              }}
            />
          )}
        />
      </LoadingContainer>
    </Container>
  );
};

export default IndexPage;
