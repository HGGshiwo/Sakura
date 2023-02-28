import {TextStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import {Text} from 'react-native'

const LoadingText: React.FC<{title: string; style?: TextStyle}> = ({
  title,
  style,
}) => {
  return (
    <Text
      style={[
        {
          color: 'white',
          elevation: 1,
        },
        style,
      ]}>
      {title}
    </Text>
  );
};

export {LoadingText}
