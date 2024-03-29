import {
  faXmark,
  faChevronRight,
  faBars,
  faChevronLeft,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import {faHeart} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {ViewStyle, Pressable, StyleSheet, Text, View} from 'react-native';
import {useContext} from 'react';
import React from 'react';
import useTheme from '../zustand/Theme';

interface Props {
  onPress?: (event: any) => void;
  style?: ViewStyle;
  title?: string;
  theme?: string;
  icon?: IconDefinition;
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

const FollowButton: React.FC<FollowButtonProps> = React.memo(
  ({onPress, followed}) => {
    const {FollowButtonStyle} = useTheme().theme;
    return (
      <Pressable
        android_ripple={{
          color: FollowButtonStyle.rippleColor,
          radius: 30,
          borderless: false,
        }}
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
            style={[
              styles.text,
              {color: FollowButtonStyle.textColor(followed)},
            ]}>
            {followed ? '已' : ''}追番
          </Text>
        </>
      </Pressable>
    );
  },
);

const RoundButton: React.FC<Props> = ({title, style, onPress}) => {
  const {RoundButtonStyle} = useTheme().theme;
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.buttonContainer,
          {
            width: 60,
            height: 35,
            backgroundColor: RoundButtonStyle.backgroundColor,
          },
          style,
        ]}>
        <Text style={[{color: RoundButtonStyle.textColor}]}>{title}</Text>
      </View>
    </Pressable>
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

const NavBarButton: React.FC<Props> = ({onPress, title, icon, style}) => {
  const {NavBarStyle} = useTheme().theme;
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.itemContainer, style]}>
        <FontAwesomeIcon color={NavBarStyle.color} size={25} icon={icon!} />
        <Text style={{fontSize: 12, paddingTop: 5}}>{`${title}`}</Text>
      </View>
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
  itemContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export {
  CloseButton,
  TextButton,
  RoundButton,
  FollowButton,
  BackButton,
  NavBarButton,
};
