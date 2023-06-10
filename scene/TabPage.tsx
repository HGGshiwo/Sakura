import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBook, faPalette, faUser} from '@fortawesome/free-solid-svg-icons';
import {faYoutube} from '@fortawesome/free-brands-svg-icons';
import {InfoText} from '../component/Text';
import {useContext} from 'react';
import {tabRoutes} from '../route';
import useTheme from '../zustand/Theme';

const Tab = createBottomTabNavigator();
const tabs = {
  Anime: {icon: faYoutube, text: '番剧'},
  Novel: {icon: faBook, text: '小说'},
  Comic: {icon: faPalette, text: '漫画'},
  User: {icon: faUser, text: '我的'},
};

const TabPage = () => {
  const {BottomStyle} = useTheme().theme;

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
      {tabRoutes.map(({name, component, initialParams}) => (
        <Tab.Screen
          name={name}
          key={name}
          initialParams={initialParams}
          component={component as any}
        />
      ))}
    </Tab.Navigator>
  );
};
export default TabPage;
