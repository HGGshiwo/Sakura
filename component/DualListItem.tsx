import {View, StyleSheet} from 'react-native';

import React, {PropsWithChildren, ReactNode} from 'react';

interface ItemProps {
  index: number;
  datas: any[];
  children: (index: number, info: any) => ReactNode;
}

const DualItemRow: React.FC<ItemProps> = ({index, datas, children}) => {
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
