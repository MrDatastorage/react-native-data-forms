import React from "react";
import DatePicker from "react-native-datepicker";

export default ({ state, field, setState, value }) => {
  const date = state[field] !== null ? state[field] : value;

  return (
    <DatePicker
      style={{ width: 200 }}
      date={date}
      mode="datetime"
      placeholder="select date"
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      customStyles={{
        dateIcon: {
          position: "absolute",
          left: 0,
          top: 4,
          marginLeft: 0
        },
        dateInput: {
          marginLeft: 36,
          borderRadius: 20,
          backgroundColor: "#CCC",
          borderWidth: 0
        }
        // ... You can check the source to find the other keys.
      }}
      onDateChange={date => {
        setState({ [field]: date });
      }}
    />
  );
};
