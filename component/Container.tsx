import {useRoute} from '@react-navigation/native';
import {ReactNode, useEffect, useState} from 'react';
import {View, StatusBar, useColorScheme, StatusBarStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import theme from '../theme';
type ContainerProps = {
  children: ReactNode;
  style?: ViewStyle;
};
const Container = ({children, style}: ContainerProps) => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const {name} = route;
  const isDarkMode = useColorScheme() === 'dark';
  const themeName = 'red';
  const {HeaderStyle, ContainerStyle} = theme[themeName];
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [barStyle, setBarStyle] = useState<StatusBarStyle>(
    isDarkMode ? 'light-content' : 'dark-content',
  );
  useEffect(() => {
    switch (name) {
      case 'Video':
        setBackgroundColor('black');
        setBarStyle('light-content');
        break;
      case 'Tab':
      case 'User':
      case 'Anime':
        setBackgroundColor(HeaderStyle.backgroundColor);
        break;
    }
  }, [themeName, name]);

  return (
    <View
      style={[
        {
          backgroundColor: ContainerStyle.backgroundColor,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flex: 1,
        },
        style,
      ]}>
      <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
      {children}
    </View>
  );
};

export default Container;
