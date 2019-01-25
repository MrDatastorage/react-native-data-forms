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

import { DataFormProps } from "./types";
import { uniq } from "./utils";

import { C } from "./constants";
import Button from "./button.component";

type DataFormState = any;

class DataForm extends React.Component<DataFormProps, DataFormState> {
  constructor(props: DataFormProps) {
    super(props);
    this.saveValues = this.saveValues.bind(this); //to give props
    console.log("Go through constructor");
    this.state = { loading: false };
    props.fields.forEach(field => {
      this.state[field.field] = null;
      //actually, this should also initialize all mapFieldsToDB properties, right?
    });
  }

  renderInput = ({ field, value, key }) => {
    const { inputTypes, FieldComponent } = this.props;

    const isHidden = !!(
      field.hidden && field.hidden(this.getAllCurrentValues())
    );

    const inputProps = {
      state: this.state,
      setFormState: newState => this.setState(newState),
      value,
      ...field
    };

    const InputClass = field.type
      ? inputTypes[field.type]
      : inputTypes[Object.keys(inputTypes)[0]];

    if (InputClass && !isHidden) {
      const inputField = <InputClass {...inputProps} />;
      return FieldComponent({
        inputField,
        inputProps: { ...field },
        state: this.state,
        key
      });
    }

    console.log("inputclass && !ishidden is apparently false", isHidden);
    return null;
  };

  saveValues = () => {
    const { fields, onComplete, submitAll } = this.props;

    let values = submitAll ? this.getAllCurrentValues() : {};

    this.setState({ loading: true }, () => {
      Keyboard.dismiss(); //Hermes (@Dojo) reported a keyboard will stay open after pressing save and going to the next screen (sometimes). This should solve that.

      let error = false;

      fields.forEach(({ field, mapFieldsToDB, validate, errorMessage }) => {
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
          if (this.state[field] !== null && this.state[field] !== undefined) {
            values[field] = this.state[field];
          }
        }

        if (validate && validate(this.state[field]) !== true) {
          error = true;
          console.log("ERROR");
          this.state[field + "Error"] = errorMessage;
        }
      });

      if (!error) {
        console.log("values are now", values);
        this.props
          .mutate(values)
          .then(({ data }) => {
            //for api, state, dispatch support etc, the result should be taken based on mutationtype or so.

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
    const { fields, values, noScroll } = this.props;

    const allFields = fields.map((field, index) => {
      const value = this.getValue(field, values);

      return value !== undefined ? (
        this.renderInput({ field, value, key: `field-${index}` })
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
