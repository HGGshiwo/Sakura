import {Button, Text} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';

const ListTitleLine = ({title, buttonText}: any) => {
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
        containerStyle={styles.buttonContainer}>
        {buttonText}
      </Button>
    </View>
  );
};

export {ListTitleLine};
