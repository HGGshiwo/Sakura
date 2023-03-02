import {ReactNode} from 'react';
import {BackButton} from './Button';
import {View, ViewStyle} from 'react-native';

interface Props {
  onPress: () => void;
  children: ReactNode;
  style?: ViewStyle;
}
const HeadBar: React.FC<Props> = ({onPress, children, style}) => {
  return (
    <View
      style={[{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        // paddingVertical: 15,
      }, style]}>
      <BackButton color="grey" onPress={onPress} />
      {children}
    </View>
  );
};

export default HeadBar;
