import { Text } from '@rneui/base';
import {Button} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';

type detailButtonLineProps = {
  onPress: (event: any) => void;
  author: string;
};

const DetailButtonLine = ({onPress, author}: detailButtonLineProps) => {
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    buttonContainer: {
      height: 38,
    },
    buttonTitle: {
      color: 'gray',
    },
    text: {
      paddingTop:2,
      color: 'gray',
      fontSize: 16
    }
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {author}
      </Text>
      <Button
        type="clear"
        containerStyle={styles.buttonContainer}
        titleStyle={styles.buttonTitle}
        onPress={onPress}>
        {'详情 >'}
      </Button>
    </View>
  );
};

export {DetailButtonLine};
