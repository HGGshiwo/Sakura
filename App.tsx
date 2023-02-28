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
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import VideoPage from './scene/VideoPage';
import AnimationPage from './scene/AnimationPage';
import SearchPage from './scene/SearchPage'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faBook,
  faPalette,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {faYoutube} from '@fortawesome/free-brands-svg-icons';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const Tab = createBottomTabNavigator();
  const icons = {
    Animation: faYoutube,
    User: faUser,
    Novel: faBook,
    Comic: faPalette,
  };

  const texts = {
    Animation: '番剧',
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
        <Tab.Screen name="Animation" component={AnimationPage} />
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
            <Stack.Screen name="Tab" component={TabPage} />
            <Stack.Screen name="Video" component={VideoPage} />
            <Stack.Screen name="Search" component={SearchPage} />
          </Stack.Navigator>
        </GestureHandlerRootView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
type RootStackParamList = {
  Animation: undefined;
  Video: { url: string };
  Search: undefined;
};

type VideoPageProps = NativeStackScreenProps<RootStackParamList, 'Video'>;
export type { VideoPageProps }
export default App;

