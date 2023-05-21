import {ReactNode, useContext} from 'react';
import {View, ViewStyle, ActivityIndicator} from 'react-native';
import {LoadingText} from './Text';
import { ThemeContext } from '../context/ThemeContext';

interface Props {
  text?: string;
  style?: ViewStyle;
  show?: boolean;
  color?: string;
  backgroundColor?: string;
}

const LoadingBox: React.FC<Props> = ({
  text='加载中...',
  style,
  color = 'white',
  show = true,
}) => {
  
  return (
    <View
      style={[
        {
          display: show ? 'flex' : 'none',
          alignSelf: 'center',
        },
        style,
      ]}>
      <ActivityIndicator size={'large'} animating={show} color={color} />
      <LoadingText title={text} style={{color, paddingTop: 10}} />
    </View>
  );
};

interface ContainerProps extends Props {
  children: ReactNode;
  loading: boolean;
  containerStyle?: ViewStyle;
}
const LoadingContainer: React.FC<ContainerProps> = ({
  text = '加载中...',
  style,
  containerStyle,
  loading = false,
  children,
}) => {
  const {LoadingStyle} = useContext(ThemeContext).theme;
  return (
    <View style={[{flex: 1}, containerStyle]}>
      {!loading ? (
        children
      ) : (
        <LoadingBox
          text={text}
          style={style}
          color={LoadingStyle.color}
        />
      )}
    </View>
  );
};

export {LoadingBox, LoadingContainer};
