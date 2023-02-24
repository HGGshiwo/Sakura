import {Text, Image, Divider} from '@rneui/themed';
import {StyleSheet, View, Pressable} from 'react-native';
import {RecommandInfo} from '../../type/RecommandInfo';

type recommandLineProps = {
  item: RecommandInfo;
  onPress: (item: RecommandInfo)=>void;
};

const RecommandLine = ({item, onPress}: recommandLineProps) => {
  const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      width: '100%',
    },
    image: {
      flex: 3,
      height: 100,
      margin: 5,
      borderRadius: 10,
    },
    infoContainer: {
      justifyContent: 'space-between',
      flex: 3,
      padding: 10,
    },
    rateContainer: {
      flex: 1,
      padding: 10,
    },
    text: {
      fontSize: 18,
    },
    text2: {
      fontSize: 16,
      color: 'grey',
    },
    rateTitle: {
      color: 'orange',
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
  return (
    <>
      <Divider></Divider>
      <Pressable onPress={()=>{onPress(item)}}>
      <View style={styles.itemContainer}>
        <Image containerStyle={styles.image} source={{uri: item.img}} />
        <View style={styles.infoContainer}>
          <Text style={styles.text}>{item.title}</Text>
          <Text>{item.state}</Text>
        </View>
        <View style={styles.rateContainer}>
          <Text style={styles.rateTitle}>9.7分</Text>
        </View>
      </View>
      </Pressable>
    </>
  );
};

export {RecommandLine};
