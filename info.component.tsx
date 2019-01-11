import React from "react";
import { Alert, TouchableOpacity } from "react-native";

export default ({ info, vectorIcons }) => {
  const { FontAwesome } = vectorIcons;

  return (
    <TouchableOpacity onPress={() => Alert.alert("", info)}>
      <FontAwesome name="info-circle" />
    </TouchableOpacity>
  );
};
