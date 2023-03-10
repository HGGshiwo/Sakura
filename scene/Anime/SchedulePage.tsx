import {useNavigation} from '@react-navigation/native';
import {Divider} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {View, FlatList, useWindowDimensions, Pressable} from 'react-native';
import loadPage from '../../api/yinghuacd/home';
import Container from '../../component/Container';
import HeadBar from '../../component/HeadBar';
import {LoadingContainer} from '../../component/Loading';
import {InfoText, SubTitleBold} from '../../component/Text';
import {NoParamProps} from '../../type/route';
import DailyInfo from '../../type/DailyInfo';
import {TabBar, TabView} from 'react-native-tab-view';
import theme from '../../theme';

const routes = [
  {key: '0', title: '星期一'},
  {key: '1', title: '星期二'},
  {key: '2', title: '星期三'},
  {key: '3', title: '星期四'},
  {key: '4', title: '星期五'},
  {key: '5', title: '星期六'},
  {key: '6', title: '星期天'},
];

const SchedulePage: React.FC<{}> = () => {
  const [dailys, setDailys] = useState<DailyInfo[][]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NoParamProps['navigation']>();
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();

  const renderScene = ({route}: any) => (
    <FlatList
      ItemSeparatorComponent={() => <Divider />}
      contentContainerStyle={{paddingHorizontal: 15}}
      keyExtractor={item => item.href1}
      data={dailys[parseInt(route.key)]}
      renderItem={({item, index}) => (
        <Pressable
          onPress={() => {
            navigation.navigate('Video', {url: item.href2});
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              padding: 10,
              paddingVertical: 15,
              justifyContent: 'space-between',
            }}>
            <InfoText
              style={{flex: 1, overflow: 'hidden'}}
              title={item.title}
            />
            <InfoText title={item.state} />
          </View>
        </Pressable>
      )}
    />
  );
  useEffect(() => {
    loadPage(({dailys}) => {
      setDailys(dailys);
      setLoading(false);
    });
  }, []);

  const {TabBarStyle} = theme['red']

  return (
    <Container>
      <HeadBar
        onPress={() => {
          navigation.navigate('Tab');
        }}
        style={{paddingVertical: 20}}>
        <SubTitleBold title="时间表" />
      </HeadBar>
      <Divider />
      <LoadingContainer loading={loading} style={{paddingTop: '30%'}}>
        <TabView
          lazy
          renderTabBar={props => (
            <TabBar
              scrollEnabled
              {...props}
              indicatorStyle={{backgroundColor: TabBarStyle.indicatorColor, width: 0.5}}
              renderLabel={({route, focused, color}) => (
                <InfoText
                  title={route.title!}
                  style={{
                    color: TabBarStyle.textColor(focused),
                    paddingHorizontal: 5,
                    fontWeight: focused ? 'bold' : 'normal',
                  }}
                />
              )}
              style={{backgroundColor: 'white'}}
              tabStyle={{width: 'auto'}}
            />
          )}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
      </LoadingContainer>
    </Container>
  );
};

export default SchedulePage;
