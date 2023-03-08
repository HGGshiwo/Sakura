import {useEffect, useRef, useState} from 'react';
import {
  TouchableWithoutFeedback,
  View,
  PanResponder,
  useWindowDimensions,
} from 'react-native';

type Props = {
  onLongPress?: () => void;
  onPress?: () => void;
  onLongPressOut?: () => void;
  onDbPress?: () => void;
  onMoveX?: (x: number) => void;
  onLeftMoveY?: (y: number) => void;
  onRightMoveY?: (y: number) => void;
  onMoveXOut: () => void;
};

enum State {
  press, //短按
  longPress, //长按
  moveX, //沿着x轴移动
  moveY, //沿着y轴移动
}

const Blank: React.FC<Props> = ({
  onPress,
  onLongPressOut,
  onLongPress,
  onDbPress,
  onMoveX,
  onRightMoveY,
  onLeftMoveY,
  onMoveXOut,
}) => {
  const [longPressOut, setLongPressOut] = useState(false); //是否是longpress out
  const timer = useRef(-1);
  const delay = 200;
  const granted = useRef(true); //是否已经开始相应
  const state = useRef(State.press); //目前的状态
  const lastReleaseTime = useRef(0); //上一次释放的时间
  const layout = useWindowDimensions();
  const panResponder = useRef(
    PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        // gestureState.d{x,y} 现在会被设置为0
        granted.current = true;
        state.current = State.press;
      },

      onPanResponderMove: (evt, gestureState) => {
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}

        const {moveX, moveY, x0, y0} = gestureState;
        //按动时间过长，改变状态
        if (state.current === State.press) {
          if (Math.abs(moveX - x0) < 1 && Math.abs(moveY - y0) < 1) {
            state.current = State.longPress;
          } else if (Math.abs(moveX - x0) > Math.abs(moveY - y0)) {
            state.current = State.moveX;
          } else {
            state.current = State.moveY;
          }
        }
        if (state.current === State.longPress && onLongPress) {
          console.log('long press');
          onLongPress();
        }
        if (state.current === State.moveX && onMoveX) {
          onMoveX(moveX - x0);
        }
        if (state.current === State.moveY) {
          if (moveX < layout.width / 2 && onLeftMoveY) {
            onLeftMoveY(moveY - y0);
          } else if (moveX >= layout.width && onRightMoveY) {
            onRightMoveY(moveY - y0);
          }
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // 一般来说这意味着一个手势操作已经成功完成。
        granted.current = false;
        if (state.current === State.press) {
          if (evt.timeStamp - lastReleaseTime.current < delay) {
            if (timer.current !== -1) {
              //清除单机事件
              clearTimeout(timer.current);
              timer.current = -1;
            }
            //双击事件
            console.log('db');
            if (onDbPress) onDbPress();
          } else {
            //单击事件
            lastReleaseTime.current = evt.timeStamp;
            timer.current = setTimeout(() => {
              if (onPress) onPress();
              clearTimeout(timer.current);
              timer.current = -1;
            }, delay);
          }
        } else if (state.current === State.longPress) {
          if (onLongPressOut) onLongPressOut(); //长按事件结束
        } else if (state.current === State.moveX) {
          if (onMoveXOut) onMoveXOut(); //移动事件结束
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
        // 默认返回true。目前暂时只支持android。
        return true;
      },
    }),
  );

  useEffect(() => {
    return () => {
      if (timer.current !== -1) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return (
    <View
      {...panResponder.current.panHandlers}
      style={{position: 'absolute', width: '100%', top: 40, bottom: 40}}
    />
  );
};

export default Blank;
