/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useColorScheme, Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootSiblingParent} from 'react-native-root-siblings';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBook, faPalette, faUser} from '@fortawesome/free-solid-svg-icons';
import {faYoutube} from '@fortawesome/free-brands-svg-icons';
import Context from './models';

import {
  VideoPage,
  AnimePage,
  CategoryPage,
  FollowPage,
  HistoryPage,
  IndexPage,
  SearchPage,
  UserPage,
  SchedulePage,
} from './scene/Anime';
import RankingPage from './scene/Anime/RankingPage';
import appTheme from './theme';
import storage from './storage';
import AppContext from './context';

const {RealmProvider} = Context;

const Tab = createBottomTabNavigator();
const icons = {
  Anime: faYoutube,
  User: faUser,
  Novel: faBook,
  Comic: faPalette,
};
const UserStackScreen = () => {
  return <></>;
};
const texts = {
  Anime: '番剧',
  User: '我的',
  Novel: '小说',
  Comic: '漫画',
};
const TabPage = () => {
  const {BottomStyle} = useContext(AppContext).theme;
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          height: 50,
          paddingTop: 10,
          backgroundColor: BottomStyle.backgroundColor,
        },
        tabBarIcon: ({focused, color, size}) => {
          let icon = icons[route.name as keyof typeof icons];
          // You can return any component that you like here!
          return (
            <FontAwesomeIcon
              icon={icon}
              size={18}
              color={BottomStyle.textColor(focused)}
            />
          );
        },
        headerShown: false,
        tabBarLabel: ({focused, color, position}) => {
          return (
            <Text
              style={{
                paddingBottom: 8,
                fontSize: 10,
                color: BottomStyle.textColor(focused),
              }}>
              {texts[route.name as keyof typeof texts]}
            </Text>
          );
        },
      })}>
      <Tab.Screen name="Anime" component={AnimePage} />
      <Tab.Screen name="Novel" component={UserStackScreen} />
      <Tab.Screen name="Comic" component={UserStackScreen} />
      <Tab.Screen name="User" component={UserPage} />
    </Tab.Navigator>
  );
};

const routes = [
  {name: 'Tab', component: TabPage},
  {name: 'Video', component: VideoPage},
  {name: 'Search', component: SearchPage},
  {name: 'Category', component: CategoryPage},
  {name: 'Index', component: IndexPage},
  {name: 'History', component: HistoryPage},
  {name: 'Follow', component: FollowPage},
  {name: 'Ranking', component: RankingPage},
  {name: 'Schedule', component: SchedulePage},
];

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [theme, setTheme] = useState<any>(appTheme.red);
  const [themeName, setThemeName] = useState('');
  const [animeSource, setAnimeSource] = useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    storage.load({key: 'themeName'}).then(
      themeName => {
        setTheme(appTheme[themeName]);
        setThemeName(themeName);
      },
      () => {
        setTheme(appTheme.red);
        setThemeName('red');
      },
    );
    storage.load({key: 'animeSource'}).then(
      animeSource => {
        setAnimeSource(animeSource);
      },
      () => {
        setAnimeSource('scyinghua');
      },
    );
  }, []);

  const changeTheme = (themeName: string) => {
    setThemeName(themeName);
    setTheme(appTheme[themeName]);
    //持久化保存数据
    storage.save({
      key: 'themeName',
      data: themeName,
      expires: null,
    });
  };

  const changeAnimeSource = (source: string) => {
    setAnimeSource(source);
    //持久化保存数据
    storage.save({
      key: 'animeSource',
      data: source,
      expires: null,
    });
  };

  return (
    <SafeAreaProvider style={backgroundStyle}>
      <AppContext.Provider
        value={{theme, themeName, changeTheme, animeSource, changeAnimeSource}}>
        <NavigationContainer>
          <GestureHandlerRootView style={{flex: 1}}>
            <RealmProvider>
              <RootSiblingParent>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                  {routes.map((route, index) => (
                    <Stack.Screen
                      key={index}
                      name={route.name}
                      component={route.component as any}
                    />
                  ))}
                </Stack.Navigator>
              </RootSiblingParent>
            </RealmProvider>
          </GestureHandlerRootView>
        </NavigationContainer>
      </AppContext.Provider>
    </SafeAreaProvider>
  );
}

export default App;
