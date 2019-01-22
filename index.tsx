import React from "react";

import {
  Text,
  ActivityIndicator,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  View,
  Keyboard
} from "react-native";

import { Value, DataFormProps } from "./types";
import { uniq } from "./utils";

import ImageScreen from "./screens/image.screen";
import CameraScreen from "./screens/camera.screen";
import LocationScreen from "./screens/location.screen";

import { C } from "./constants";
import Button from "./button.component";
import Input from "./input.component";

export const screens = {
  Location: {
    screen: LocationScreen
  },

  Image: {
    screen: ImageScreen
  },

  Camera: {
    screen: CameraScreen,
    navigationOptions: { header: null }
  }
};

const stringFromObjectArray = (a: Value[]) =>
  a ? a.map((v: Value) => `[${v.value}]`).join(",") : "";

type DataFormState = any;

class DataForm extends React.Component<DataFormProps, DataFormState> {
  constructor(props: DataFormProps) {
    super(props);
    this.saveValues = this.saveValues.bind(this); //to give props

    console.log("Go through constructor");

    this.init(props);
  }

  init(props: DataFormProps) {
    this.state = { loading: false };

    props.fields.forEach(field => {
      if (field.type === "textArea") {
        //TODO: for every textArea field, create a state like this.
        this.state[field.field] = "";
        this.state[`${field.field}currentPosition`] = [0, 0];
        this.state[`${field.field}selection`] = null;
        this.state[`${field.field}allowEditing`] = true;
      } else if (field.type === "categories") {
        this.state[field.field + "New"] = "";
      } else if (field.type === "dictionary") {
        this.state[field.field + "Symbol"] = "";
        this.state[field.field + "Meaning"] = "";
      } else if (field.type === "date") {
        this.state[field.field] = props.values[field.field];
      } else {
        this.state[field.field] = null;
      }
      // this.state[field.field] = props.values[field.field];
    });
  }

  saveValues = () => {
    const { fields, onComplete, submitAll } = this.props;

    // TODO: All custom state differences should be ported inside input type components itself, instead of here.....

    let values = submitAll ? this.getAllCurrentValues() : {};

    this.setState({ loading: true }, () => {
      Keyboard.dismiss(); //Hermes (@Dojo) reported a keyboard will stay open after pressing save and going to the next screen (sometimes). This should solve that.

      let error = false;

      fields.forEach(
        ({ field, type, mapFieldsToDB, validate, errorMessage }) => {
          if (type === "textArea") {
            if (this.state[field] !== "") {
              values[field] = this.state[field];
            }
          } else if (type === "selectMultiple") {
            if (this.state[field] !== null) {
              values[field] = stringFromObjectArray(this.state[field]);
              // console.log('selectMultiple: values[field] =', values[field]);
            }
          } else {
            if (mapFieldsToDB) {
              //if mapFieldsToDB is used, the field value itself is unimportant and probably unused
              values[field] = undefined;

              Object.keys(mapFieldsToDB).forEach(f => {
                const dbKey = mapFieldsToDB[f];

                if (this.state[f] !== null && this.state[f] !== undefined) {
                  if (Array.isArray(dbKey)) {
                    dbKey.forEach(oneKey => {
                      values[oneKey] = this.state[f];
                    });
                  } else {
                    values[dbKey] = this.state[f];
                  }
                }
              });
            } else {
              if (
                this.state[field] !== null &&
                this.state[field] !== undefined
              ) {
                values[field] = this.state[field];
              }
            }
          }

          if (validate && validate(this.state[field]) !== true) {
            error = true;
            console.log("ERROR");
            this.state[field + "Error"] = errorMessage;
          }
        }
      );

      if (!error) {
        console.log("values are now", values);
        this.props
          .mutate(values)
          .then(({ data }) => {
            this.setState({ loading: false }, () => {
              onComplete && onComplete(data, values);
              if (this.props.clearOnComplete) {
                const allFields = fields.reduce(
                  (result, f) => ({ ...result, [f.field]: undefined }),
                  {}
                );
                this.setState(allFields);
              }
            });
          })
          .catch(e => console.log("ERROR", e));
      } else {
        this.setState({ loading: false });
      }
    });
  };

  getAllCurrentValues() {
    const { fields, values } = this.props;

    const valueKeys = fields.map(field => field.field);
    const valueKeys2 = Object.keys(values);
    const reallyAllValueKeys = uniq(valueKeys.concat(valueKeys2));

    return (
      values &&
      reallyAllValueKeys
        .map(valueKey => {
          return {
            [valueKey]:
              this.state[valueKey] !== undefined &&
              this.state[valueKey] !== null
                ? this.state[valueKey]
                : values[valueKey]
          };
        })
        .reduce((all, current) => ({ ...all, ...current }), {})
    );
  }

  getValue(field, values) {
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

    return value;
  }

  renderSaveButton() {
    const { completeButtonBackground } = this.props;

    const completeButton = this.props.completeButton
      ? this.props.completeButton
      : "Save";

    return (
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
        {this.state.loading ? (
          <View style={{ marginLeft: 50 }}>
            <ActivityIndicator />
          </View>
        ) : (
          <Button title={completeButton} onPress={() => this.saveValues()} />
        )}
      </View>
    );
  }

  render() {
    const {
      navigation,
      fields,
      values,
      noScroll,
      expo,
      extraInputTypes,
      firebaseConfig,
      googlePlacesConfig
    } = this.props;

    const allFields = fields.map((field, index) => {
      const value = this.getValue(field, values);

      return value !== undefined ? (
        <Input
          {...field}
          allCurrentValues={this.getAllCurrentValues()}
          value={value}
          key={`index-${index}`}
          state={this.state}
          setState={newState => this.setState(newState)}
          //all props below are about config / navigating
          extraInputTypes={extraInputTypes}
          expo={expo}
          navigation={navigation}
          firebaseConfig={firebaseConfig}
          googlePlacesConfig={googlePlacesConfig}
        />
      ) : (
        <Text key={index}>{field.field} not found in data</Text>
      );
    });

    return noScroll ? (
      <View>
        {allFields}
        {this.renderSaveButton()}
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
        {this.renderSaveButton()}
      </KeyboardAvoidingView>
    );
  }
}

export default DataForm;
