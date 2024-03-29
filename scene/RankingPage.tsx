import {useNavigation, useRoute} from '@react-navigation/native';
import {Divider} from '@rneui/themed';
import React, {useContext, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import Container from '../component/Container';
import EndLine from '../component/EndLine';
import HeadBar from '../component/HeadBar';
import {V1RecmdInfoItem} from '../component/ListItem';
import {LoadingContainer} from '../component/Loading';
import {RateText, SubTitleBold} from '../component/Text';
import RecommandInfo from '../type/RecmdInfo';
import {RankingPageProps, targets} from '../route';
import RankingPageInfo from '../type/PageInfo/RankingPageInfo';
import useApi from '../zustand/Api';

const RankingPage: React.FC<{}> = () => {
  const route = useRoute<RankingPageProps['route']>();
  const {tabName, apiName} = route.params;
  const [rankings, setRankings] = useState<RecommandInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<RankingPageProps['navigation']>();

  const {api} = useApi();

  useEffect(() => {
    const loadPage = api[tabName][apiName].pages.rank;
    loadPage(({rankings}: RankingPageInfo) => {
      setRankings(rankings);
      setLoading(false);
    });
  }, []);

  return (
    <Container>
      <HeadBar
        onPress={() => navigation.goBack()}
        style={{paddingVertical: 20}}>
        <SubTitleBold style={{marginLeft: 10}} title="排行榜" />
      </HeadBar>
      <Divider />
      <LoadingContainer loading={loading} style={{paddingTop: '30%'}}>
        <FlatList
          contentContainerStyle={{paddingHorizontal: 15}}
          keyExtractor={item => item.infoUrl}
          data={rankings}
          ItemSeparatorComponent={() => <Divider />}
          ListFooterComponent={() => <EndLine />}
          renderItem={({item, index}) => (
            <V1RecmdInfoItem
              index={index}
              item={item}
              key={index}
              imgVerticle={true}
              onPress={() => {
                navigation.navigate('Info', {
                  infoUrl: item.infoUrl,
                  apiName: item.apiName,
                  tabName,
                });
              }}>
              <RateText title="9.7" />
            </V1RecmdInfoItem>
          )}
        />
      </LoadingContainer>
    </Container>
  );
};

export default RankingPage;
