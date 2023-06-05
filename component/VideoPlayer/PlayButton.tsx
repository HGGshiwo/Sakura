import {faPlay, faPause} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {Pressable} from 'react-native';

interface Props {
    onPress: ()=>void;
    paused: boolean;
}

const PlayButton:React.FC<Props> = ({onPress, paused}) => {
    return (
      <Pressable
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPress={onPress}>
        <FontAwesomeIcon
          color="white"
          size={24}
          icon={paused ? faPlay : faPause}
        />
      </Pressable>
    );
  };

  export {PlayButton}