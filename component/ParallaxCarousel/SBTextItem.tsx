import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { RecommandInfo } from "../../type/RecommandInfo";

interface Props {
  style?: StyleProp<ViewStyle>
  item: RecommandInfo
}

const SBTextItem: React.FC<Props> = ({ style, item }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={{ fontSize: 30, color: "black" }}>{item.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "red",
  },
});

export {SBTextItem}