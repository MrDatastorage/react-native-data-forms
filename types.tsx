export type Field = {
  field: string; //REQUIRED. key of the field (should be the same as the key used in the values-prop of DataForm
  title?: string; //title of the field
  titles?: object; // some types require multiple titles
  type?: string; //type of the field, if not set, it uses a TextField
  values?: Value[]; //possible values of the field if it's a input type where you can choose between values
  info?: string; // optional info for the component which is exposed via a clickable info icon
  description?: string; // optional description text
  descriptionComponent?: React.Node; //optional description component
  startSection?: string | boolean; //section title, if new section above this field. true if titleless section starts here
  startSectionDescription?: string; //optionally, if its a new section, add an description
  validate?: (value: any) => boolean; //validate input and return if it's valid or not
  onChange?: (value: any) => void; //do something when the value changes.
  errorMessage?: string; //if it's invalid, show this error message
  mapFieldsToDB?: object; // keys: output of Inputfield --> values: db-field (string) or db-fields (string[])
  hidden?: (allCurrentValues: object) => boolean; //hide the input field based on all current values
};

export type Value = {
  label: string;
  value: string | number;
};

export type InputProps = Field & {
  allCurrentValues: object;
  vectorIcons: object;
  expo: object;
  value: any;
  navigation: object;
  key: number;
  state?: object;
  device?: object;
  me?: object;
  setState?: (state: object) => void;
};
