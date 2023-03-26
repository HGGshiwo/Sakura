/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootSiblingParent} from 'react-native-root-siblings';

import Context from './models';
import * as scene from './scene';

import appTheme from './theme';
import storage from './storage';
import AppContext from './context';
import TabPage from './scene/TabPage';

const {RealmProvider} = Context;

const routes = [
  {name: 'Tab', component: TabPage},
  {name: 'Video', component: scene.VideoPage},
  {name: 'Search', component: scene.SearchPage},
  {name: 'Category', component: scene.CategoryPage},
  {name: 'Index', component: scene.IndexPage},
  {name: 'History', component: scene.HistoryPage},
  {name: 'Follow', component: scene.FollowPage},
  {name: 'Ranking', component: scene.RankingPage},
  {name: 'Schedule', component: scene.SchedulePage},
  {name: 'Comic', component: scene.ComicPage},
];

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [theme, setTheme] = useState<any>(appTheme.red);
  const [themeName, setThemeName] = useState('');
  const [source, setSource] = useState({Anime: '', Novel: '', Comic: ''});

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
    storage.load({key: 'source'}).then(
      source => {
        setSource(source);
      },
      () => {
        setSource({Anime: 'scyinghua', Comic: 'biquge', Novel: 'biquge'});
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

  const changeSource = (key: 'Novel' | 'Comic' | 'Anime', _source: string) => {
    let newSource = {...source};
    newSource[key] = _source;
    setSource({...newSource});
    //持久化保存数据
    storage.save({
      key: 'source',
      data: newSource,
      expires: null,
    });
  };

  return (
    <SafeAreaProvider style={backgroundStyle}>
      <AppContext.Provider
        value={{
          theme,
          themeName,
          changeTheme,
          source,
          changeSource,
        }}>
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
