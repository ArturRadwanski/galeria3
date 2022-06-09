import React, { Component } from "react";
import { View, Text, Image, Button, ToastAndroid } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Dimensions } from "react-native";
import * as SecureStore from "expo-secure-store";
import { TouchableOpacity, StyleSheet } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const imageheighttocalc = windowHeight - 50;

class BigPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  share = () => {
    if (!Sharing.isAvailableAsync())
      return alert("sharing is imposible for some reason");

    Sharing.shareAsync(this.props.route.params.image);
  };

  delete = async () => {
    //console.log(this.props.route.params)
    await MediaLibrary.deleteAssetsAsync([this.props.route.params.deleteId]);
    this.props.route.params.refresh();
    this.props.navigation.navigate("s2", { a: 1, b: 2 });
  };

  upload = async () => {
    let ip = await SecureStore.getItemAsync("ip");
    let port = await SecureStore.getItemAsync("port");
    const data = new FormData();

    data.append("photo", {
      uri: this.props.route.params.image,
      type: "image/jpeg",
      name: "img.jpg",
    });
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

  render() {
    return (
      <View style={styles.root}>
        <Image
          resizeMode="cover"
          style={{
            width: Dimensions.get("window").width - 40,
            height: "80%",
            margin: 20,
            borderRadius: 20,
          }}
          source={{ uri: this.props.route.params.image }}
        />
        <View style={styles.buttonsPanel}>
          <TouchableOpacity onPress={this.share}>
            <Text style={styles.textButton}>SHARE</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.delete}>
            <Text style={styles.textButton}>DELETE</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.upload}>
            <Text style={styles.textButton}>UPLOAD</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "silver",
    height: "100%",
  },
  textButton: {
    color: "#202020",
    fontSize: 20,
  },
  buttonsPanel: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default BigPhoto;
