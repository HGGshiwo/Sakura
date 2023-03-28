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
  const [translucent, setTranslucent] = useState(false)
  const [barStyle, setBarStyle] = useState<StatusBarStyle>(
    isDarkMode ? 'light-content' : 'dark-content',
  );
  useEffect(() => {
    switch (name) {
      case 'Video':
        setBackgroundColor('black');
        setBarStyle('light-content');
        setTranslucent(false)
        break;
      case 'Tab':
      case 'User':
      case 'Anime':
      case 'Comic':
      case 'Novel':
        setBackgroundColor(HeaderStyle.backgroundColor);
        setTranslucent(false)
        break;
      case 'Image': 
        setBackgroundColor('transparent');
        setTranslucent(true)
        break;
    }
  }, [name, themeName]);

  return (
    <View
      style={[
        {
          backgroundColor: ContainerStyle.backgroundColor,
          flex: 1,
        },
        style,
      ]}>
      <StatusBar barStyle={barStyle} translucent={translucent} backgroundColor={backgroundColor} />
      {children}
    </View>
  );
};

export default Container;
