import {
  faCloudArrowDown,
  faShare,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Pressable, View, ViewStyle} from 'react-native';
import {InfoText, SubInfoText} from './Text';
import {Transform, IconProp} from '@fortawesome/fontawesome-svg-core';
import {faQq, faWeixin} from '@fortawesome/free-brands-svg-icons';

type TextIconButtonProps = {
  title: string;
  icon: IconProp;
  onPress?: () => void;
  style?: ViewStyle;
};
const TextIconButton: React.FC<TextIconButtonProps> = ({
  title,
  icon,
  onPress,
  style,
}) => {
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          {alignItems: 'center', height: 40, justifyContent: 'space-between'},
          style,
        ]}>
        <FontAwesomeIcon color="grey" size={20} icon={icon} />
        <SubInfoText style={{fontSize: 12}} title={title} />
      </View>
    </Pressable>
  );
};

const ToolBar: React.FC<{}> = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        padding: 10,
        paddingHorizontal: 20,
      }}>
      <TextIconButton title="点赞" icon={faThumbsUp} />
      <TextIconButton
        style={{marginLeft: 40}}
        title="下载"
        icon={faCloudArrowDown}
      />
      <TextIconButton style={{marginLeft: 40}} title="分享" icon={faQq} />
      <TextIconButton style={{marginLeft: 40}} title="分享" icon={faWeixin} />
      <TextIconButton style={{marginLeft: 40}} title="分享" icon={faShare} />
    </View>
  );
};

export default TextIconButton;
