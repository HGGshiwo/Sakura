import {View, StyleSheet, useWindowDimensions} from 'react-native';

import React, {useState} from 'react';
import {SearchBar} from '../../component/SearchBar';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import Home from './Home';
import Other from './Other';

interface Props {
  navigation: any;
}

const url = {
  rbdm: {url: 'ribendongman/', title: '日本动漫'},
  gcdm: {url: 'guochandongman/', title: '国产动漫'},
  mgdm: {url: 'meiguodongman/', title: '美国动漫'},
  dmdy: {url: 'movie/', title: '动漫电影'},
  qzdm: {url: 'qinzi/', title: '亲子动漫'},
};

const AnimePage: React.FC<Props> = ({navigation}) => {
  const renderScene = ({route}) =>
    route.key === 'home' ? (
      <Home navigate={navigation.navigate} push={navigation.push} />
    ) : (
      <Other
        navigate={navigation.navigate}
        push={navigation.push}
        {...url[route.key]}
      />
    );

  const layout = useWindowDimensions();

  const [routes] = useState([
    {key: 'home', title: '首页'},
    {key: 'rbdm', title: '日本动漫'},
    {key: 'gcdm', title: '国产动漫'},
    {key: 'mgdm', title: '美国动漫'},
    {key: 'qzdm', title: '亲子动漫'},
  ]);

  const [index, setIndex] = useState(0);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          backgroundColor: '#ff4081',
        }}>
        <SearchBar
          placeholder="查找关键词"
          isButton={true}
          onPress={() => {
            navigation.navigate('Search');
          }}
        />
      </View>
      <TabView
        lazy
        renderTabBar={props => (
          <TabBar
            scrollEnabled
            {...props}
            indicatorStyle={{backgroundColor: 'white'}}
            style={{backgroundColor: '#ff4081'}}
            tabStyle={{width: 'auto'}}
          />
        )}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default AnimePage;
