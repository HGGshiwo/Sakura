import {View} from 'react-native';

import React, {ReactNode} from 'react';

interface ItemProps<T> {
  index: number;
  datas: T[];
  children: (index: number, info: T, onPress?: Function) => ReactNode;
  numberOfItem: number; //一行几个元素
}

const MultiItemRow: React.FC<ItemProps<any>> = ({
  index,
  datas,
  children,
  numberOfItem,
}) => {
  if (index % numberOfItem !== 0) return <></>;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      {new Array(numberOfItem).fill(0).map((_, rowIndex) => {
        return index + rowIndex >= datas.length ? (
          <View key={rowIndex} style={{flex: 1}}></View>
        ) : (
          children(index + rowIndex, datas[index + rowIndex])
        );
      })}
    </View>
  );
};

export default MultiItemRow;
