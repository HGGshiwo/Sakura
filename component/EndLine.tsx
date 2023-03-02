import {InfoText} from './Text';
import {View} from 'react-native';

const EndLine: React.FC<{}> = () => {
  return (
    <View style={{width: '100%', alignItems: 'center', paddingVertical: 20}}>
      <InfoText title="没有更多了~" />
    </View>
  );
};

export default EndLine;
