import React, { Component } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import * as Font from "expo-font";

import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

class FirstLoad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontloaded: false,
    };
  }
  componentDidMount = async () => {
    await Font.loadAsync({
      myfont: require("../assets/PAPYRUS.ttf"), // Uwaga: proszę w nazwie fonta nie używać dużych liter
    });
    this.setState({ fontloaded: true });
  };

  render() {
    return this.state.fontloaded ? (
      <View style={styles.main}>
        <TouchableOpacity
          style={styles.opacitybox}
          onPress={() => this.props.navigation.navigate("s2", { a: 1, b: 2 })}
        >
          <Text style={styles.buttonbox}>Photos App</Text>
        </TouchableOpacity>
        <Text style={styles.lowercasetext}>show gallery pictures</Text>
        <Text style={styles.lowercasetext}>delete photo from device</Text>
        <Text style={styles.lowercasetext}>share photo</Text>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  buttonbox: {
    fontFamily: "myfont",
    fontSize: 100,
    textAlign: "center",
    color: "white",
  },
  opacitybox: {},
  main: {
    backgroundColor: "#c72a73",
    width: windowWidth,
    height: windowHeight + 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  lowercasetext: {
    fontFamily: "myfont",
    fontSize: 30,
    textAlign: "center",
    color: "white",
  },
});

export default FirstLoad;
