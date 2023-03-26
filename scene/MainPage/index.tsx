import {View, useWindowDimensions} from 'react-native';
import React, {useContext, useState} from 'react';
import {SearchBar} from '../../component/SearchBar';
import {TabBar, TabView} from 'react-native-tab-view';
import Home from './Home';
import Other from './Other';
import Container from '../../component/Container';
import {useNavigation, useRoute} from '@react-navigation/native';
import {MainPageProps} from '../../type/route';
import {InfoText} from '../../component/Text';
import AppContext from '../../context';
const config = {
  Anime: {
    routes: [
      {key: 'home', title: '首页'},
      {key: 'rbdm', title: '日本动漫'},
      {key: 'gcdm', title: '国产动漫'},
      {key: 'mgdm', title: '美国动漫'},
      {key: 'qzdm', title: '亲子动漫'},
    ],
    url: {
      rbdm: {url: 'ribendongman/', title: '日本动漫'},
      gcdm: {url: 'guochandongman/', title: '国产动漫'},
      mgdm: {url: 'meiguodongman/', title: '美国动漫'},
      dmdy: {url: 'movie/', title: '动漫电影'},
      qzdm: {url: 'qinzi/', title: '亲子动漫'},
    },
  },
  Comic: {
    routes: [{key: 'home', title: '首页'}],
    url: {},
  },
  Novel: {
    routes: [{key: 'home', title: '首页'}],
    url: {},
  },
};
const MainPage: React.FC<MainPageProps> = () => {
  const navigation = useNavigation<MainPageProps['navigation']>();
  const route = useRoute<MainPageProps['route']>();
  const {tabName} = route.params;
  const url = config[tabName].url;
  const layout = useWindowDimensions();
  const [routes] = useState(config[tabName].routes);
  const [index, setIndex] = useState(0);
  const {HeaderStyle} = useContext(AppContext).theme;
  
  const renderScene = ({route}: any) =>
    route.key === 'home' ? (
      <Home tabName={tabName} />
    ) : (
      <Other {...(url as any)[route.key]} tabName={tabName} />
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
