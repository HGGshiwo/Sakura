import {Button} from '@rneui/themed';
import {StyleSheet, FlatList} from 'react-native';
import { TextButton } from '../../../component/Button';
import {ListItemInfo} from '../../../type/ListItemInfo';

type relaviteLineProps = {
  relatives: ListItemInfo[];
};

const RelaviteLine = ({relatives}: relaviteLineProps) => {
  return (
    <FlatList
      horizontal={true}
      data={relatives}
      renderItem={({item})=><TextButton title={item.title} />}
      keyExtractor={item => `${item.id}`}
    />
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'normal',
  },
});
export {RelaviteLine};
