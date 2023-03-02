import {ReactNode} from 'react';
import {BackButton} from './Button';
import {View} from 'react-native';

interface Props {
  onPress: () => void;
  children: ReactNode;
}
const HeadBar: React.FC<Props> = ({onPress, children}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15,
      }}>
      <BackButton color="grey" onPress={onPress} />
      {children}
    </View>
  );
};

export default HeadBar;
