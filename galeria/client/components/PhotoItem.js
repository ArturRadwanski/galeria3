import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

class PhotoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  select = () => {
    //console.log(this.props)
    this.props.select();
  };

  render() {
    //console.log(this.props)
    //console.log(this.props.deleteId)
    return (
      <TouchableOpacity
        style={{
          width: this.props.width
            ? windowWidth - windowWidth / 15
            : windowWidth / 5,
          height: windowWidth / 5,
          margin: windowWidth / 60,
          borderRadius: 5,
        }}
        onLongPress={this.select}
        onPress={() =>
          this.props.navigation.navigate("BigPhoto", {
            image: this.props.image,
            height: this.props.heightOfBigPhoto,
            width: this.props.widthOfBigPhoto,
            deleteId: this.props.deleteId,
            refresh: this.props.refresh,
          })
        }
        delayLongPress={200}
      >
        <Text
          style={{
            position: "absolute",
            bottom: 5,
            right: 5,
            color: "white",
            zIndex: 1000,
          }}
        >
          {this.props.deleteId}
        </Text>
        <Image
          style={{
            width: this.props.width
              ? windowWidth - windowWidth / 15
              : windowWidth / 5,
            height: windowWidth / 5,
            backgroundColor: "black",
            borderRadius: 5,
          }}
          source={{ uri: this.props.image }}
        />
        {this.props.selected && (
          <View
            style={{
              ...styles.overlay,
              width: this.props.width
                ? windowWidth - windowWidth / 15
                : windowWidth / 5,
              height: windowWidth / 5,
              borderColor: "blue",
              borderWidth: 3,
              borderRadius: 5,
            }}
          ></View>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PhotoItem;
//
