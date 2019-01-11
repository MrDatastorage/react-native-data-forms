import React from "react";
import { Switch } from "react-native";

export default ({ state, field, setState, value }) => (
  <Switch
    value={state[field] !== null ? state[field] : value}
    onValueChange={x => setState({ [field]: x })}
  />
);
