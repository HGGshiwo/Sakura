import {useRoute} from '@react-navigation/native';
import {ReactNode, useContext, useEffect, useState} from 'react';
import {View, StatusBar, useColorScheme, StatusBarStyle} from 'react-native';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import useTheme from '../zustand/Theme';
import {TabName} from '../route';
type ContainerProps = {
  children: ReactNode;
  style?: ViewStyle;
  tabName?: TabName;
};
const Container = ({children, style, tabName}: ContainerProps) => {
  const route = useRoute();
  const {name} = route;
  const {themeName} = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const {HeaderStyle, ContainerStyle} = useTheme().theme;
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [translucent, setTranslucent] = useState(false);
  const [barStyle, setBarStyle] = useState<StatusBarStyle>(
    isDarkMode ? 'light-content' : 'dark-content',
  );
  useEffect(() => {
    switch (name) {
      case 'Anime':
      case 'Comic':
      case 'Text':
      case 'User':
        setBackgroundColor(HeaderStyle.backgroundColor);
        setTranslucent(false);
        break;
      case 'Info':
        if (tabName === 'Anime') {
          setBackgroundColor('black');
          setBarStyle('light-content');
          setTranslucent(false);
        } else {
          setBackgroundColor(HeaderStyle.backgroundColor);
          setTranslucent(false);
        }
        break;
      case 'Image':
      case 'Text':
        setBackgroundColor('transparent');
        setBarStyle('light-content');
        setTranslucent(true);
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
      <StatusBar
        barStyle={barStyle}
        translucent={translucent}
        backgroundColor={backgroundColor}
      />
      {children}
    </View>
  );
};

export default Container;
