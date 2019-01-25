import React from "react";

export type Field = {
  /**
   * REQUIRED. key of the field (should be the same as the key used in the values-prop of DataForm
   */
  field: string;

  /**
   * title of the field
   */
  title?: string;

  /**
   * some types require multiple titles
   */
  titles?: object;

  /**
   * type of the field, if not set, it uses a TextField
   */
  type?: string;

  /**
   * possible values of the field if it's a input type where you can choose between values
   */
  values?: string[] | Value[];

  /**
   * optional info for the component which is exposed via a clickable info icon
   */
  info?: string;

  /**
   * option description text
   */
  description?: string;

  /**
   * optional description component
   */
  descriptionComponent?: React.Node;

  /**
   * section title, if new section above this field. true if titleless section starts here
   */
  startSection?: string | boolean;

  /**
   * optionally, if its a new section, add an description
   */
  startSectionDescription?: string;

  /**
   * validate input and return if it's valid or not
   */
  validate?: (value: any) => boolean;

  /**
   * do something when the value changes
   */
  onChange?: (value: any) => void;

  /**
   * if it's invalid, show this error message
   */
  errorMessage?: string;

  /**
   * keys: output of Inputfield --> values: db-field (string) or db-fields (string[])
   */
  mapFieldsToDB?: object;

  /**
   * hide the input field based on all current values
   */
  hidden?: (allCurrentValues: object) => boolean;

  /**
   * add extra props to the specific field you want to pass to the input. you could also pass props just as properties of the main object, but this is the neater way.
   */
  passProps?: object;
};

export type DataFormProps = {
  /**
   * The fields in your data-form
   */
  fields: Field[];

  /**
   * Values object. keys should be the same as field.field prop.
   */
  values: Object;

  /**
   * Title of complete button
   */
  completeButton?: string;

  /**
   * Get the onComplete function to put it somewhere else, for example, in the navbar.
   */
  withComplete?: () => void;

  /**
   * Get the reset function to put it somewhere, for example, in the navbar.
   */
  withReset?: () => void;

  /**
   * background color code of complete button row
   */
  completeButtonBackground?: string;

  /**
   * Object where keys are inputtype names, and values are React.Node that's the Input component
   */
  inputTypes: Object;

  /**
   * FieldComponent: builds the field around the inputtype, for example adding a title, description, info, and a new section.
   */
  FieldComponent: React.Node;

  /**
   * If true, the form doesn't use a scrollview with flex of 1
   */
  noScroll?: boolean;

  /**
   * if true, all values are submitted on completion. Also unchanged ones
   */
  submitAll?: boolean;

  /**
   * mutation function. should return a promise with result data
   */
  mutate: (vars: Object) => Promise<any>;

  /**
   * what to do after mutate promise resolves
   */
  onComplete?: (data: object, values: object) => void;

  /**
   * if true, form sets values to undefined once completed
   */
  clearOnComplete?: boolean;
};

export type Value = {
  label: string;
  value: string | number;
};
