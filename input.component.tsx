import React from "react";

import { Text, View, Platform, StyleSheet } from "react-native";

import DatePicker from "./inputs/datepicker";
import Dates from "./inputs/dates";
import TextArea from "./inputs/textarea";
import Color from "./inputs/color";
import BooleanInput from "./inputs/boolean";
import SelectOne from "./inputs/selectone";
import SelectMultiple from "./inputs/selectmultiple";
import Categories from "./inputs/categories";
import Dictionary from "./inputs/dictionary";
import LocationInput from "./inputs/location";
import ImageInput from "./inputs/image";
import CoverImageInput from "./inputs/coverImage";
import TextDefaultInput from "./inputs/text";
import Numbers from "./inputs/numbers";
import Phone from "./inputs/phone";

import { InputProps } from "./types";
import Info from "./info.component";

class Input extends React.Component<InputProps> {
  constructor(props: InputProps) {
    super(props);

    this.setState = props.setState.bind(this);
  }

  clearInput(input) {
    if (input !== null) {
      input.clear();
      input._root && input._root.clear();
      if (Platform.OS === "ios") {
        input.setNativeProps({ text: " " });
        setTimeout(() => {
          input.setNativeProps({ text: "" });
        }, 5);
      }

      input.blur();
    }
  }

  render() {
    const {
      navigation,
      setState,
      mapFieldsToDB,
      state,
      value,
      title,
      titles,
      onChange,
      field,
      hidden,
      description,
      descriptionComponent,
      type,
      values,
      allCurrentValues,
      startSection,
      errorMessage,
      startSectionDescription,
      info,
      expo,
      extraInputTypes,
      googlePlacesConfig,
      firebaseConfig,
      extraProps
    } = this.props;

    //mainview has title, description, and an input field based on type

    let mainView = null;
    let isHidden = false;

    if (hidden && hidden(allCurrentValues)) {
      isHidden = true;
    }

    const inputProps = {
      state,
      field,
      onChange,
      title,
      setState: this.setState,
      setUpperState: setState,
      value,
      values,
      clearInput: this.clearInput,
      expo
    };

    let addedProps = {};

    if (type === "location") {
      addedProps = { navigation, googlePlacesConfig };
    } else if (type === "image" || type === "coverImage") {
      addedProps = { mapFieldsToDB, navigation, firebaseConfig };
    } else if (type === "dates") {
      addedProps = { mapFieldsToDB, titles };
    }

    const DEFAULT = TextDefaultInput;

    // when to use setState and when to use this.setState?
    const inputFields = {
      textArea: TextArea,
      date: DatePicker,
      dates: Dates,
      color: Color,
      boolean: BooleanInput,
      selectOne: SelectOne,
      selectMultiple: SelectMultiple,
      categories: Categories,
      dictionary: Dictionary,
      location: LocationInput,
      image: ImageInput,
      coverImage: CoverImageInput,
      numbers: Numbers,
      phone: Phone,
      text: DEFAULT,
      textInput: DEFAULT,
      ...extraInputTypes
    };

    const InputClass = type ? inputFields[type] : DEFAULT;

    if (InputClass && !isHidden) {
      const noTitleNeeded =
        !type ||
        type === "text" ||
        type === "textArea" ||
        type === "dates" ||
        type === "textInput" ||
        type === "numbers" ||
        type === "location" ||
        type === "phone";

      const noRowNeeded = type === "dates" || type === "coverImage";

      const inputField = (
        <InputClass {...inputProps} {...extraProps} {...addedProps} />
      );
      const maxWidth =
        type === "boolean" ? { width: info ? "60%" : "80%" } : undefined;

      const inputFieldCorrectWidth = info ? (
        <View style={{ width: type === "boolean" ? "20%" : "90%" }}>
          {inputField}
        </View>
      ) : (
        inputField
      );
      mainView = (
        <View style={styles.field}>
          {noRowNeeded ? (
            inputField
          ) : (
            <View style={styles.row}>
              {noTitleNeeded ? null : (
                <Text style={[styles.title, maxWidth]}>{title}</Text>
              )}

              {inputFieldCorrectWidth}

              {info ? <Info info={info} /> : null}
            </View>
          )}

          {description ? (
            <View style={styles.row}>
              <Text>{description}</Text>
            </View>
          ) : (
            undefined
          )}

          {descriptionComponent ? descriptionComponent : null}
          {state[field + "Error"] ? (
            <View style={styles.row}>
              <Text style={{ color: "red" }}>{errorMessage}</Text>
            </View>
          ) : null}
        </View>
      );
    }

    //section has startSection: string and startSectionDescription
    const section =
      startSection && !isHidden ? (
        <View style={styles.section}>
          {startSection.length > 0 ? (
            <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 20 }}>
              {startSection}
            </Text>
          ) : null}
          {startSectionDescription ? (
            <Text>{startSectionDescription}</Text>
          ) : null}
        </View>
      ) : (
        undefined
      );

    return (
      <View>
        {section}
        {mainView}
      </View>
    );
  }
}

export default Input;

const styles = StyleSheet.create({
  section: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 10
  },

  field: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCC"
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 3
  },

  title: {
    fontWeight: "normal"
  }
});
