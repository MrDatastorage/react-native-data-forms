export type Value = { label: string; value: string | number };

export type Field = {
  description: string;
  descriptionComponent: React.Node;
  values: Value[] | undefined;
  startSection: string;
  errorMessage: string;
  startSectionDescription: string;
  field: string;
  mapFieldsToDB: object; // keys: output of Inputfield --> values: db-field (string) or db-fields (string[])
  title: string;
  type: string;
  hidden: (allCurrentValues: object) => boolean; //hide the input field based on all current values+state
};

export type InputProps = Field & {
  allCurrentValues: object;
  vectorIcons: object;
  expo: object;
  value: any;
  navigation: object;
  key: number;
  state: object;
  device: object;
  me: object;
  setState: (state: object) => void;
};
