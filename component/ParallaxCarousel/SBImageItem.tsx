import {useNavigation} from '@react-navigation/native';
import React from 'react';
// import {Image} from '@rneui/themed';
import {StyleProp, ViewStyle, ImageURISource, Pressable} from 'react-native';
import {StyleSheet, View, ActivityIndicator, Text, Image} from 'react-native';
import RecommandInfo from '../../type/RecommandInfo';
import {MainPageProps, TabName, targets} from '../../route';
import {ImageBackground} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {InfoText} from '../Text';

interface Props {
  style?: StyleProp<ViewStyle>;
  item: RecommandInfo;
  showIndex?: boolean;
  onPress: (item: RecommandInfo) => void;
}

const SBImageItem: React.FC<Props> = ({
  style,
  item,
  onPress,
  showIndex = true,
}) => {
  return (
    <Pressable style={{flex: 1}} onPress={() => onPress(item)}>
      <ImageBackground
        key={item.href}
        imageStyle={styles.image}
        style={styles.container}
        source={{uri: item.img}}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.textContainer}>
          <InfoText
            title={showIndex ? item.title : ''}
            style={{color: 'white', flex: 1, overflow: 'hidden'}}
          />
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    width: '100%',
    borderRadius: 5,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 2,
    justifyContent: 'space-around',
  },
  container: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'grey',
  },
});

export {SBImageItem};
