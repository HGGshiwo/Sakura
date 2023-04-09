import {View, useWindowDimensions} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {SearchBar} from '../../component/SearchBar';
import {Route, TabBar, TabView} from 'react-native-tab-view';
import Home from './Home';
import Container from '../../component/Container';
import {useNavigation, useRoute} from '@react-navigation/native';
import {MainPageProps} from '../../route';
import {InfoText} from '../../component/Text';
import AppContext from '../../context';

const MainPage: React.FC<MainPageProps> = () => {
  const navigation = useNavigation<MainPageProps['navigation']>();
  const route = useRoute<MainPageProps['route']>();
  const {tabName} = route.params;
  const layout = useWindowDimensions();
  const {source, api} = useContext(AppContext);
  const apiName = source[tabName];
  const [routes, setRoutes] = useState<Route[]>(api[tabName][apiName].routes);
  const [index, setIndex] = useState(0);
  const {HeaderStyle} = useContext(AppContext).theme;

  useEffect(()=>{
    setRoutes(api[tabName][apiName].routes);
  }, [])

  useEffect(() => {
    console.log(tabName, apiName)
    setRoutes(api[tabName][apiName].routes);
  }, [apiName]);

  const renderScene = ({route}: any) => (
    <Home
      home={route.title === '首页'}
      apiName={apiName}
      url={route.key}
      tabName={tabName}
    />
  );

  return (
    <Container>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          backgroundColor: HeaderStyle.backgroundColor,
          height: 60,
        }}>
        <SearchBar
          placeholder="查找关键词"
          isButton={true}
          onPress={() => {
            navigation.navigate('Search', {tabName});
          }}
        />
      </View>
      <TabView
        lazy
        renderTabBar={props => (
          <TabBar
            scrollEnabled
            {...props}
            indicatorStyle={{
              backgroundColor: HeaderStyle.indicatorColor,
              width: 0.5,
            }}
            renderLabel={({route, focused, color}) => (
              <InfoText
                title={route.title}
                style={{
                  color: HeaderStyle.textColor(focused),
                  paddingHorizontal: 5,
                  fontWeight: focused ? '900' : 'normal',
                }}
              />
            )}
            style={{
              backgroundColor: HeaderStyle.backgroundColor,
              shadowColor: HeaderStyle.shadowColor,
            }}
            tabStyle={{width: 'auto'}}
          />
        )}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </Container>
  );
};

export default MainPage;
