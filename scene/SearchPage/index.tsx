import {useEffect, useRef, useState} from 'react';
import {View, FlatList, Pressable, Text} from 'react-native';
import {SearchBar} from '../../component/SearchBar';
import {Agent} from '../../api/yinghuacd/SearchAgent';
import {} from 'react-native';
import {ListItemInfo} from '../../type/ListItemInfo';
import {InfoText} from '../../component/Text';
import {Divider} from '@rneui/themed';
interface Props {}
const SearchPage: React.FC<Props> = ({navigation}) => {
  const agent = useRef<Agent>();
  const [results, setResults] = useState<ListItemInfo[]>([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    agent.current = new Agent();
    agent.current.afterSearch(_results => {
      setResults(_results);
      setLoading(false)
    });
  }, []);

  const onChangeText = (text: string) => {
    setLoading(true)
    agent.current?.search(text);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <SearchBar loading={loading} onChangeText={onChangeText} autoFocus={true} />
      <FlatList
        ItemSeparatorComponent={() => {
          return <Divider />;
        }}
        keyExtractor={item => `${item.id}`}
        data={results}
        renderItem={({item}) => {
          return (
            <Pressable
              onPress={() => {
                navigation.navigate('Video', {url: item.data});
              }}>
              <View style={{paddingVertical: 10, paddingHorizontal: 20, width: '100%'}}>
                <InfoText
                  title={item.title}
                  style={{color: 'black'}}
                />
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          ()=><View style={{width: '100%', alignItems: 'center'}}><InfoText title='找不到结果'/></View>
        }
      />
    </View>
  );
};

export default SearchPage;
