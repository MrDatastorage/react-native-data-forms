import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView
} from "react-native";
import Photo from "./photo.screen";
import { MaterialIcons } from "react-native-vector-icons";

export default class GalleryScreen extends React.Component {
  state = {
    faces: {},
    images: {},
    photos: [],
    selected: []
  };

  constructor(props) {
    super(props);

    const { FileSystem } = this.props.navigation.state.params.expo;

    this.PHOTOS_DIR = FileSystem.documentDirectory + "photos";
  }

  componentDidMount = async () => {
    const { FileSystem } = this.props.navigation.state.params.expo;

    const photos = await FileSystem.readDirectoryAsync(this.PHOTOS_DIR);
    this.setState({ photos });
  };

  toggleSelection = (uri, isSelected) => {
    let selected = this.state.selected;
    if (isSelected) {
      selected.push(uri);
    } else {
      selected = selected.filter(item => item !== uri);
    }
    this.setState({ selected });
  };

  saveToGallery = async () => {
    const photos = this.state.selected;
    const { Permissions } = this.props.navigation.state.params.expo;

    if (photos.length > 0) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status !== "granted") {
        throw new Error("Denied CAMERA_ROLL permissions!");
      }

      const promises = photos.map(photoUri => {
        const { MediaLibrary } = this.props.navigation.state.params.expo;

        return MediaLibrary.createAssetAsync(photoUri);
      });

      await Promise.all(promises);
      alert("Successfully saved photos to user's gallery!");
    } else {
      alert("No photos to save!");
    }
  };

  renderPhoto = fileName => (
    <Photo
      key={fileName}
      uri={`${this.PHOTOS_DIR}/${fileName}`}
      onSelectionToggle={this.toggleSelection}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
            <MaterialIcons name="arrow-back" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.saveToGallery}>
            <Text style={styles.whiteText}>Save selected to gallery</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentComponentStyle={{ flex: 1 }}>
          <View style={styles.pictures}>
            {this.state.photos.map(this.renderPhoto)}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "white"
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4630EB"
  },
  pictures: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8
  },
  button: {
    padding: 20
  },
  whiteText: {
    color: "white"
  }
});
