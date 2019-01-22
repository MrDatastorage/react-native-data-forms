import React from "react";
import {
  Text,
  ActivityIndicator,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  View
} from "react-native";
import { C } from "./constants";
import Button from "./button.component";
import Input from "./input.component";

class FormComponent extends React.Component {
  render() {
    const {
      navigation,
      completeButtonBackground,
      saveValues,
      fields,
      values,
      noScroll,
      expo,
      allCurrentValues,
      setState,
      state,
      extraInputTypes,
      firebaseConfig,
      googlePlacesConfig
    } = this.props;

    const completeButton = this.props.completeButton
      ? this.props.completeButton
      : "Save";

    const allFields = fields.map((field, index) => {
      let value;

      if (field.mapFieldsToDB) {
        const dbKeys = Object.values(field.mapFieldsToDB);
        value = dbKeys.reduce((all, current) => {
          const key = Array.isArray(current) ? current[0] : current;
          return { ...all, [key]: values[key] };
        }, {});
      } else {
        value = values[field.field];
      }

      return value !== undefined ? (
        <Input
          {...field}
          allCurrentValues={allCurrentValues}
          value={value}
          key={index}
          state={state}
          setState={newState => setState(newState)}
          //all props below are about config / navigating
          navigation={navigation}
          extraInputTypes={extraInputTypes}
          expo={expo}
          firebaseConfig={firebaseConfig}
          googlePlacesConfig={googlePlacesConfig}
        />
      ) : (
        <Text key={index}>{field.field} not found in data</Text>
      );
    });

    const saveButton = (
      <View
        style={{
          height: 50,
          alignItems: "flex-end",
          justifyContent: "center",
          paddingRight: 20,
          backgroundColor: completeButtonBackground
            ? completeButtonBackground
            : "#ecf0f1"
        }}
      >
        {state.loading ? (
          <View style={{ marginLeft: 50 }}>
            <ActivityIndicator />
          </View>
        ) : (
          <Button title={completeButton} onPress={() => saveValues()} />
        )}
      </View>
    );

    return noScroll ? (
      <View>
        {allFields}
        {saveButton}
      </View>
    ) : (
      <KeyboardAvoidingView
        style={{
          height: "100%",
          backgroundColor: "#DDD"
        }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 75}
      >
        <ScrollView
          keyboardShouldPersistTaps={"handled"}
          style={{
            backgroundColor: C.BG_COLOR
          }}
        >
          {allFields}
        </ScrollView>
        {saveButton}
      </KeyboardAvoidingView>
    );
  }
}

export default FormComponent;
