import {StyleSheet, View} from 'react-native';
import {SubTitleBold} from './Text';
import {TextButton} from './Button';

type listTitleLineProps = {
  title: string;
  buttonText: string;
  onPress: (event: any) => void;
  show?: boolean;
};

const ListTitleLine = ({
  title,
  buttonText,
  onPress,
  show = true,
}: listTitleLineProps) => {
  return (
    <View style={[styles.container, {display: show ? 'flex' : 'none'}]}>
      <SubTitleBold title={title} />
      <TextButton onPress={onPress} title={buttonText} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
