import {Divider} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import {Agent} from '../../api/yinghuacd/IndexAgent';
import HeadBar from '../../component/HeadBar';
import {
  V1SearchInfoItem,
  V3RecommandInfoItemItem,
} from '../../component/ListItem';
import {LoadingContainer} from '../../component/Loading';
import MultiItemRow from '../../component/MultiItemRow';
import {InfoText, SubInfoText, SubTitleBold} from '../../component/Text';
import {ListItemInfo} from '../../type/ListItemInfo';
import {RecommandInfo} from '../../type/RecommandInfo';
import {SearchInfo} from '../../type/SearchInfo';

interface Props {
  navigation: any;
  url: string;
  title: string;
  route: any;
}

const CategoryPage: React.FC<Props> = ({navigation, route}) => {
  const [results, setResults] = useState<SearchInfo[]>([]);
  const [loading, setLoading] = useState(true);
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
    <View style={{flex: 1}}>
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
    </View>
  );
};

export default CategoryPage;
