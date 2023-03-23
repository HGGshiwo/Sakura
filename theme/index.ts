import { createContext } from "react";

type AppTheme = Record<string, { 
  ContainerStyle: any, 
  HeaderStyle: any, 
  BottomStyle: any, 
  LoadingStyle: any, 
  NavBarStyle: any, 
  VideoStyle: any, 
  FollowButtonStyle: any,
  RoundButtonStyle: any,
  DialogStyle: any,
  TabBarStyle: any, 
}>;

const appTheme: AppTheme = {
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
      backgroundColor: 'white',
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
      textColor: 'white',
      backgroundColor: 'red',
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
      backgroundColor: 'white',
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
      backgroundColor: 'white',
      indicatorColor: 'mediumvioletred',
      textColor: (focused: boolean) => focused ? 'mediumvioletred' : 'grey',
      shadowColor: 'white',
    },
    BottomStyle: {
      textColor: (focused: boolean) => focused ? 'black' : 'grey',
      backgroundColor: 'white',
    },
    LoadingStyle: {
      color: 'mediumvioletred',
    },
    NavBarStyle: {
      color: 'mediumvioletred',
    },
    VideoStyle: {
      textColor: (focused: boolean) => focused ? 'mediumvioletred' : 'black',
      indicatorColor: 'mediumvioletred',
      playerTextColor: (focused: boolean) => focused ? 'mediumvioletred' : 'white'
    },
    FollowButtonStyle: {
      backgroundColor: (followed: boolean) => followed ? 'lightgray' : 'mediumvioletred',
      rippleColor: 'grey',
      textColor: (followed: boolean) => followed ? 'gray' : 'white'
    },
    RoundButtonStyle: {
      textColor: 'mediumvioletred',
      backgroundColor: 'white',
    },
    DialogStyle: {
      textColor: 'black'
    },
    TabBarStyle: {
      textColor: (focused: boolean) => focused ? 'black' : 'grey',
      indicatorColor: 'black',
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
      textColor: (focused: boolean) => focused ? 'black' : 'lightgrey',
      backgroundColor: 'white',
    },
    LoadingStyle: {
      color: 'gold',
    },
    NavBarStyle: {
      color: 'orange',
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
      textColor: 'black',
      backgroundColor: 'gold',
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

export default appTheme;
export type { AppTheme }