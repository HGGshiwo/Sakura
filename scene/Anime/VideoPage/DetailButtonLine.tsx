import {Text} from '@rneui/base';
import {StyleSheet, View} from 'react-native';
import {TextButton} from '../../../component/Button';
import {InfoText} from '../../../component/Text';

type detailButtonLineProps = {
  onPress: (event: any) => void;
  author: string;
};

const DetailButtonLine = ({onPress, author}: detailButtonLineProps) => {
  return (
    <View style={styles.container}>
      <InfoText style={styles.text} title={author} />
      <TextButton title={'详情'} onPress={onPress} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    paddingTop: 2,
    color: 'gray',
    flex: 1,
  },
});
export {DetailButtonLine};
