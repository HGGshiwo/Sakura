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

interface Props {
  title: string;
  active?: boolean;
  style?: StyleProp<TextStyle>;
  numberOfLines?: any;
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

const SubTitle: React.FC<Props> = ({
  numberOfLines = 0,
  title,
  style,
}) => {
  return (
    <Text
      ellipsizeMode="tail"
      numberOfLines={numberOfLines}
      style={[{fontSize: 15, fontWeight: '400', color:'black'}, style]}>
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

const RateText: React.FC<Props> = ({title, style}) => {
  const icons = [fa0, fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, fa9];
  const nums = title.split('.');
  const num0 = parseInt(nums[0]);
  const num1 = parseInt(nums[1]);
  return (
    <View style={[{flexDirection: 'row', alignItems: 'flex-end'}, style]}>
      <FontAwesomeIcon color="darkorange" size={20} icon={icons[num0]} />
      <FontAwesomeIcon color="darkorange" size={3} icon={faCircle} />
      <FontAwesomeIcon color="darkorange" size={20} icon={icons[num1]} />
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
};
