import {Text} from '@rneui/themed';
import {useState} from 'react';
import {StyleSheet, View, FlatList, TouchableHighlight} from 'react-native';
import {ListItemInfo} from '../../type/ListItemInfo';

type listLineProps = {data: ListItemInfo[]; onPress?: Function};
const ListLine = ({data, onPress}: listLineProps) => {
  const [activeIndex, setActiveIndex] = useState(0); //当前活跃的块

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    itemContainer: {
      backgroundColor: 'gainsboro',
      width: 150,
      height: 75,
      marginHorizontal: 10,
      padding: 10,
    },
    text: {
      fontSize: 20,
    },
    active: {
      color: 'deeppink',
    },
  });

  const renderItem = ({item, index}: {item: ListItemInfo; index: number}) => {
    let textStyle = index === activeIndex ? styles.active : {};
    textStyle = {...textStyle, ...styles.text};
    return (
      <TouchableHighlight
        onPress={() => {
          if (onPress) onPress(item);
          setActiveIndex(index);
        }}>
        <View style={styles.itemContainer}>
          <Text style={textStyle}>{item.title}</Text>
        </View>
      </TouchableHighlight>
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
        <Text style={styles.text}>暂无数据</Text>
      </View>
    </View>
  );
};

export {ListLine};
