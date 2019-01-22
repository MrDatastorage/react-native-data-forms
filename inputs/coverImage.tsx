import React from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Text
} from "react-native";
import SuperImage from "react-native-super-image";
import { FontAwesome } from "react-native-vector-icons";

const HEIGHT = 200;

type ImageObject = {
  url: string;
  thumbUrl: string;
};

export default ({
  value,
  state,
  setUpperState,
  navigation,
  mapFieldsToDB,
  field,
  expo,
  firebaseConfig
}) => {
  if (!expo) return <Text>This input-type only works with expo</Text>;

  let urlState, urlValue, thumbState, thumbValue;
  const urlFields: string | string[] = mapFieldsToDB && mapFieldsToDB.url;
  const thumbUrlField = mapFieldsToDB && mapFieldsToDB.thumbUrl;

  if (mapFieldsToDB) {
    const firstField: string = Array.isArray(urlFields)
      ? urlFields[0]
      : urlFields;

    thumbState = state[thumbUrlField];
    thumbValue = value[thumbUrlField];

    urlState = state[firstField];
    urlValue = value[firstField];
  } else {
    urlState = state[field];
    urlValue = value;
  }

  const currentThumb = thumbState ? thumbState : thumbValue;
  const currentUrl = urlState ? urlState : urlValue;
  const thumbOrNormalUrl = currentThumb ? currentThumb : currentUrl;

  const isUploaded = currentUrl && currentUrl.substring(0, 4) === "http";

  const onChange = (newImage: ImageObject) => {
    console.log("got a new image:", newImage);

    const newUrlState = urlFields
      ? Array.isArray(urlFields)
        ? urlFields.reduce((all, current) => {
            return { ...all, [current]: newImage.url };
          }, {})
        : { [urlFields]: newImage.url }
      : { [field]: newImage.url };

    const newThumbState = thumbUrlField
      ? { [thumbUrlField]: newImage.thumbUrl }
      : {};

    const newState = Object.assign(newUrlState, newThumbState);
    console.log("newState", newState);

    setUpperState(newState);
  };

  return (
    <View style={{ width: "100%" }}>
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();

          setTimeout(() => {
            navigation.navigate({
              key: "Image",
              routeName: "Image",
              params: {
                url: currentUrl,
                onChange,
                expo,
                firebaseConfig
              }
            });
          }, 100); //timeout needed because keyboard needs to be dismissed, it goes wrong with asynchronicity
        }}
      >
        {currentUrl ? (
          <View
            style={{
              width: "100%",
              height: HEIGHT,
              backgroundColor: "#CCC",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <SuperImage
              expo={expo}
              source={{ uri: currentUrl }}
              style={{ width: "100%", height: HEIGHT }}
              resizeMode="cover"
            />

            {isUploaded ? null : (
              <View style={{ position: "absolute" }}>
                <ActivityIndicator />
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              paddingHorizontal: 15,
              paddingVertical: 10,
              justifyContent: "center"
            }}
          >
            <FontAwesome name="camera" size={16} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
