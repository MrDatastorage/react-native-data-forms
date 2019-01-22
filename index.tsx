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
            // } else if (type === "image") {
            //   if (mapFieldsToDB) {
            //     if (mapFieldsToDB.url) {
            //       if (Array.isArray(mapFieldsToDB.url)) {
            //         mapFieldsToDB.url.forEach(dbKey => {
            //           values[dbKey] = this.state[dbKey];
            //         });
            //       } else {
            //         values[mapFieldsToDB.url] = this.state[mapFieldsToDB.url];
            //       }
            //     }

            //     if (mapFieldsToDB.thumbUrl) {
            //       if (Array.isArray(mapFieldsToDB.thumbUrl)) {
            //         mapFieldsToDB.thumbUrl.forEach(dbKey => {
            //           values[dbKey] = this.state[dbKey];
            //         });
            //       } else {
            //         values[mapFieldsToDB.thumbUrl] = this.state[
            //           mapFieldsToDB.thumbUrl
            //         ];
            //       }
            //     }

            //     values.IMAGE = undefined;
            //   } else {
            //     values[field] = this.state[field];
            //   }
            // } else if (type === "dates") {
            //   if (field === "STARTEND") {
            //     if (mapFieldsToDB) {
            //       if (mapFieldsToDB.start && this.state[mapFieldsToDB.start])
            //         values[mapFieldsToDB.start] = this.state[mapFieldsToDB.start];
            //       if (mapFieldsToDB.end && this.state[mapFieldsToDB.end])
            //         values[mapFieldsToDB.end] = this.state[mapFieldsToDB.end];
            //     } else {
            //       values.start = this.state.start
            //         ? this.state.start
            //         : values.start;
            //       values.end = this.state.end ? this.state.end : values.end;
            //     }
            //   }
            // } else if (type === "location") {
            //   if (field === "LOCATION") {
            //     console.log("values are ", values, "state is", this.state);

            //     if (mapFieldsToDB) {
            //       if (mapFieldsToDB.address)
            //         values[mapFieldsToDB.address] = this.state.address;
            //       if (mapFieldsToDB.city)
            //         values[mapFieldsToDB.city] = this.state.city;
            //       if (mapFieldsToDB.country)
            //         values[mapFieldsToDB.country] = this.state.country;
            //       if (mapFieldsToDB.latitude)
            //         values[mapFieldsToDB.latitude] = this.state.latitude;
            //       if (mapFieldsToDB.longitude)
            //         values[mapFieldsToDB.longitude] = this.state.longitude;
            //       if (mapFieldsToDB.mapsurl)
            //         values[mapFieldsToDB.mapsurl] = this.state.mapsurl;
            //       if (mapFieldsToDB.locationIsEmpty)
            //         values[mapFieldsToDB.locationIsEmpty] =
            //           !this.state.latitude || !this.state.longitude;

            //       values.LOCATION = undefined;
            //     } else {
            //       values.address = values.LOCATION.address;
            //     }
            //   }
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
    const {
      completeButton,
      extraInputTypes,
      firebaseConfig,
      googlePlacesConfig,
      completeButtonBackground,
      noScroll,
      fields,
      values,
      expo,
      navigation
    } = this.props;

    const allCurrentValues = this.getAllCurrentValues();

    const props = {
      navigation,
      fields,
      values,
      extraInputTypes,
      noScroll,
      expo,
      allCurrentValues,
      setState: this.setState,
      state: this.state,
      completeButton,
      saveValues: this.saveValues,
      completeButtonBackground,
      firebaseConfig,
      googlePlacesConfig
    };

    return <Form {...props} setState={x => this.setState(x)} />;
  }
}

export default DataForm;
