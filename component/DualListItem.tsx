import {View, StyleSheet} from 'react-native';

import React, {PropsWithChildren, ReactNode} from 'react';

interface ItemProps<T> {
  index: number;
  datas: T[];
  children: (index: number, info: T, onPress?: Function) => ReactNode;
}

const DualItemRow: React.FC<ItemProps<any>> = ({index, datas, children}) => {
  if (index % 2 === 1) return <></>;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      {children(index, datas[index])}
      {index + 1 === datas.length ? (
        <View style={{flex: 1, margin: 10}}></View>
      ) : (
        children(index + 1, datas[index + 1])
      )}
    </View>
  );
};

export {DualItemRow};
