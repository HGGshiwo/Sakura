import {useRoute} from '@react-navigation/native';
import {ReactNode} from 'react';
import {View, StatusBar, useColorScheme, StatusBarStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type ContainerProps = {
  children: ReactNode;
};
const Container = ({children}: ContainerProps) => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const {name} = route;
  const isDarkMode = useColorScheme() === 'dark';
  let backgroundColor = 'white';
  let barStyle: StatusBarStyle = isDarkMode ? 'light-content' : 'dark-content';
  switch (name) {
    case 'Video':
      backgroundColor = 'black';
      barStyle = 'light-content';
      break;
    case 'Tab':
    case 'User':
    case 'Anime':
      backgroundColor = '#ff4081';
      break;
  }
  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
      }}>
      <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
      {children}
    </View>
  );
};

export default Container;
