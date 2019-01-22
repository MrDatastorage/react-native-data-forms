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

const Stack = createStackNavigator({
  root: { screen: HomeScreen },
  ...screens
});
```

You're all set up! You can use the component like this: This is an example with all default types, getting data from a GraphQL query, sendig it to a GraphQL mutation:

```js
import * as React from "react";
import { DataForm } from "../import";
import { Field } from "react-native-data-forms/types";
import { Alert } from "react-native";

class Example extends React.Component {
  render() {
    const { data, mutate } = this.props;

    const defaultComplete = () => Alert.alert("Saved");

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

    return (
      <DataForm
        {...this.props}
        fields={fields}
        onComplete={defaultComplete}
        mutate={vars => mutate(vars)}
        values={data.example}
      />
    );
  }
}

const query = gql`
  query Example {
    example {
      coverImage
      image
      text
      textArea
      numbers
      phone
      date
      color
      boolean
      selectOne
      selectMultiple
      categories
      dictionary
      eventAt
    }
  }
`;

const mutation = gql`
  mutation ExampleMutation(
    $coverImage: String
    $image: String
    $text: String
    $textArea: String
    $numbers: Int
    $phone: String
    $date: Date
    $color: String
    $boolean: Boolean
    $selectOne: String
    $selectMultiple: String
    $categories: String
    $dictionary: String
    $eventAt: Date
  ) {
    exampleMutation(
      coverImage: $coverImage
      image: $image
      text: $text
      textArea: $textArea
      numbers: $numbers
      phone: $phone
      date: $date
      color: $color
      boolean: $boolean
      selectOne: $selectOne
      selectMultiple: $selectMultiple
      categories: $categories
      dictionary: $dictionary
      eventAt: $eventAt
    )
  }
`;

export default compose(
  graphql(query),
  graphql(mutation)
)(Example);
```

This will look like this:

![1](./resources/data-forms-1.gif)
![2](./resources/data-forms-2.gif)
![3](./resources/data-forms-3.gif)

### Props

[See types-file](/types.tsx)

## Expanding

In the future, I'm planning to add these features to the codebase.

- Single Sign On with Google, Facebook, LinkedIn...
- Passwords
- Style properties
- Selecting and uploading multiple images/videos, 1 by 1
- File upload
- Step-by-step form functionality that walks through all inputs one by one, navigating to the next input using a stack navigator. This can be achieved by adding a walkThrough bool prop and a function getScreens that returns all Forms seperately in screens-objects which can be added to your stack-navigator dynamically.

If you want, you can create PR's for this:

- Wix navigation support
- bare react-native support

If anyone using this likes to contribute, please contact me so we can discuss about the way to implement things. [Here](https://karsens.com) you can find a contact button.

## Hire me

If you need consulting about whether or not it's possible to use this in your codebase - contact me - I'll advise you for free. If you need help to convert your codebase to use this library, I can help you with that. [Hire me](https://karsens.com/hire-me/).
