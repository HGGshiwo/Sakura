import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {ViewStyle, Pressable} from 'react-native';

interface Props {
  onPress: () => void;
  style?: ViewStyle;
}

const CloseButton: React.FC<Props> = ({onPress, style}) => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={{bottom: 10, top: 10, left: 10, right: 10}}>
      <FontAwesomeIcon style={style} icon={faXmark} />
    </Pressable>
  );
};

export {CloseButton};
