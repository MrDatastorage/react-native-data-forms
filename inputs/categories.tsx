import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View
} from "react-native";
import { FontAwesome } from "react-native-vector-icons";

class Categories extends React.Component {
  render() {
    const { state, field, setState, value, clearInput } = this.props;

    const currentValues2 =
      state[field] !== undefined
        ? state[field].split(", ")
        : value
        ? value.toString().split(", ")
        : [];
    const currentValues =
      currentValues2 && currentValues2.filter(v => v !== "");

    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            underlineColorAndroid="transparent"
            defaultValue=""
            autoCorrect={false}
            onChangeText={x => setState({ [field + "New"]: x })}
            style={[
              styles.input,
              { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
            ]}
            ref={ref => (this.textInput = ref)}
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

              const current = state[field] !== undefined ? state[field] : value;
              let addedState = current + ", " + state[field + "New"];

              const firstTwo = addedState.substring(0, 2);
              addedState =
                firstTwo === ", "
                  ? addedState.substring(2, addedState.length)
                  : addedState;

              setState({ [field]: addedState });
            }}
          >
            <Text style={{ fontSize: 24 }}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {currentValues &&
            currentValues.map((v, index) => {
              const vShort =
                v.length > 30
                  ? v.substring(0, 14) +
                    ".." +
                    v.substring(v.length - 14, v.length)
                  : v;

              return (
                <TouchableOpacity
                  onPress={() => {
                    const current =
                      state[field] !== undefined ? state[field] : value;

                    let removeState = current
                      .replace(", " + v, "")
                      .replace(", ,", ",")
                      .replace(v, "");

                    const firstTwo = removeState.substring(0, 2);
                    removeState =
                      firstTwo === ", "
                        ? removeState.substring(2, removeState.length)
                        : removeState;

                    setState({ [field]: removeState });
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

export default Categories;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
    paddingVertical: 3
  },

  b: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20
  },

  u: {
    textDecorationLine: "underline"
  },

  title: {
    fontWeight: "bold"
  },
  kav: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "royalblue"
  },
  input: {
    width: 200,
    height: 44,
    padding: 8,
    borderRadius: 22,
    backgroundColor: "#DDD"
  }
});
