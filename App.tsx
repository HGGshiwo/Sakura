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
import {routes} from './route';
import ContentWrapper from './context';

const {RealmProvider} = Context;

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaProvider style={backgroundStyle}>
      <ContentWrapper>
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
      </ContentWrapper>
    </SafeAreaProvider>
  );
}

export default App;
