import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBook, faPalette, faUser} from '@fortawesome/free-solid-svg-icons';
import {faYoutube} from '@fortawesome/free-brands-svg-icons';
import {InfoText} from '../component/Text';
import UserPage from './UserPage';
import MainPage from './MainPage';
import {useContext, useEffect} from 'react';
import AppContext from '../context';
import {View, Pressable, Text} from 'react-native';

const Tab = createBottomTabNavigator();
const tabs = {
  Anime: {icon: faYoutube, text: '番剧'},
  Novel: {icon: faBook, text: '小说'},
  Comic: {icon: faPalette, text: '漫画'},
  User: {icon: faUser, text: '我的'},
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
          let icon = tabs[route.name as keyof typeof tabs].icon;
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
            <InfoText
              title={tabs[route.name as keyof typeof tabs].text}
              style={{
                paddingBottom: 8,
                fontSize: 10,
                color: BottomStyle.textColor(focused),
              }}
            />
          );
        },
      })}>
      {['Anime', 'Novel', 'Comic'].map(name => (
        <Tab.Screen
          name={name}
          key={name}
          initialParams={{tabName: name}}
          component={MainPage as any}
        />
      ))}
      <Tab.Screen name="User" component={UserPage} />
    </Tab.Navigator>
  );
};
export default TabPage;
