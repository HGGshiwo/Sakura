import {Text} from '@rneui/themed';
import {StyleSheet, View, FlatList} from 'react-native';
import { Pressable } from 'react-native';
import {SubTitle} from '../../component/Text';
import {ListItemInfo} from '../../type/ListItemInfo';

type listLineProps = {
  data: ListItemInfo[];
  onPress?: (index: number)=>void;
  activeIndex: number;
};
const ListLine = ({data, onPress, activeIndex}: listLineProps) => {
  const renderItem = ({item, index}: {item: ListItemInfo; index: number}) => {
    return (
      <Pressable
        onPress={() => {
          if (onPress) onPress(item.id);
        }}>
        <View style={styles.itemContainer}>
          <SubTitle title={item.title} active={activeIndex === index} />
        </View>
      </Pressable>
    );
  };

  return data.length != 0 ? (
    <FlatList
      style={styles.container}
      horizontal={true}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => `${item.id}`}
    />
  ) : (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Text>暂无数据</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#e7e8e9',
    width: 150,
    height: 60,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
});
export {ListLine};
