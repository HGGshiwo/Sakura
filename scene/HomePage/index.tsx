import {Button} from '@rneui/themed';
import {View} from 'react-native';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';

const HomePage = ({navigation}) => {
  return (
    <View>
      <Button
        title={'Video Page'}
        onPress={() => {
          navigation.push('video', {url: '/show/5786.html'});
        }}
      />
    </View>
  );
};

export default HomePage;
