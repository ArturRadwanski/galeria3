import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Dimensions } from "react-native";
import * as SecureStore from "expo-secure-store";
import PhotoItem from "./PhotoItem";

let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;

class DefaultScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isColumn: false,
      photosLoaded: false,
      photos: null,
      selected: [],
    };
  }

  handleSend = async () => {
    let ip = await SecureStore.getItemAsync("ip");
    let port = await SecureStore.getItemAsync("port");
    const data = new FormData();

    if (this.state.selected == []) return alert("nothibg is selected");
    this.state.photos.assets.map((element) => {
      if (this.state.selected.includes(element.id)) {
        data.append("photo", {
          uri: element.uri,
          type: "image/jpeg",
          name: "img.jpg",
        });
      }
    });
    console.log(data);

    await fetch(`http://${ip}:${port}/upload`, {
      method: "POST",
      body: data,
    });
    ToastAndroid.showWithGravity(
      "files were sent",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  handleDeleteSelected = async () => {
    console.log(this.state.selected);
    await MediaLibrary.deleteAssetsAsync(this.state.selected);
    this.setState({ selected: [] });
    this.checkperms();
  };

  handleSelect = (element) => {
    let newSel = [...this.state.selected];
    if (this.state.selected.includes(element.id)) {
      newSel.splice(newSel.indexOf(element.id), 1);
    } else {
      newSel.push(element.id);
    }
    this.setState({ selected: newSel });
  };

  changelist = () => {
    if (this.state.isColumn == true) {
      this.setState({ isColumn: false });
    } else {
      this.setState({ isColumn: true });
    }
  };

  async checkperms() {
    let { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("brak uprawnień do czytania image-ów z galerii");
      this.setState({ photosLoaded: false });
      this.checkperms();
    }

    this.loadphotos();
  }

  componentDidMount = async () => {
    this.checkperms();
  };

  async loadphotos() {
    try {
      let album = await MediaLibrary.getAlbumAsync("DCIM");

      let obj = await MediaLibrary.getAssetsAsync({
        album: album,
        first: 100,
        mediaType: ["photo"],
      });

      this.setState({ photos: obj });
      this.setState({ photosLoaded: true });
    } catch (error) {
      this.checkperms();
    }
  }

  render() {
    return this.state.photosLoaded ? (
      <View style={styles.root}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity onPress={this.changelist}>
            <Text style={styles.button}>GRID / LIST</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleSend}>
            <Text style={styles.button}>SEND SELECTED</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("Camera", {
                refresh: this.checkperms.bind(this),
              })
            }
          >
            <Text style={styles.button}>OPEN CAMERA</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleDeleteSelected}>
            <Text style={styles.button}>REMOVE SELECTED</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("serverselector")}
          >
            <Text style={styles.button}>IP SELECTOR</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.photos.assets}
          numColumns={this.state.isColumn ? 1 : 4}
          style={styles.list}
          key={this.state.isColumn ? 1 : 4}
          renderItem={({ item }) => (
            <PhotoItem
              selected={this.state.selected.includes(item.id)}
              select={() => this.handleSelect(item)}
              width={this.state.isColumn}
              height={this.state.isColumn}
              image={item.uri}
              heightOfBigPhoto={item.height}
              widthOfBigPhoto={item.width}
              navigation={this.props.navigation}
              deleteId={item.id}
              refresh={this.checkperms.bind(this)}
            ></PhotoItem>
          )}
        />
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 30,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "silver",
    height: "100%",
  },
  button: {
    color: "white",
    fontSize: 8,
    margin: 20,
    padding: 5,
    backgroundColor: "#202020",
  },
  list: {
    flexGrow: 1,
  },
  buttonsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default DefaultScreen;
