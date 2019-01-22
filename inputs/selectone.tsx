import React from "react";
import { Platform, Picker, Text, View } from "react-native";
import ModalSelector from "react-native-modal-selector";
import { FontAwesome } from "react-native-vector-icons";

export default ({ state, field, setState, value, values }) => {
  const selectedIndex = state[field] !== null ? state[field] : Number(value);
  const selectedObject =
    values && values.filter(v => v.value === selectedIndex)[0];
  const selectedText = selectedObject
    ? selectedObject.label
    : "No selection made";

  return Platform.OS === "ios" ? (
    <ModalSelector
      style={{ width: "90%" }}
      data={(values && values.map(v => ({ ...v, key: v.value }))) || []}
      animationType="fade"
      onChange={option => {
        setState({ [field]: option.value });
      }}
      backdropPressToClose={true}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: "#DDD",
          borderRadius: 20,
          marginVertical: 10,
          paddingHorizontal: 15,
          height: 40,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row"
        }}
      >
        <Text style={{ fontSize: 16 }}>{selectedText}</Text>
        <FontAwesome
          name="caret-down"
          style={{ margin: 10, marginRight: 0 }}
          color="#404040"
          size={16}
        />
      </View>
    </ModalSelector>
  ) : (
    <Picker
      selectedValue={state[field] !== null ? state[field] : Number(value)}
      onValueChange={v => {
        setState({ [field]: v });
      }}
    >
      {values &&
        values.map(v => (
          <Picker.Item key={v.value} label={v.label} value={v.value} />
        ))}
    </Picker>
  );
};
