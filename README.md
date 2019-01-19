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
class ExampleScreen extends React.Component {

  render() {
    const {
      navigation,
      screenProps: {
        data: { me }
      },
      navigation: {
        state: { params }
      }
    } = this.props;

    const { createChannel, editId } = params;

    const defaultComplete = () => navigation.goBack();

    const fields: Field[] = [];

    fields.push({
      field: "coverImage",
      type: "coverImage",
      title: "Cover Image"
    });

    if (params.isEvent) {
      fields.push({
        field: "title",
        title: "Title"
      });
    }

    fields.push({
      field: "text",
      title: this.props.navigation.state.params.isEvent
        ? "Tell people more about the event"
        : `What's going on, ${me && me.username}?`,
      type: "textArea"
    });

    if (params.isEvent) {
      fields.push({
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
      });

      fields.push({
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
      });

      fields.push({
        info: "Leave empty if there is no maximum",
        field: "maxParticipants",
        title: "Max participants"
      });

      fields.push({
        field: "price",
        info: "Leave empty if there is no price",
        title: "Price"
      });

      fields.push({
        field: "ticketLink",
        title: "Link to buy tickets"
      });
    }

    if (me.level > 1 && !params.editId) {
      fields.push({
        field: "sendPush",
        title: "Send push notification",
        type: "boolean"
      });
      fields.push({
        field: "sendEmail",
        title: "Send emails",
        type: "boolean"
      });
    }

    if (me.isAdmin) {
      fields.push({
        field: "sendEmailFromAdmin",
        title: "Admin mass email",
        info: "Email this post to everyone in all of Communify (Admin-only)",
        type: "boolean"
      });
    }

    let values =
      params && params.channel
        ? {
            ...params.channel,
            sendPush: false,
            sendEmailFromAdmin: false,
            sendEmail: false
          }
        : {
            title: "",
            text: "",
            coverImage: "",
            maxParticipants: null,
            price: null,
            ticketLink: "",
            sendPush: false,
            sendEmailFromAdmin: false,
            sendEmail: false
          };

    if (params.isEvent) {
      values =
        params && params.channel
          ? {
              ...values,
              eventAt: new Date(params.channel.eventAt),
              eventEndAt: new Date(params.channel.eventEndAt)
            }
          : {
              ...values,
              eventAt: nextHour(new Date(Date.now())),
              eventEndAt: nextHour(nextHour(new Date(Date.now())))
            };
    }

    const mutation = vars => {
      return createChannel({ ...vars, editId });
    };

    return (
      <DataForm
        submitAll
        fields={fields}
        onComplete={defaultComplete}
        mutate={mutation}
        completeButton="Create"
        values={values}
        {...this.props}
      />
    );
  }
}

export default CreateChannelScreen;
```

This will look like this:

<img src="/example1.png" width="250" />



### Props

**fields**: Array of fields you want in the form. This is a field-object:

```ts
type Field = {
  field: string; //REQUIRED. key of the field (should be the same as the key used in the values-prop of DataForm
  title?: string; //title of the field
  type?: string; //type of the field, if not set, it uses a TextField
  values?: Value[]; //possible values of the field if it's a input type where you can choose between values
  description?: string;// optional description text
  descriptionComponent?: React.Node;//optional description component
  startSection?: string;//section title, if new section above this field
  startSectionDescription?: string;//optionally, if its a new section, add an description
  validate?: (value) => boolean;//validate input and return if it's valid or not 
  errorMessage?: string;//if it's invalid, show this error message
  mapFieldsToDB?: object; // keys: output of Inputfield --> values: db-field (string) or db-fields (string[])
  hidden?: (allCurrentValues: object) => boolean; //hide the input field based on all current values
};

type Value = { 
    label: string; 
    value: string | number
};
```

Other props:
```js

  values: object;
  vectorIcons: Object; //react-native-vector-icons from expo
  expo: Object; // expo object
  firebaseConfig?: Firebase;
  googlePlacesConfig?: GooglePlaces;
  completeButton?: string;
  completeButtonBackground?: string; // color code
  extraInputTypes?: React.Node[];
  noScroll?: boolean;
  submitAll?: boolean;
  onComplete?: () => void;
  mutate: (vars: Object) => any;
  screenProps: any;
  navigation: any;


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
If you need consulting about whether or not it's possible to use this in your codebase - contact me - I'll help you for free. If you need help to convert your codebase to use this library, I can help you with that. [Hire me](https://karsens.com/hire-me/). 
