import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import {faForwardStep} from '@fortawesome/free-solid-svg-icons';
interface Props {
  onPress: () => void;
  disabled: boolean;
}
const NextButton: React.FC<Props> = ({onPress, disabled}) => {
  return (
    <TouchableNativeFeedback onPress={onPress} disabled={disabled}>
      <FontAwesomeIcon
        style={{marginLeft: 20}}
        size={20}
        icon={faForwardStep}
        color={disabled ? 'grey' : 'white'}
      />
    </TouchableNativeFeedback>
  );
}

export {NextButton}
