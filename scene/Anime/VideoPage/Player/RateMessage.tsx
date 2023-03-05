import {faForwardFast} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Text, View} from 'react-native';

interface Props {
  show: boolean;
}

const RateMessage: React.FC<Props> = ({show}) => {
  return (
    <View
      style={{
        display: show ? 'flex' : 'none',
        position: 'absolute',
        alignItems:'center',
        top: 45,
        width: '100%',
      }}>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems:'center',
          borderRadius: 5,
        }}>
        <FontAwesomeIcon color='white' icon={faForwardFast} />
        <Text style={{color: 'white', paddingLeft: 10}}>倍速播放中</Text>
      </View>
    </View>
  );
};

export {RateMessage};
