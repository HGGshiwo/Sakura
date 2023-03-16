import Toast from 'react-native-root-toast';

const alert = (text: string) => {
  Toast.show(text, {
    backgroundColor: 'black',
    textStyle: {fontSize: 14, color: 'white'},
    duration: 1000,
    position: -100,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
  });
};

export default alert;
