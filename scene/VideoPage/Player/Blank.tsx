import {useEffect, useRef, useState} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';

type Props = {
  onLongPress?: () => void;
  onPress?: () => void;
  onLongPressOut?: () => void;
  onDbPress?: () => void;
};

const Blank: React.FC<Props> = ({
  onPress,
  onLongPressOut,
  onLongPress,
  onDbPress,
}) => {
  const [longPressOut, setLongPressOut] = useState(false); //是否是longpress out
  const timer = useRef(-1);
  const lastTime = useRef(0)
  const delay = 200

  useEffect(() => {
    return () => {
      if (timer.current !== -1) {
        clearTimeout(timer.current);
      }
    };
  });

  const _onPressOut = () => {
    console.log('on press')
    //从长按返回
    if (longPressOut) {
      console.log('long press out')
      setLongPressOut(false);
      if (onLongPressOut) onLongPressOut();
      return;
    }

    //查看是否是双击
    const time = new Date().getTime();

    if (time - lastTime.current < 200) {
      if (timer.current !== -1) {
        clearTimeout(timer.current);
        timer.current = -1;
      }
      if (onDbPress) onDbPress();
    } else {
      lastTime.current = time;
      timer.current = setTimeout(() => { 
        if (onPress) onPress();
        clearTimeout(timer.current);
        timer.current = -1;
      }, 200);
    }
  };

  const _onLongPress = () => {
    setLongPressOut(true);
    if (onLongPress) onLongPress();
  };

  return (
    <TouchableWithoutFeedback
      style={{height: '100%'}}
      onLongPress={_onLongPress}
      onPressOut={_onPressOut}>
      <View
        style={{position: 'absolute', width: '100%', top: 40, bottom: 40}}
      />
    </TouchableWithoutFeedback>
  );
};

export default Blank;
