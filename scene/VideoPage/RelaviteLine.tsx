import {Button} from '@rneui/themed';
import {StyleSheet, FlatList} from 'react-native';
import {ListItemInfo} from '../../type/ListItemInfo';

type relaviteLineProps = {
  relatives :ListItemInfo[]
}

const RelaviteLine = ({relatives}: relaviteLineProps) => {
  const styles = StyleSheet.create({
    title: {
      fontSize: 18,
      color: 'black',
      fontWeight: 'normal',
    },
  });
  const renderItem = ({item}: {item: ListItemInfo}) => {
    return <Button titleStyle={styles.title} type="clear" title={item.title} />;
  };
  return (
    <FlatList
      horizontal={true}
      data={relatives}
      renderItem={renderItem}
      keyExtractor={item => `${item.id}`}
    />
  );
};

export {RelaviteLine};
