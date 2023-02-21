import {Button, Text} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';

type listTitleLineProps = {
  title: string;
  buttonText: string;
  onPress: (event: any) => void;
};

const ListTitleLine = ({title, buttonText, onPress}: listTitleLineProps) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
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
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <Button
        type="clear"
        titleStyle={styles.buttonTitle}
        containerStyle={styles.buttonContainer}
        onPress={onPress}
        title={buttonText}
      />
    </View>
  );
};

export {ListTitleLine};
