import React from 'react';
import { ReactNode } from 'react';
import {View} from 'react-native';

interface Props {
  show: boolean;
  children: ReactNode;
}

const RateMessage: React.FC<Props> = ({show, children}) => {
  return (
    <View
      style={{
        display: show ? 'flex' : 'none',
        position: 'absolute',
        alignItems:'center',
        top: 45,
        width: '100%',
      }}>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems:'center',
          borderRadius: 5,
        }}>
       {children}
      </View>
    </View>
  );
};

export {RateMessage};
