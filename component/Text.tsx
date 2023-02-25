import React from 'react';
import {StyleProp, TextStyle, Text, View} from 'react-native';

interface Props {
  title: string;
  active?: boolean;
  style?: StyleProp<TextStyle>;
}

const SubTitleBold: React.FC<Props> = ({title, style}) => {
  return (
    <Text style={[{fontSize: 16, fontWeight: 'bold', color: 'black'}, style]}>
      {title}
    </Text>
  );
};

const SubTitle: React.FC<Props> = ({title, active, style}) => {
  let color = active ? 'deeppink' : 'black';
  return (
    <Text style={[{fontSize: 15, color, fontWeight: '400'}, style]}>
      {title}
    </Text>
  );
};

const Title: React.FC<Props> = ({title, active, style}) => {
  let color = active ? 'deeppink' : 'black';
  return (
    <Text
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

const InfoText: React.FC<Props> = ({title, style}) => {
  return <Text style={[{color: 'gray'}, style]}>{title}</Text>;
};

const RateText: React.FC<Props> = ({title, style}) => {
  return (
    <View style={[{flexDirection: 'row', alignItems: 'baseline'}, style]}>
      <Text style={{color: 'darkorange', fontWeight: '500', fontSize: 20}}>
        {title}
      </Text>
      <Text style={{color: 'darkorange', fontWeight: '300'}}>分</Text>
    </View>
  );
};

export {SubTitleBold, SubTitle, Title, InfoText, RateText};
