import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faForwardStep} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Pressable } from 'react-native';
interface Props {
  onPress: () => void;
  disabled: boolean;
}
const NextButton: React.FC<Props> = ({onPress, disabled}) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <FontAwesomeIcon
        style={{marginLeft: 20}}
        size={20}
        icon={faForwardStep}
        color={disabled ? 'grey' : 'white'}
      />
    </Pressable>
  );
}

export {NextButton}
