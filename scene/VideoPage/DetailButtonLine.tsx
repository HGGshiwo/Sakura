import {Text} from '@rneui/base';
import {Button} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';
import {TextButton} from '../../component/TextButton';

type detailButtonLineProps = {
  onPress: (event: any) => void;
  author: string;
};

const DetailButtonLine = ({onPress, author}: detailButtonLineProps) => {
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      alignItems:'center',
      flexDirection: 'row',
    },
    text: {
      paddingTop: 2,
      color: 'gray',
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{author}</Text>
      <TextButton title={'详情'} onPress={onPress} />
    </View>
  );
};

export {DetailButtonLine};
