/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import VideoPage from './scene/VideoPage';
import HomePage from './scene/HomePage';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaProvider style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <NavigationContainer>
        <GestureHandlerRootView style={{flex: 1}}>
          <Stack.Navigator initialRouteName="home" screenOptions={{headerShown: false}}>
            <Stack.Screen name="home" component={HomePage} />
            <Stack.Screen name="video" component={VideoPage} />
          </Stack.Navigator>
        </GestureHandlerRootView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
