# React Native Data Forms

Create beautiful forms that submit data to redux, a graphql mutation, or an api in many different input types

This component makes data from any source editable using react native components. The data can be of many different types. If you have an app with many data properties that need to be edited, this can be a huge boilerplate reducer! For me it was, at least. When I introduced it it instantly removed >1000 LOC in my codebase. Then, I doubled the amount of pages with only a few dozen LOC added. Without this component that would be thousands of LOC.

This component is built for mutations of React Apollo GraphQL, but it can potentially also be used together with local databases, redux, or even state!

The goal of this function is to seperate semantics from data from implementation of showing editable and savable database data from any mutation, where data can have any type.

## Documentation

## Example Use

**Step 1:** Create a wrapper of our component:
```js
import * as React from "react";

import _DataForm from "react-native-data-forms";
import { Field } from "react-native-data-forms/types";

// import extra input types, for example an emailsOrUsersInput type you created yourself that takes a text and suggests an email or users from your userbase.
import emailsOrUsers from "./fat/emailsOrUsersInput";

//if you want to use image upload, give a firebase Config here.
const firebaseConfig = {
  apiKey: "?????",
  authDomain: "?????",
  databaseURL: "?????",
  projectId: "??????",
  storageBucket: "?????",
  messagingSenderId: "?????"
};

// if you want to use the location input type, we need a google places key.
const googlePlacesConfig = {
  key: "?????"
};

// Create and export DataForms with default props installed.
const DataForm = props => {
  const allProps = {
    ...props,
    expo,
    vectorIcons,
    firebaseConfig,
    googlePlacesConfig,
    extraInputTypes: { emailsOrUsers }
  };
  return <_DataForm {...allProps} />;
};

export { DataForm };
```

**Step 2:** if you need the `location` or `image` type, you need to add the data-forms screens to your navigation stack where you want the image-screen and location-screen to load, like so:

```js
import { screens } from "react-native-data-forms";


const Stack = createStackNavigator(
  {
    root: { screen: HomeScreen },
    ...screens
  }
);

```

You're all set up! You can use the component like this: This is an example with all default types:

```js
import * as React from "react";
import { DataForm } from "../import";
import { Field } from "react-native-data-forms/types";
import { Alert } from "react-native";

class Example extends React.Component {
  render() {
    const defaultComplete = () => Alert.alert("Saved");

    // this could be an apollo mutation, an api call, or setting a redux state.
    const mutate = v =>
      new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve(v);
        }, 300);
      });

    const fields: Field[] = [
      {
        field: "coverImage",
        type: "coverImage"
      },

      {
        field: "image",
        type: "image",
        title: "Pick an image"
      },

      {
        field: "text",
        title: "Text"
        //default type is a text input
      },

      {
        field: "textArea",
        title: "Text Area",
        type: "textArea"
      },

      {
        field: "numbers",
        title: "Fill in Numbers here",
        type: "numbers"
      },

      {
        field: "phone",
        title: "Phone number",
        type: "phone"
      },

      {
        field: "date",
        title: "Date",
        type: "date"
      },

      {
        field: "STARTEND",
        titles: {
          start: "Start",
          end: "End"
        },
        mapFieldsToDB: {
          start: "eventAt",
          end: "eventEndAt"
        },
        startSection: true,
        type: "dates"
      },

      {
        startSection: true,
        field: "color",
        title: "Color",
        type: "color"
      },

      {
        field: "boolean",
        title: "Yes or no?",
        type: "boolean"
      },

      {
        startSection: true,
        field: "LOCATION",
        mapFieldsToDB: {
          address: "address",
          city: "city",
          mapsurl: "mapsurl",
          country: "country",
          latitude: "latitude",
          longitude: "longitude"
        },
        title: "Location",
        type: "location"
      },

      {
        field: "selectOne",
        title: "Select one option",
        type: "selectOne",
        values: [
          { value: 1, label: "option 1" },
          { value: 2, label: "option 2" },
          { value: 3, label: "option 3" }
        ]
      },

      {
        field: "selectMultiple",
        title: "Select multiple options",
        type: "selectMultiple",
        values: ["option 1 ", "option 2 ", "option 3"]
      },

      {
        field: "categories",
        title: "Fill in some categories",
        type: "categories"
      },

      {
        field: "dictionary",
        title: "Dictionary",
        type: "dictionary"
      }
    ];

    let values = {
      coverImage: null,
      image: null,
      text: "",
      textArea: "",
      numbers: "",
      phone: "",
      date: new Date(Date.now()),
      color: "",
      boolean: true,
      selectOne: "",
      selectMultiple: "",
      categories: "",
      dictionary: "",
      eventAt: new Date(Date.now()),
      eventEndAt: new Date(Date.now())
    };

    return (
      <DataForm
        {...this.props}
        fields={fields}
        onComplete={defaultComplete}
        mutate={vars => mutate(vars)}
        values={values}
      />
    );
  }
}

export default Example;

```

This will look like this:

<img src="/example1.png" width="480" />



### Props


All props:
```ts


type Firebase = {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
};

type GooglePlaces = {
  key: string;
};

type DataFormProps = {
  /**
   * The fields in your data-form
   */
  fields: Field[];

  /**
   * Values object. keys should be the same as field.field prop.
   */
  values: Object;

  /**
   * vectorIcons object
   */
  vectorIcons: Object;

  /**
   * expo object
   */
  expo: Object;

  /**
   * config for image inputs
   */
  firebaseConfig?: Firebase;

  /**
   * config for location input
   */
  googlePlacesConfig?: GooglePlaces;

  /**
   * Title of complete button
   */
  completeButton?: string;

  /**
   * background color code of complete button row
   */
  completeButtonBackground?: string;

  /**
   * Object where keys are inputtype names, and values are React.Node that's the Input component
   */
  extraInputTypes?: Object;

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

  /**
   * your navigation screenProps
   */
  screenProps: any;

  /**
   * your react-navigation prop
   */
  navigation: any;
};


```


**fields**: Array of Field-objects you want in the form. This is a field-object:

```ts
  type Field = {
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
};


 type Value = {
  label: string;
  value: string | number;
};

```

## Expanding

In the future, I'm planning to add these features to the codebase.

- Single Sign On with Google, Facebook, LinkedIn...
- Passwords
- Style properties
- Selecting and uploading multiple images/videos, 1 by 1
- File upload
- Step-by-step form functionality that walks through all inputs one by one, navigating to the next input using a stack navigator. This can be achieved by adding a walkThrough bool prop and a function getScreens that returns all Forms seperately in screens-objects which can be added to your stack-navigator dynamically.

If you want, you can create PR's for this (I'm not gonna do it):
- Wix navigation support
- bare react-native support


If anyone using this likes to contribute, please contact me so we can discuss about the way to implement things. [Here](https://karsens.com) you can find a contact button.

## Hire me
If you need consulting about whether or not it's possible to use this in your codebase - contact me - I'll advise you for free. If you need help to convert your codebase to use this library, I can help you with that. [Hire me](https://karsens.com/hire-me/). 
