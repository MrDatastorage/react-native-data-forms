import React from "react";

import {
  Platform,
  Image,
  View,
  TouchableOpacity,
  Linking,
  Alert
} from "react-native";
import { C } from "../constants";
import SuperImage from "react-native-super-image";
import Button from "../button.component";

//imageupload stuff
import * as firebase from "firebase";
import uuid from "uuid";

import SuperActionSheet, { Option } from "react-native-super-actionsheet";

class ImageScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: null,
      image: null,
      url: null
    };

    const firebaseConfig = this.props.navigation.state.params.firebaseConfig;

    firebase.initializeApp(firebaseConfig);

    const { IntentLauncherAndroid } = this.props.navigation.state.params.expo;

    this.BUTTONS = [
      {
        text: "Cancel",
        onPress: () => console.log("canceled"),
        style: "cancel"
      },
      {
        text: "Open Settings",
        onPress: () => {
          Platform.OS === "ios"
            ? Linking.openURL("app-settings:")
            : IntentLauncherAndroid.startActivityAsync(
                IntentLauncherAndroid.ACTION_APPLICATION_DETAILS_SETTINGS
              );
        },
        style: "default"
      }
    ];

    this.componentWillMount = this.componentWillMount.bind(this);

    // this.pickDocument = this.pickDocument.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.takePicture = this.takePicture.bind(this);
    this.pressEdit = this.pressEdit.bind(this);
  }

  componentWillMount() {
    this.setState({ url: this.props.navigation.state.params.url });
    this.props.navigation.setParams({ pressEdit: this.pressEdit });
  }

  componentDidMount() {
    const { url } = this.props.navigation.state.params;

    if (!url) {
      this.pressEdit();
    }
  }
  static navigationOptions = ({
    navigation: {
      state: { params }
    }
  }) => ({
    title: params.title !== undefined ? params.title : "Select a picture",
    headerRight: params.noEdit ? (
      undefined
    ) : (
      <Button onPress={() => params.pressEdit()} title="Edit" />
    )
  });

  uploadImageAsync = async uri => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log("XHR ERROR", e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = firebase
      .storage()
      .ref()
      .child(uuid.v4());
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };
  pickImage = async () => {
    const {
      Permissions,
      ImagePicker
    } = this.props.navigation.state.params.expo;

    const havePermission = await this.havePermission(Permissions.CAMERA_ROLL);

    if (havePermission) {
      //all good

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        base64: true
      });

      if (!result.cancelled) {
        this.uploadAndReturn(result.uri);
      }
    } else {
      Alert.alert(
        "Permission needed",
        "To select a picture, we need camera roll access",
        BUTTONS
      );
    }
  };

  async havePermission(type) {
    const { Permissions } = this.props.navigation.state.params.expo;

    const have = await Permissions.getAsync(type);

    if (have.status !== "granted") {
      const asked = await Permissions.askAsync(type);

      if (asked.status === "granted") {
        return true;
      } else {
        console.log("no permission. ", asked.status);
        return false;
      }
    } else {
      return true;
    }
  }

  uploadAndReturn = async url => {
    const { ImageManipulator } = this.props.navigation.state.params.expo;

    this.setState({ url }, async () => {
      this.props.navigation.state.params.onChange({ url, thumbUrl: url }); // local url

      this.props.navigation.goBack();

      //create thumb

      Image.getSize(
        url,
        async (width, height) => {
          const smallest = width < height ? width : height;

          let originX, originY;

          if (width > height) {
            originX = Math.round((width - height) / 2);
            originY = 0;
          } else {
            originX = 0;
            originY = Math.round((height - width) / 2);
          }

          const normal = await ImageManipulator.manipulate(
            url,
            [
              {
                resize: { width: 1024 }
              }
            ],
            {
              compress: 1,
              format: "jpeg",
              base64: false
            }
          );
          const thumb = await ImageManipulator.manipulate(
            url,
            [
              {
                crop: { originX, originY, width: smallest, height: smallest }
              },
              {
                resize: { width: 50 }
              }
            ],
            {
              compress: 1,
              format: "jpeg",
              base64: false
            }
          );

          const remoteThumbUrl = await this.uploadImageAsync(thumb.uri);
          const remoteUrl = await this.uploadImageAsync(normal.uri);

          this.props.navigation.state.params.onChange({
            url: remoteUrl,
            thumbUrl: remoteThumbUrl
          }); // now change to the remoteurl
        },
        error => console.log(error)
      );
    });
  };

  async takePicture() {
    const {
      expo,
      vectorIcons,
      expo: { Permissions }
    } = this.props.navigation.state.params;

    const havePermission = await this.havePermission(Permissions.CAMERA);

    if (havePermission) {
      //all good
      this.props.navigation.navigate({
        routeName: "Camera",
        key: "Camera",
        params: { withUrl: this.uploadAndReturn, expo, vectorIcons }
      });
    } else {
      Alert.alert(
        "Permission needed",
        "To take a picture, we need camera access",
        this.BUTTONS
      );
    }
  }
  pressEdit() {
    //open modal to choose Delete photo (if available), Take photo or Choose photo

    let options: Option[] = [];

    const { url, onChange } = this.props.navigation.state.params;

    let n = 0;

    if (url) {
      options.push({
        index: n++,
        title: "Delete picture",
        destructive: true,
        onPress: () => {
          onChange({ url: "", thumbUrl: "" });
          this.props.navigation.goBack();
        }
      });
    }

    options = options.concat([
      {
        index: n++,
        title: "Take picture",
        onPress: () => this.takePicture()
      },
      {
        index: n++,
        title: "Choose picture",
        onPress: () => this.pickImage()
      },
      { index: n++, cancel: true, title: "Cancel" }
    ]);

    this.openActionSheet(options);
  }

  openActionSheet(options) {
    this.setState({ options }, () => this.ActionSheet.show());
  }

  async saveImage() {
    const { url } = this.props.navigation.state.params;

    const {
      FileSystem,
      MediaLibrary,
      Permissions
    } = this.props.navigation.state.params.expo;

    const havePermission = await this.havePermission(Permissions.CAMERA_ROLL);

    if (havePermission) {
      FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + Date.now() + ".jpg"
      )
        .then(({ uri }) => {
          console.log("Finished downloading to ", uri);
          MediaLibrary.createAssetAsync(uri).catch(e => {
            console.log("err", e);
            Alert.alert("Failed to save image");
          });
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      Alert.alert(
        "Permission needed",
        "To download an image, we need camera roll access",
        this.BUTTONS
      );
    }
  }

  pressShare() {
    //open actionSheet to choose Copy or Save

    const options = [
      { index: 1, title: "Save picture", onPress: () => this.saveImage() },
      { index: 2, cancel: true, title: "Cancel" }
    ];

    return this.openActionSheet(options);
  }

  render() {
    const { url } = this.state;
    const {
      expo,
      vectorIcons: { FontAwesome }
    } = this.props.navigation.state.params;
    const rnActionSheet = (
      <SuperActionSheet
        reference={ref => (this.ActionSheet = ref)}
        data={this.state.options}
      />
    );

    console.log("url=", url);
    return url ? (
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <SuperImage
          expo={expo}
          style={{
            height: "95%",
            width: "100%",
            backgroundColor: "#DDD"
          }}
          resizeMode="contain"
          source={{ uri: url }}
        />

        <TouchableOpacity
          style={{ margin: 5 }}
          onPress={() => this.pressShare()}
        >
          <FontAwesome name="share" color={C.BUTTON_COLOR} />
        </TouchableOpacity>

        {rnActionSheet}
      </View>
    ) : (
      <View>{rnActionSheet}</View>
    );
  }
}

export default ImageScreen;
