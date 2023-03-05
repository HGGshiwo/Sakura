import {useNavigation} from '@react-navigation/native';
import React from 'react';
// import {Image} from '@rneui/themed';
import {StyleProp, ViewStyle, ImageURISource, Pressable} from 'react-native';
import {StyleSheet, View, ActivityIndicator, Text, Image} from 'react-native';
import {RecommandInfo} from '../../type/RecommandInfo';
import {NoParamProps} from '../../type/route';

interface Props {
  style?: StyleProp<ViewStyle>;
  item: RecommandInfo;
  showIndex?: boolean;
}

const SBImageItem: React.FC<Props> = ({style, item, showIndex = true}) => {
  const navigation = useNavigation<NoParamProps['navigation']>();
  return (
    <Pressable style={{flex: 1}} onPress={() => navigation.navigate('Video', {url: item.href})}>
      <View style={[styles.container, style]}>
        <ActivityIndicator size="small" />
        <Image key={item.href} style={styles.image} source={{uri: item.img}} />
        <Text
          style={{
            position: 'absolute',
            color: 'white',
            bottom: 5,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 5,
            overflow: 'hidden',
            paddingHorizontal: 10,
            paddingTop: 2,
          }}>
          {showIndex ? item.title : ''}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export {SBImageItem};
