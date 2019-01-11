import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";

class Dictionary extends React.Component {
  render() {
    const {
      value,
      state,
      setState,
      setUpperState,
      field,
      clearInput,
      vectorIcons
    } = this.props;
    // text
    const { FontAwesome } = vectorIcons;

    const currentValues2 =
      state[field] !== undefined
        ? state[field].split(", ")
        : value
        ? value.toString().split(", ")
        : [];
    const currentValues1 = currentValues2.filter(v => v !== "");
    const currentValues = currentValues1.map(v => {
      const vSplitted = v.split("=");
      return { symbol: vSplitted[0], meaning: vSplitted[1] };
    });

    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            underlineColorAndroid="transparent"
            defaultValue=""
            autoCorrect={false}
            placeholder="Symbol"
            onChangeText={x => setState({ [field + "Symbol"]: x })}
            style={{
              width: 80,
              height: 44,
              padding: 8,
              borderRadius: 22,
              backgroundColor: "#DDD",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0
            }}
            ref={ref => (this.textInput = ref)}
          />
          <View
            style={{
              height: 44,
              backgroundColor: "#AAA",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 24 }}>=</Text>
          </View>
          <TextInput
            underlineColorAndroid="transparent"
            defaultValue=""
            placeholder="Meaning"
            autoCorrect={false}
            onChangeText={x => setState({ [field + "Meaning"]: x })}
            style={{
              width: 100,
              height: 44,
              padding: 8,
              backgroundColor: "#DDD"
            }}
            ref={ref => (this.textInput2 = ref)}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#AAA",
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              width: 30
            }}
            onPress={() => {
              clearInput(this.textInput);
              clearInput(this.textInput2);

              const current = state[field] !== undefined ? state[field] : value;
              let addedState =
                current +
                ", " +
                state[field + "Symbol"] +
                "=" +
                state[field + "Meaning"];

              const firstTwo = addedState.substring(0, 2);
              addedState =
                firstTwo === ", "
                  ? addedState.substring(2, addedState.length)
                  : addedState;

              setUpperState({ [field]: addedState });
            }}
          >
            <Text style={{ fontSize: 24 }}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {currentValues.map((v, index) => {
            const vShort = v.symbol + " " + v.meaning;

            return (
              <TouchableOpacity
                onPress={() => {
                  const current =
                    state[field] !== undefined ? state[field] : value;

                  const vText = v.symbol + "=" + v.meaning;

                  let removeState = current
                    .replace(", " + vText, "")
                    .replace(", ,", ",")
                    .replace(vText, "");

                  const firstTwo = removeState.substring(0, 2);
                  removeState =
                    firstTwo === ", "
                      ? removeState.substring(2, removeState.length)
                      : removeState;

                  console.log(
                    "current = '" +
                      current +
                      "', removeSTate='" +
                      removeState +
                      "'"
                  );

                  setUpperState({ [field]: removeState });
                }}
                key={`index-${index}`}
                style={{
                  backgroundColor: "#CCC",
                  borderRadius: 15,
                  height: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 3,
                  paddingVertical: 3,
                  paddingHorizontal: 10,
                  flexDirection: "row"
                }}
              >
                <Text>{vShort}</Text>
                <FontAwesome
                  style={{ marginLeft: 10 }}
                  name="remove"
                  size={12}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}
export default Dictionary;
