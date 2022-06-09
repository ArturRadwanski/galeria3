import React, { Component } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import Dialog from "react-native-dialog";

class Serverselector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      visible: false,
      ip: null,
      port: null,
      lastPort: null,
      lastIp: null,
    };
  }

  loadFromSecureStore = async () => {
    let ipFromSecureStorage = await SecureStore.getItemAsync("ip");
    let portFromSecureStorage = await SecureStore.getItemAsync("port");
    console.log(ipFromSecureStorage, portFromSecureStorage);
    this.setState({ ip: ipFromSecureStorage });
    this.setState({ port: portFromSecureStorage });
    this.setState({ ready: true });
  };

  componentDidMount = async () => {
    this.loadFromSecureStore();
  };

  saveInSecureStore = async () => {
    if (this.state.ip == null || this.state.port == null)
      return alert("port or ip is empty");

    await SecureStore.setItemAsync("ip", this.state.ip);
    await SecureStore.setItemAsync("port", this.state.port);
    this.setState({ visible: false });
  };

  handleShow = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
    this.loadFromSecureStore();
  };

  handleChangePort = (port) => {
    this.setState({ port: port });
  };

  handleChangeIp = (ip) => {
    this.setState({ ip: ip });
  };

  render() {
    return this.state.ready ? (
      <View style={styles.container}>
        <Text> Ip:{this.state.ip} </Text>
        <Text> port:{this.state.port} </Text>
        <Button title="change" onPress={this.handleShow}></Button>

        <Dialog.Container visible={this.state.visible}>
          <Dialog.Title>IP and Port</Dialog.Title>
          <Dialog.Input
            label="IP"
            onChangeText={(ip) => this.handleChangeIp(ip)}
          ></Dialog.Input>
          <Dialog.Input
            label="PORT"
            onChangeText={(port) => this.handleChangePort(port)}
          ></Dialog.Input>
          <Dialog.Button label="save" onPress={this.saveInSecureStore} />
          <Dialog.Button label="cancel" onPress={this.handleCancel} />
        </Dialog.Container>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Serverselector;
