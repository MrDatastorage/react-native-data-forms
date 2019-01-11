import React from "react";
import { View, Text, TextInput } from "react-native";
export default ({ value, values, field, setState, state, title }) => {
  const currentValue = state[field] ? state[field] : value;

  return (
    <View style={{ width: "100%" }}>
      {currentValue ? <Text style={{ fontSize: 12 }}>{title}:</Text> : null}
      <TextInput
        placeholder={title}
        underlineColorAndroid="transparent"
        onChangeText={text =>
          setState({
            [field]: text,
            [`${field}allowEditing`]: true
          })
        }
        selection={state[`${field}selection`]}
        onSelectionChange={event =>
          setState({
            [`${field}cursorPosition`]: event.nativeEvent.selection,
            [`${field}selection`]: event.nativeEvent.selection,
            [`${field}allowEditing`]: true
          })
        }
        onSubmitEditing={() => {
          const query = state[field];
          const cursorPosition = state[`${field}cursorPosition`];

          let newText = query;
          const ar = newText.split("");
          cursorPosition && ar.splice(cursorPosition.start, 0, "\n");
          newText = ar.join("");
          if (
            cursorPosition &&
            cursorPosition.start === query.length &&
            query.endsWith("\n")
          ) {
            setState({ [field]: newText });
          } else if (state[`${field}allowEditing`]) {
            setState({
              [field]: newText,
              [`${field}selection`]: {
                start: cursorPosition && cursorPosition.start + 1,
                end: cursorPosition && cursorPosition.end + 1
              },
              [`${field}allowEditing`]: !state[`${field}allowEditing`]
            });
          }
        }}
        multiline={true}
        numberOfLines={10}
        blurOnSubmit={false}
        editable={true}
        defaultValue={value && value.toString()}
        style={{
          width: "100%",
          paddingVertical: 8,
          //borderRadius: 22,
          //backgroundColor: "#DDD",
          height: 150,
          textAlignVertical: "top"
        }}
      />
    </View>
  );
};
