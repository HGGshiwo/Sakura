import { createContext } from "react";

const theme = {
  red: {
    ContainerStyle: {
      backgroundColor: 'white',
    },
    HeaderStyle: {
      backgroundColor: 'red',
      indicatorColor: 'white',
      textColor: (focused: boolean) => focused ? 'white' : 'white',
      shadowColor: 'white',
    },
    BottomStyle: {
      textColor: (focused: boolean) => focused ? 'red' : 'lightgrey',
    },
    LoadingStyle: {
      color: 'red',
    },
    NavBarStyle: {
      color: 'red',
    },
    VideoStyle: {
      textColor: (focused: boolean) => focused ? 'red' : 'black',
      indicatorColor: 'red',
      playerTextColor: (focused: boolean) => focused ? 'red' : 'white'
    },
    FollowButtonStyle: {
      backgroundColor: (followed: boolean) => followed ? 'lightgray' : 'red',
      rippleColor: 'red',
      textColor: (followed: boolean) => followed ? 'gray' : 'white'
    },
    RoundButtonStyle: {
      textColor: 'red',
    },
    DialogStyle: {
      textColor: 'red'
    },
    TabBarStyle: {
      textColor: (focused: boolean) => focused ? 'red' : 'black',
      indicatorColor: 'red',
    }
  },
  blue: {
    ContainerStyle: {
      backgroundColor: 'white',
    },
    HeaderStyle: {
      backgroundColor: 'dodgerblue',
      indicatorColor: 'white',
      textColor: (focused: boolean) => focused ? 'white' : 'white',
      shadowColor: 'white',
    },
    BottomStyle: {
      textColor: (focused: boolean) => focused ? 'dodgerblue' : 'lightgrey',
    },
    LoadingStyle: {
      color: 'dodgerblue',
    },
    NavBarStyle: {
      color: 'dodgerblue',
    },
    VideoStyle: {
      textColor: (focused: boolean) => focused ? 'dodgerblue' : 'black',
      indicatorColor: 'dodgerblue',
      playerTextColor: (focused: boolean) => focused ? 'dodgerblue' : 'white'
    },
    FollowButtonStyle: {
      backgroundColor: (followed: boolean) => followed ? 'lightgray' : 'dodgerblue',
      rippleColor: 'dodgerblue',
      textColor: (followed: boolean) => followed ? 'gray' : 'white'
    },
    RoundButtonStyle: {
      textColor: 'dodgerblue',
    },
    DialogStyle: {
      textColor: 'dodgerblue'
    },
    TabBarStyle: {
      textColor: (focused: boolean) => focused ? 'dodgerblue' : 'black',
      indicatorColor: 'dodgerblue',
    }
  },
  black: {
    ContainerStyle: {
      backgroundColor: 'white',
    },
    HeaderStyle: {
      backgroundColor: 'red',
      indicatorColor: 'white',
      textColor: (focused: boolean) => focused ? 'white' : 'white',
      shadowColor: 'white',
    },
    BottomStyle: {
      textColor: (focused: boolean) => focused ? 'blue' : 'lightgrey',
    },
    LoadingStyle: {
      color: 'red',
    },
    NavBarStyle: {
      color: 'red',
    },
    VideoStyle: {
      textColor: (focused: boolean) => focused ? 'red' : 'black',
      indicatorColor: 'red',
      playerTextColor: (focused: boolean) => focused ? 'red' : 'white'
    },
    FollowButtonStyle: {
      backgroundColor: (followed: boolean) => followed ? 'lightgray' : 'red',
      rippleColor: 'red',
      textColor: (followed: boolean) => followed ? 'gray' : 'white'
    },
    RoundButtonStyle: {
      textColor: 'red',
    },
    DialogStyle: {
      textColor: 'red'
    },
    TabBarStyle: {
      textColor: (focused: boolean) => focused ? 'red' : 'black',
      indicatorColor: 'red',
    }
  },
  gold: {
    ContainerStyle: {
      backgroundColor: 'white',
    },
    HeaderStyle: {
      backgroundColor: 'gold',
      indicatorColor: 'black',
      textColor: (focused: boolean) => focused ? 'black' : 'black',
      shadowColor: 'white',
    },
    BottomStyle: {
      textColor: (focused: boolean) => focused ? 'gold' : 'lightgrey',
    },
    LoadingStyle: {
      color: 'gold',
    },
    NavBarStyle: {
      color: 'gold',
    },
    VideoStyle: {
      textColor: (focused: boolean) => focused ? 'gold' : 'black',
      indicatorColor: 'gold',
      playerTextColor: (focused: boolean) => focused ? 'gold' : 'black'
    },
    FollowButtonStyle: {
      backgroundColor: (followed: boolean) => followed ? 'lightgray' : 'gold',
      rippleColor: 'gold',
      textColor: (followed: boolean) => followed ? 'gray' : 'black'
    },
    RoundButtonStyle: {
      textColor: 'gold',
    },
    DialogStyle: {
      textColor: 'gold'
    },
    TabBarStyle: {
      textColor: (focused: boolean) => focused ? 'gold' : 'black',
      indicatorColor: 'gold',
    }
  }
}
const ThemeContext = createContext({ theme: theme.red, themeName: 'red', changeTheme: (name: keyof typeof theme) => { } });
export default ThemeContext;
export { theme };