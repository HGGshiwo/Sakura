import React from "react";
import type { StyleProp, ViewStyle, ViewProps } from "react-native";
import { LongPressGestureHandler } from "react-native-gesture-handler";
import type { AnimateProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { RecommandInfo } from "../../type/RecommandInfo";

import {SBImageItem}  from "./SBImageItem";
import {SBTextItem}  from "./SBTextItem";

interface Props extends AnimateProps<ViewProps> {
  style?: StyleProp<ViewStyle>
  item: RecommandInfo
  pretty?: boolean
}

export const SBItem: React.FC<Props> = (props) => {
  const { style, item, pretty, testID, ...animatedViewProps } = props;
  const enablePretty = false;
  const [isPretty, setIsPretty] = React.useState(pretty || enablePretty);
  return (
    <LongPressGestureHandler
      onActivated={() => {
        setIsPretty(!isPretty);
      }}
    >
      <Animated.View testID={testID} style={{ flex: 1 }} {...animatedViewProps}>
        {isPretty
          ? (
            <SBImageItem style={style} item={item} />
          )
          : (
            <SBTextItem style={style} item={item} />
          )}
      </Animated.View>
    </LongPressGestureHandler>
  );
};