import {useNavigation} from '@react-navigation/native';
import {Divider} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import loadPage from '../api/Anime/yinghuacd/rank';
import Container from '../component/Container';
import EndLine from '../component/EndLine';
import HeadBar from '../component/HeadBar';
import {V1RecommandInfoItem} from '../component/ListItem';
import {LoadingContainer} from '../component/Loading';
import {RateText, SubTitleBold} from '../component/Text';
import {RecommandInfo} from '../type/RecommandInfo';
import {NoParamProps} from '../type/route';

const RankingPage: React.FC<{}> = () => {
  const [rankings, setRankings] = useState<RecommandInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NoParamProps['navigation']>();

  useEffect(() => {
    loadPage((rankings) => {
      setRankings(rankings);
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
        <SubTitleBold style={{marginLeft: 10}} title="排行榜" />
      </HeadBar>
      <Divider />
      <LoadingContainer loading={loading} style={{paddingTop: '30%'}}>
        <FlatList
          contentContainerStyle={{paddingHorizontal: 15}}
          keyExtractor={item => item.href}
          data={rankings}
          ItemSeparatorComponent={()=><Divider />}
          ListFooterComponent={()=><EndLine />}
          renderItem={({item, index}) => (
            <V1RecommandInfoItem
              index={index}
              item={item}
              key={index}
              imgVerticle={true}
              onPress={() => {
                navigation.navigate('Video', {url: item.href});
              }}>
              <RateText title='9.7'/>
            </V1RecommandInfoItem>
          )}
        />
      </LoadingContainer>
    </Container>
  );
};

export default RankingPage;
