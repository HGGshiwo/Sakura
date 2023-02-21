import {Text, Image} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';

const RecommandLine = ({item}: any) => {
  const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      height: 200,
      width: '100%',
    },
    image: {
      flex: 2,
    },
    infoContainer: {
      flex: 3,
    },
    rateContainer: {
      flex: 1,
    },
  });
  return (
    <View style={styles.itemContainer}>
      <Image containerStyle={styles.image} source={{uri: item.src}} />
      <View style={styles.infoContainer}>
        <Text>{item.title}</Text>
        <Text>{item.detail}</Text>
      </View>
      <View style={styles.rateContainer}>
        <View>
          <Text>9.7分</Text>
        </View>
      </View>
    </View>
  );
};

export {RecommandLine};
