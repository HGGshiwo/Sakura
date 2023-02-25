import {faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Pressable, StyleSheet, Text, View} from 'react-native';

interface Props {
  title: string;
  onPress: (event: any) => void;
}

const TextButton: React.FC<Props> = ({title, onPress}) => {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <FontAwesomeIcon color="gray" size={10} icon={faChevronRight} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 38,
    flexDirection: 'row',
  },
  title: {
    paddingRight: 2,
    color: 'gray',
  },
});

export {TextButton};
