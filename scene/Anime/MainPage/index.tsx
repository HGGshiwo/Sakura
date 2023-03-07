import {View, useWindowDimensions} from 'react-native';

import React, {useState} from 'react';
import {SearchBar} from '../../../component/SearchBar';
import {TabBar, TabView} from 'react-native-tab-view';
import Home from './Home';
import Other from './Other';
import Container from '../../../component/Container';
import {useNavigation} from '@react-navigation/native';
import {AnimePageProps} from '../../../type/route';
import {InfoText} from '../../../component/Text';
import theme from '../../../theme';

const url = {
  rbdm: {url: 'ribendongman/', title: '日本动漫'},
  gcdm: {url: 'guochandongman/', title: '国产动漫'},
  mgdm: {url: 'meiguodongman/', title: '美国动漫'},
  dmdy: {url: 'movie/', title: '动漫电影'},
  qzdm: {url: 'qinzi/', title: '亲子动漫'},
};

const AnimePage: React.FC<{}> = () => {
  const navigation = useNavigation<AnimePageProps['navigation']>();

  const renderScene = ({route}: any) =>
    route.key === 'home' ? (
      <Home />
    ) : (
      <Other {...url[route.key as keyof typeof url]} />
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
  const {HeaderStyle} = theme['red']

  return (
    <Container>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          backgroundColor: HeaderStyle.backgroundColor,
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
            indicatorStyle={{backgroundColor: HeaderStyle.indicatorColor, width: 0.5}}
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
            style={{backgroundColor: HeaderStyle.backgroundColor, shadowColor: HeaderStyle.shadowColor}}
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

export default AnimePage;
