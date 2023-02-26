/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar, useColorScheme, Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import VideoPage from './scene/VideoPage';
import HomePage from './scene/HomePage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faBook,
  faC,
  faHouse,
  faPalette,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {faYoutube} from '@fortawesome/free-brands-svg-icons';
import { Pressable } from 'react-native/Libraries/Components/Pressable/Pressable';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const Tab = createBottomTabNavigator();
  const icons = {
    //Animation
    home: faYoutube,
    User: faUser,
    Novel: faBook,
    Comic: faPalette,
  };

  const texts = {
    home: '番剧',
    User: '我的',
    Novel: '小说',
    Comic: '漫画',
  };

  const TabPage = () => {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let icon = icons[route.name as keyof typeof icons];
            // You can return any component that you like here!
            return (
              <FontAwesomeIcon
                icon={icon}
                size={18}
                color={focused ? 'deeppink' : 'grey'}
              />
            );
          },
          headerShown: false,
          tabBarLabel: ({focused, color, position}) => {
            return (
              <Text
                style={{paddingBottom: 8, fontSize: 10, color: focused ? 'deeppink' : 'grey'}}>
                {texts[route.name as keyof typeof texts]}
              </Text>
            );
          },
        })}>
        <Tab.Screen name="home" component={HomePage} />
        <Tab.Screen name="Novel" component={UserStackScreen} />
        <Tab.Screen name="Comic" component={UserStackScreen} />
        <Tab.Screen name="User" component={UserStackScreen} />
      </Tab.Navigator>
    );
  };

  const UserStackScreen = () => {
    return <></>;
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
          <Stack.Navigator
            initialRouteName="home"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="home" component={TabPage} />
            <Stack.Screen name="video" component={VideoPage} />
          </Stack.Navigator>
        </GestureHandlerRootView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
