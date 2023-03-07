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
    LoadingStyle: {
      color: 'red',
    },
    NavBarStyle: {
      color: 'red',
    },
    VideoStyle: {
      textColor: (focused: boolean) => focused ? 'red' : 'black',
      indicatorColor: 'red',
    },
    FollowButtonStyle: {
      backgroundColor: (followed: boolean) => followed ? 'lightgray' : 'red',
      rippleColor: 'red',
      textColor: (followed: boolean) => followed ? 'gray' : 'white'
    },
    TabBarStyle: {
      textColor: (focused: boolean) => focused ? 'red' : 'black',
      indicatorColor: 'red',
    }
  }
}

export default theme;