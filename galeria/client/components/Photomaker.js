import React, { Component } from "react";
import * as MediaLibrary from "expo-media-library";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { Camera } from "expo-camera";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

class Photomaker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null, // przydzielone uprawnienia do używania kamery
      type: Camera.Constants.Type.back, // typ kamery
    };
  }

  upload = async (result) => {
    let ip = await SecureStore.getItemAsync("ip");
    let port = await SecureStore.getItemAsync("port");
    const data = new FormData();

    data.append("photo", {
      uri: result.uri,
      type: "image/jpeg",
      name: "img.jpg",

      //console.log(data)
    });
    //console.log(data)

    await fetch(`http://${ip}:${port}/upload`, {
      method: "POST",
      body: data,
    });
    ToastAndroid.showWithGravity(
      "file was sent",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  snedCropped = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      // formdata
      // fetch
      //console.log(result)
      this.upload(result);
    }
  };

  takePhoto = async () => {
    if (this.camera) {
      let foto = await this.camera.takePictureAsync();
      let asset = await MediaLibrary.createAssetAsync(foto.uri); // domyślnie zapisuje w folderze DCIM
      //alert(JSON.stringify(asset, null, 4))
      ToastAndroid.showWithGravity(
        "picture was succesfully taken",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      //console.log(this.props)
      this.props.route.params.refresh();
    }
  };

  componentDidMount = async () => {
    let { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasCameraPermission: status == "granted" });
  };

  render() {
    const { hasCameraPermission } = this.state; // podstawienie zmiennej ze state
    if (hasCameraPermission == null) {
      return <View />;
    } else if (hasCameraPermission == false) {
      return <Text>brak dostępu do kamery</Text>;
    } else {
      return (
        <View style={styles.main}>
          <Camera
            ref={(ref) => {
              this.camera = ref; // Uwaga: referencja do kamery używana później
            }}
            style={styles.main}
            type={this.state.type}
          >
            <View style={styles.buttonbox}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  })
                }
                style={styles.otherButtons}
              >
                <Text style={styles.otherButtons}>⟲</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.takePhoto}
                onPress={this.takePhoto}
              >
                <Text style={styles.takePhotoText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.otherButtons}
                onPress={this.snedCropped}
              >
                <Text style={styles.otherButtons}>✂</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

export default Photomaker;

const styles = StyleSheet.create({
  buttonbox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 0,
    marginTop: windowHeight - 250,
  },
  main: {
    //backgroundColor: 'red',
    flex: 1,
    display: "flex",
    flexDirection: "column-reverse",
    justifyContent: "center",
    width: windowWidth,
    height: windowHeight,
  },
  lowercasetext: {
    fontFamily: "myfont",
    fontSize: 30,
    textAlign: "center",
    color: "white",
  },
  takePhoto: {
    color: "blue",
    width: 150,
    fontSize: 150,
    height: 150,
    backgroundColor: "white",
    textAlign: "center",
    opacity: 0.6,
    borderRadius: 100,
  },
  takePhotoText: {
    color: "blue",
    fontSize: 150,
    textAlign: "center",
    marginTop: -35,
    opacity: 0.6,
    borderRadius: 100,
  },
  otherButtons: {
    color: "blue",
    width: 100,
    fontSize: 68,
    height: 100,
    backgroundColor: "black",
    textAlign: "center",
    opacity: 0.4,
    borderRadius: 50,
  },
});
