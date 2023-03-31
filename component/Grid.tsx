import {
  View,
  ListRenderItemInfo,
  FlatListProps,
  SectionList,
  SectionListProps,
  SectionListRenderItemInfo,
} from 'react-native';

import React, {ReactNode} from 'react';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import {FlatList} from 'react-native-gesture-handler';

interface ItemProps<T> {
  index: number;
  datas: readonly T[];
  children: (index: number, info: T) => ReactNode;
  numberOfItem: number; //一行几个元素
  containerStyle?: ViewStyle;
}

const MultiItemRow: React.FC<ItemProps<any>> = ({
  index,
  datas,
  children,
  numberOfItem,
  containerStyle,
}) => {
  if (index % numberOfItem !== 0) return <></>;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        containerStyle,
      ]}>
      {new Array(numberOfItem).fill(0).map((_, rowIndex) => {
        return index + rowIndex >= datas.length ? (
          <View key={rowIndex} style={{flex: 1}} />
        ) : (
          children(index + rowIndex, datas[index + rowIndex])
        );
      })}
    </View>
  );
};

const FlatGrid: React.FC<FlatListProps<any>> = props => {
  const newProps = {...props};
  delete newProps.numColumns;
  newProps.renderItem = ({item, index}: ListRenderItemInfo<any>) => (
    <MultiItemRow
      numberOfItem={props.numColumns!}
      index={index}
      datas={props.data!}
      children={(index, item) => props.renderItem!({index, item} as any)}
    />
  );

  return <FlatList {...newProps} />;
};

const SectionGrid: React.FC<
  SectionListProps<any> & {numColumns: number}
> = props => {
  const newProps = {...props};
  newProps.renderItem = ({index, section}: SectionListRenderItemInfo<any>) => (
    <MultiItemRow
      numberOfItem={props.numColumns!}
      index={index}
      datas={section.data}
      children={(index, item) => props.renderItem!({index, item} as any)}
    />
  );

  return <SectionList {...newProps} />;
};

export {SectionGrid, FlatGrid};
