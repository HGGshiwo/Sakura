import {Button} from '@rneui/themed';
import {StyleSheet, FlatList} from 'react-native';
import {Source} from '../../type/Source';

const RelaviteLine = ({data}: any) => {
  const styles = StyleSheet.create({
    title: {
      fontSize: 18,
      color: 'black',
      fontWeight: 'normal',
    },
  });
  const renderItem = ({item}: {item: Source}) => {
    return <Button titleStyle={styles.title} type="clear" title={item.title} />;
  };
  return (
    <FlatList
      horizontal={true}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => `${item.id}`}
    />
  );
};

export {RelaviteLine};
