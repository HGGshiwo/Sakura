import {FAB} from '@rneui/base';
import {ReactNode} from 'react';
import {View, ViewStyle} from 'react-native';
import {LoadingText} from './Text';

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
  backgroundColor = 'black',
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
      <FAB color={backgroundColor} loading size="small" />
      <LoadingText title={text} style={{color, paddingTop: 10}} />
    </View>
  );
};

interface ContainerProps extends Props {
  children: ReactNode;
  loading: boolean;
}
const LoadingContainer: React.FC<ContainerProps> = ({
  text = '加载中...',
  style,
  color = 'grey',
  backgroundColor = 'grey',
  loading = false,
  children,
}) => {
  return (
    <View style={{flex: 1}}>
      {!loading ? (
        children
      ) : (
        <LoadingBox
          text={text}
          style={style}
          color={color}
          backgroundColor={backgroundColor}
        />
      )}
    </View>
  );
};

export {LoadingBox, LoadingContainer};
