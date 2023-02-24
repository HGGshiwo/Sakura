import {Button, Text} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';

const TitleLine = ({title}: any) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    text: {
      width: '70%',
      overflow: 'hidden'
    },
    button: {
      borderRadius: 20,
      paddingHorizontal: 20,
    },
    buttonContainer: {
      height: 38,
    },
    buttonDone: {
      backgroundColor: 'lightgray',
      color: 'gray',
    },
  });
  return (
    <View style={styles.container}>
      <Text h4 style={styles.text}>
        {title}
      </Text>
      <Button
        size="sm"
        buttonStyle={{...styles.button, ...styles.buttonDone}}
        titleStyle={{...styles.buttonDone}}
        containerStyle={styles.buttonContainer}>
        {/* <Icon name='menu-outline'/> */}
        已追番
      </Button>
    </View>
  );
};

export {TitleLine};
