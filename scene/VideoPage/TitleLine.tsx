import {faBars} from '@fortawesome/free-solid-svg-icons';
import {faHeart} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Button, Text} from '@rneui/themed';
import {Pressable, StyleSheet, View} from 'react-native';
import {Title} from '../../component/Text';

interface Props {
  title: string;
  followed: boolean;
  onPress: (followed: boolean) => void;
}

const TitleLine: React.FC<Props> = ({title, followed, onPress}) => {
  return (
    <View style={styles.container}>
      <Title style={{width: '70%'}} title={title} />
      <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed
              ? 'rgb(210, 230, 255)'
              : followed
              ? 'lightgray'
              : 'deeppink',
          },
          styles.buttonContainer,
        ]}
        onPress={() => {
          onPress(!followed);
        }}>
        {followed ? (
          <>
            <FontAwesomeIcon color="gray" size={14} icon={faBars} />
            <Text style={[styles.text, {color: 'gray'}]}>已追番</Text>
          </>
        ) : (
          <>
            <FontAwesomeIcon color="white" size={14} icon={faHeart} />
            <Text style={[styles.text, {color: 'white'}]}>追番</Text>
          </>
        )}
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    height: 28,
    width: 80,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  text: {
    // color: 'gray',
    fontSize: 14,
  },
});
export {TitleLine};
