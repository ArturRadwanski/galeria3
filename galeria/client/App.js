import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FirstLoad from "./components/FirstLoad.js";
import Screen2 from "./components/DefaultScreen.js";
import BigPhoto from "./components/BigPhoto.js";
import Photomaker from "./components/Photomaker.js";
import Serverselector from "./components/Serverselector.js";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="FirstLoad"
          component={FirstLoad}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="s2"
          component={Screen2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BigPhoto"
          component={BigPhoto}
          options={{
            title: "Wybrane zdjęcie",
            headerStyle: {
              backgroundColor: "silver",
            },
            headerTintColor: "#202020",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Camera"
          component={Photomaker}
          options={{
            title: "Camera",
            headerStyle: {
              backgroundColor: "silver",
            },
            headerTintColor: "#202020",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen name="serverselector" component={Serverselector} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
