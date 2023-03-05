import {useNavigation, useRoute} from '@react-navigation/native';
import {Divider} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import loadPage from '../../api/yinghuacd/home';
import Container from '../../component/Container';
import HeadBar from '../../component/HeadBar';
import {V3RecommandInfoItem} from '../../component/ListItem';
import {LoadingContainer} from '../../component/Loading';
import MultiItemRow from '../../component/MultiItemRow';
import {SubTitleBold} from '../../component/Text';
import {RecommandInfo} from '../../type/RecommandInfo';
import {NoParamProps} from '../../type/route';
import {SearchInfo} from '../../type/SearchInfo';

const RankingPage: React.FC<{}> = () => {
  const [rankings, setRankings] = useState<RecommandInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute<NoParamProps['route']>();
  const navigation = useNavigation<NoParamProps['navigation']>();


  useEffect(() => {
    loadPage(({rankings}) => {
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
        <SubTitleBold title='排行榜' />
      </HeadBar>
      <Divider />
      <LoadingContainer loading={loading}>
        <FlatList
          contentContainerStyle={{paddingHorizontal: 15}}
          keyExtractor={item => item.href}
          data={rankings}
          renderItem={({item, index}) => (
            <MultiItemRow
              numberOfItem={3}
              index={index}
              datas={rankings}
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

export default RankingPage;
