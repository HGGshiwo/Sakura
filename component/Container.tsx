import {useRoute} from '@react-navigation/native';
import {ReactNode} from 'react';
import {View, StatusBar, useColorScheme} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type ContainerProps = {
  children: ReactNode;
};
const Container = ({children}: ContainerProps) => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const {name} = route;
  const isDarkMode = useColorScheme() === 'dark';

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
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={name === 'Video' ? 'black' : '#ff4081'}
      />
      {children}
    </View>
  );
};

export default Container;
