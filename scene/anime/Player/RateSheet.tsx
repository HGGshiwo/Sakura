import React from 'react';
import {useContext, useState} from 'react';
import {Text, View, Pressable} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {InfoText} from '../../../component/Text';
import AppContext from '../../../context';
import {ThemeContext} from '../../../context/ThemeContext';

interface Props {
  show: boolean;
  onPress: (data: number, title: string, id: number) => void;
  defaultActive: number;
}

const RateSheet: React.FC<Props> = ({show, onPress, defaultActive}) => {
  const data = [
    {title: '0.2X', id: 0, data: 0.25},
    {title: '0.5X', id: 1, data: 0.5},
    {title: '1.0X', id: 2, data: 1},
    {title: '1.25X', id: 3, data: 1.25},
    {title: '1.5X', id: 4, data: 1.5},
    {title: '2.0X', id: 5, data: 2},
  ];
  const {PlayerStyle} = useContext(ThemeContext).theme;
  return (
    <View
      style={{
        display: show ? 'flex' : 'none',
        position: 'absolute',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,1)',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 30,
        right: 0,
        bottom: 0,
        width: 150,
      }}>
      <FlatList
        data={data}
        renderItem={({item, index}) => (
          <Pressable
            onPress={() => {
              onPress(item.data, item.id === 2 ? '默认' : item.title, item.id);
            }}>
            <View
              style={{flex: 1, justifyContent: 'center', marginVertical: 15}}>
              <InfoText
                title={item.title}
                style={{
                  color:
                    defaultActive === index
                      ? PlayerStyle.textColor(true)
                      : 'white',
                }}
              />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default RateSheet;
