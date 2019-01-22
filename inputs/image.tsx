import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard
} from "react-native";
import SuperImage from "react-native-super-image";

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

  const currentThumb =
    thumbState !== undefined && thumbState !== null ? thumbState : thumbValue;
  const currentUrl =
    urlState !== undefined && urlState !== null ? urlState : urlValue;
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
    <View>
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
          }, 100); //needed timeout to dismiss keyboard
        }}
      >
        {currentUrl ? (
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: "#CCC",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <SuperImage
              expo={expo}
              source={{ uri: thumbOrNormalUrl }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
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
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: "#CCC",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text>Upload Image</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
