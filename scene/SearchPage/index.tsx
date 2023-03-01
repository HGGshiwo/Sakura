import {useEffect, useRef, useState} from 'react';
import {View, FlatList, Pressable, Text} from 'react-native';
import {SearchBar} from '../../component/SearchBar';
import {Agent} from '../../api/yinghuacd/SearchAgent';
import {Image} from 'react-native';
import {InfoText, SubTitle} from '../../component/Text';
import {Divider} from '@rneui/themed';
import {SearchInfo} from '../../type/SearchInfo';
import {BackButton, FollowButton, RoundButton} from '../../component/Button';
import {StyleSheet} from 'react-native';
import {V1SearchInfoItem} from '../../component/ListItem';

interface Props {}
const SearchPage: React.FC<Props> = ({navigation}) => {
  const agent = useRef<Agent>();
  const [results, setResults] = useState<SearchInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    agent.current = new Agent();
    agent.current.afterSearch(_results => {
      setResults(_results);
      setLoading(false);
    });
  }, []);

  const onChangeText = (text: string) => {
    setLoading(true);
    agent.current?.search(text);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <BackButton
          color="grey"
          onPress={() => {
            navigation.navigate('Animation');
          }}
        />
        <SearchBar
          style={{marginLeft: 10}}
          loading={loading}
          onChangeText={onChangeText}
          autoFocus={true}
        />
      </View>

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
    </View>
  );
};

export default SearchPage;
