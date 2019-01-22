import React from "react";
import { Keyboard } from "react-native";

import { Value, DataFormProps } from "./types";
import { uniq } from "./utils";

import ImageScreen from "./screens/image.screen";
import CameraScreen from "./screens/camera.screen";
import LocationScreen from "./screens/location.screen";

import Form from "./form.component";

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

  render() {
    const props = {
      ...this.props,
      allCurrentValues: this.getAllCurrentValues(),
      setState: this.setState,
      state: this.state,
      saveValues: this.saveValues
    };

    return <Form {...props} />;
  }
}

export default DataForm;
