import {Divider} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import {V1SearchInfoItem} from '../../component/ListItem';
import { LoadingContainer } from '../../component/Loading';
import {InfoText} from '../../component/Text';
import {ListItemInfo} from '../../type/ListItemInfo';

interface Props {
  navigation: any;
}

// 地区:日本大陆美国英国韩国   语言:日语国语粤语英语韩语方言

// 类型:热血格斗恋爱校园搞笑LOLI神魔机战科幻真人青春魔法美少女神话冒险运动竞技童话励志后宫战争吸血鬼

const IndexPage: React.FC<Props> = ({navigation}) => {
  const [args, setArgs] = useState<{title: string; data: ListItemInfo[]}[]>([]);

  useEffect(() => {
    const letters = Array(26).map((_, index) => {
      const letter = String.fromCharCode(97 + index);
      return {
        data: letter,
        id: index,
        title: letter,
      };
    });
    const years = Array(10).map((_, index) => {
      const year = (2014+index).toString();
      return {
        data: year,
        id: year,
        title: year,
      };

    });

    const _args = [
      {title: '字母', data: letters},
      {title: '年份', data: years},
      {title: '地区', data: [
        {title: '日本', id: 0, data: 'japan'},
        {title: '大陆', id: 1, data: 'china'},
        {title: '美国', id: 2, data: 'american'},
        {title: '英国', id: 3, data:  'england'},
        {title: '韩国', id: 4, data: 'korea'},
      ]},
      {title: '语言', data: [
        {title: '日语', }
      ]}
    ];
  }, []);

  return (
    <LoadingContainer loading={loading}>
      <View></View>
      <FlatList
        contentContainerStyle={{paddingHorizontal: 15}}
        ItemSeparatorComponent={() => {
          return <Divider />;
        }}
        keyExtractor={item => `${item.id}`}
        data={results}
        renderItem={({item, index}) => {
          return (
            <V1SearchInfoItem
              item={item}
              index={index}
              onPress={() => {
                navigation.navigate('Video', {url: item.href});
              }}
            />
          );
        }}
        ListEmptyComponent={() => (
          <View style={{width: '100%', alignItems: 'center'}}>
            <InfoText title="找不到结果" />
          </View>
        )}
      />
    </LoadingContainer>
  );
};

export {IndexPage};
