import React from 'react';
import {StyleProp, TextStyle, Text, View} from 'react-native';

interface Props {
  title: string;
  active?: boolean;
  style?: StyleProp<TextStyle>;
}

const SubTitleBold: React.FC<Props> = ({title}) => {
  return (
    <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>
      {title}
    </Text>
  );
};

const SubTitle: React.FC<Props> = ({title, active}) => {
  let color = active ? 'deeppink' : 'black';
  return <Text style={{fontSize: 15, color, fontWeight: '400'}}>{title}</Text>;
};

const Title: React.FC<Props> = ({title, active, style}) => {
  let color = active ? 'deeppink' : 'black';
  return (
    <Text
      style={[
        style,
        {
          fontSize: 20,
          color,
          fontWeight: 'bold',
          overflow: 'hidden',
        },
      ]}>
      {title}
    </Text>
  );
};

const InfoText: React.FC<Props> = ({title}) => {
  return <Text style={{color: 'gray'}}>{title}</Text>;
};

const RateText: React.FC<Props> = ({title}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
      <Text style={{color: 'darkorange', fontWeight: '500', fontSize: 20}}>
        {title}
      </Text>
      <Text style={{color: 'darkorange', fontWeight: '300'}}>分</Text>
    </View>
  );
};

export {SubTitleBold, SubTitle, Title, InfoText, RateText};
