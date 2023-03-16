import {
  fa0,
  fa1,
  fa2,
  fa3,
  fa4,
  fa5,
  fa6,
  fa7,
  fa8,
  fa9,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {StyleProp, TextStyle, Text, View} from 'react-native';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

interface Props {
  title: string;
  active?: boolean;
  style?: TextStyle;
  numberOfLines?: any;
  containerStyle?: ViewStyle;
}

const SubTitleBold: React.FC<Props> = ({title, style}) => {
  return (
    <Text
      ellipsizeMode="tail"
      numberOfLines={2}
      style={[
        {
          fontSize: 16,
          fontWeight: 'bold',
          color: 'black',
        },
        style,
      ]}>
      {title}
    </Text>
  );
};

const SubTitle: React.FC<Props> = ({numberOfLines = 0, title, style}) => {
  return (
    <Text
      ellipsizeMode="tail"
      numberOfLines={numberOfLines}
      style={[{fontSize: 15, fontWeight: '400', color: 'black'}, style]}>
      {title}
    </Text>
  );
};

const Title: React.FC<Props> = ({title, active, style}) => {
  let color = active ? 'deeppink' : 'black';
  return (
    <Text
      ellipsizeMode="tail"
      numberOfLines={2}
      style={[
        {
          fontSize: 20,
          color,
          fontWeight: 'bold',
          overflow: 'hidden',
        },
        style,
      ]}>
      {title}
    </Text>
  );
};

const InfoText: React.FC<Props> = ({title, style, numberOfLines}) => {
  return (
    <Text
      ellipsizeMode="tail"
      numberOfLines={numberOfLines < 0 ? 0 : numberOfLines ? numberOfLines : 1}
      style={[{color: 'black'}, style]}>
      {title}
    </Text>
  );
};

const SubInfoText: React.FC<Props> = ({title, style, numberOfLines}) => {
  return (
    <Text
      ellipsizeMode="tail"
      numberOfLines={numberOfLines ? numberOfLines : 1}
      style={[{color: 'gray'}, style]}>
      {title}
    </Text>
  );
};

const NumberText: React.FC<Props> = ({title, style, containerStyle}) => {
  const nums = title.split('');
  const map = {
    '0': fa0,
    '1': fa1,
    '2': fa2,
    '3': fa3,
    '4': fa4,
    '5': fa5,
    '6': fa6,
    '7': fa7,
    '8': fa8,
    '9': fa9,
  };
  return (
    <View
      style={[{flexDirection: 'row', alignItems: 'flex-end'}, containerStyle]}>
      {nums.map((num, index) => {
        return num === '.' ? (
          <FontAwesomeIcon
            key={index}
            size={3}
            style={{marginRight: 6}}
            color={style ? (style.color as string) : 'black'}
            icon={faCircle}
          />
        ) : (
          <FontAwesomeIcon
            key={index}
            style={{marginLeft: index === 0 ? 0 : -6}}
            color={style ? (style.color as string) : 'black'}
            size={20}
            icon={map[num as keyof typeof map]}
          />
        );
      })}
    </View>
  );
};

const RateText: React.FC<Props> = ({title, containerStyle}) => {
  return (
    <View
      style={[{flexDirection: 'row', alignItems: 'flex-end'}, containerStyle]}>
      <NumberText title={title} style={{color: 'darkorange'}} />
      <Text
        style={{
          color: 'darkorange',
          fontWeight: '400',
        }}>
        分
      </Text>
    </View>
  );
};

const LoadingText: React.FC<Props> = ({title, style, numberOfLines}) => {
  return (
    <Text
      numberOfLines={numberOfLines ? numberOfLines : 1}
      style={[{color: 'white', elevation: 1}, style]}>
      {title}
    </Text>
  );
};

export {
  LoadingText,
  SubTitleBold,
  SubTitle,
  Title,
  InfoText,
  RateText,
  SubInfoText,
  NumberText,
};
