import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { trim1 } from "../utils";

const objectArrayFromString = (s: string) =>
  s
    ? s
        .split(",")
        .filter((a: string) => a !== null)
        .map((s: string) => trim1(s))
        .map((s: string) => ({ label: s, value: s }))
    : [];

export default ({ state, field, setState, value, values, vectorIcons }) => {
  const { MaterialIcons } = vectorIcons;
  const objectified = objectArrayFromString(value);
  const current = state[field] ? state[field] : objectified;

  return (
    <View style={{ width: "100%", backgroundColor: "white" }}>
      {values &&
        values.map((value, index) => {
          const selected =
            current.filter(c => c.label === value)[0] !== undefined;
          const newState = selected
            ? current.filter(c => c.label !== value)
            : [...current, { label: value, value }];

          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setState({ [field]: newState });
              }}
              style={{
                height: 50,
                borderBottomColor: "#CCC",
                borderBottomWidth: 1,
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <MaterialIcons
                style={{ margin: 10 }}
                size={24}
                name={selected ? "check-box" : "check-box-outline-blank"}
              />
              <Text style={{ fontSize: 16 }}>{value}</Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};
