import {
  faXmark,
  faChevronRight,
  faBars,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import {faHeart} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {ViewStyle, Pressable, StyleSheet, Text, View} from 'react-native';
import theme from '../theme';
const {FollowButtonStyle} = theme['red'];

interface Props {
  onPress?: (event: any) => void;
  style?: ViewStyle;
  title?: string;
}

const CloseButton: React.FC<Props> = ({onPress, style}) => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={{bottom: 10, top: 10, left: 10, right: 10}}>
      <FontAwesomeIcon style={style} icon={faXmark} />
    </Pressable>
  );
};

const TextButton: React.FC<Props> = ({title, onPress}) => {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <FontAwesomeIcon color="gray" size={10} icon={faChevronRight} />
      </View>
    </Pressable>
  );
};

interface FollowButtonProps extends Props {
  followed: boolean;
  onPress: () => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({onPress, followed}) => {
  return (
    <Pressable
      android_ripple={{color: FollowButtonStyle.rippleColor, radius: 30, borderless: false}}
      style={[
        {
          backgroundColor: FollowButtonStyle.backgroundColor(followed),
        },
        styles.buttonContainer,
      ]}
      onPress={() => {
        if (onPress) onPress();
      }}>
      <>
        <FontAwesomeIcon
          color={FollowButtonStyle.textColor(followed)}
          size={14}
          icon={followed ? faBars : faHeart}
        />
        <Text
          style={[styles.text, {color: FollowButtonStyle.textColor(followed)}]}>
          {followed ? '已' : ''}追番
        </Text>
      </>
    </Pressable>
  );
};

const RoundButton: React.FC<{text: string; style?: ViewStyle}> = ({
  text,
  style,
}) => {
  return (
    <View
      style={[
        styles.buttonContainer,
        {borderWidth: 1, borderColor: 'deeppink'},
        style,
      ]}>
      <Text style={[{color: 'deeppink'}]}>{text}</Text>
    </View>
  );
};

const BackButton: React.FC<{
  style?: ViewStyle;
  onPress: () => void;
  color?: string;
}> = ({style = {}, onPress, color = 'white'}) => {
  return (
    <Pressable
      hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
      onPress={onPress}>
      <FontAwesomeIcon style={style} color={color} icon={faChevronLeft} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    height: 28,
    width: 80,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 14,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 38,
    flexDirection: 'row',
  },
  title: {
    paddingRight: 2,
    color: 'gray',
  },
});

export {CloseButton, TextButton, RoundButton, FollowButton, BackButton};
