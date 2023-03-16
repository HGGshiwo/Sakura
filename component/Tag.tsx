import {faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Pressable, Text, View, ViewStyle} from 'react-native';

interface Props {
  text: string;
  onPress?: (data: any) => void;
  data?: any;
  style?: ViewStyle;
}

const Tag: React.FC<Props> = ({text, onPress, data, style}) => {
  return (
    <Pressable
      onPress={() => {
        onPress ? onPress(data) : null;
      }}>
      <View
        style={[
          {
            height: 30,
            borderRadius: 50,
            backgroundColor: '#E7E8E9',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 8,
          },
          style,
        ]}>
        <Text ellipsizeMode="tail" numberOfLines={1} style={{color: 'gray'}}>
          {text}
        </Text>
        <FontAwesomeIcon color="gray" icon={faChevronRight} />
      </View>
    </Pressable>
  );
};

export {Tag};
