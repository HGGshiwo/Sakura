import {StyleSheet, View} from 'react-native';
import { SubTitleBold } from './Text';
import {TextButton} from './TextButton';

type listTitleLineProps = {
  title: string;
  buttonText: string;
  onPress: (event: any) => void;
};

const ListTitleLine = ({title, buttonText, onPress}: listTitleLineProps) => {
  return (
    <View style={styles.container}>
      <SubTitleBold title={title}/>
      <TextButton onPress={onPress} title={buttonText} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonContainer: {
    height: 38,
    paddingLeft: 50,
  },
  buttonTitle: {
    color: 'gray',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export {ListTitleLine};
