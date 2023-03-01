import {FAB} from '@rneui/base';
import {View, ViewStyle} from 'react-native';
import {LoadingText} from './Text';

type Props = {
  text: string;
  style?: ViewStyle;
  show?: boolean;
  color?: string;
  backgroundColor?: string;
};
const LoadingBox: React.FC<Props> = ({text, style, color='white',backgroundColor='black', show = true}) => {
  return (
    <View
      style={[
        {
          display: show ? 'flex' : 'none',
          alignSelf:'center',
        },
        style,
      ]}>
      <FAB color={backgroundColor} loading size="small" />
      <LoadingText title={text} style={{color, paddingTop: 10}} />
    </View>
  );
};

export default LoadingBox;
