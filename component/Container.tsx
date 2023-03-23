import {useRoute} from '@react-navigation/native';
import {ReactNode, useContext, useEffect, useState} from 'react';
import {View, StatusBar, useColorScheme, StatusBarStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import AppContext from '../context';
type ContainerProps = {
  children: ReactNode;
  style?: ViewStyle;
};
const Container = ({children, style}: ContainerProps) => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const {name} = route;
  const {themeName} = useContext(AppContext)
  const isDarkMode = useColorScheme() === 'dark';
  const {HeaderStyle, ContainerStyle} = useContext(AppContext).theme;;
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
  }, [name, themeName]);

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
