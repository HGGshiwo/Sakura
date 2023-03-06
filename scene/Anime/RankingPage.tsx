import {
  fa0,
  fa1,
  fa2,
  fa3,
  fa4,
  fa5,
  fa6,
  fa7,
  fa8,
  fa9,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Divider} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import loadPage from '../../api/yinghuacd/home';
import Container from '../../component/Container';
import EndLine from '../../component/EndLine';
import HeadBar from '../../component/HeadBar';
import {V1RecommandInfoItem} from '../../component/ListItem';
import {LoadingContainer} from '../../component/Loading';
import {SubTitleBold} from '../../component/Text';
import {RecommandInfo} from '../../type/RecommandInfo';
import {NoParamProps} from '../../type/route';

const RankingPage: React.FC<{}> = () => {
  const [rankings, setRankings] = useState<RecommandInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NoParamProps['navigation']>();

  useEffect(() => {
    loadPage(({rankings}) => {
      setRankings(rankings);
      setLoading(false);
    });
  }, []);

  const icons = [fa0, fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, fa9];

  return (
    <Container>
      <HeadBar
        onPress={() => {
          navigation.navigate('Tab');
        }}
        style={{paddingVertical: 20}}>
        <SubTitleBold title="排行榜" />
      </HeadBar>
      <Divider />
      <LoadingContainer loading={loading}>
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
              <View
                style={{
                  width: 20,
                  height: 30,
                  backgroundColor:
                    index === 0
                      ? 'gold'
                      : index === 1
                      ? 'grey'
                      : index === 2
                      ? 'brown'
                      : 'lightgrey',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottomLeftRadius: 100,
                  borderBottomRightRadius: 100,
                }}>
                <FontAwesomeIcon color="white" icon={icons[index]} />
              </View>
            </V1RecommandInfoItem>
          )}
        />
      </LoadingContainer>
    </Container>
  );
};

export default RankingPage;
