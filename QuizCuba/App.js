import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import InicioScreen from "./src/screens/InicioScreen";
import JuegoScreen from "./src/screens/JuegoScreen";
import ResultadoScreen from "./src/screens/ResultadoScreen";
import RankingScreen from "./src/screens/RankingScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio" component={InicioScreen} />
        <Stack.Screen name="Juego" component={JuegoScreen} />
        <Stack.Screen name="Resultado" component={ResultadoScreen} />
        <Stack.Screen name="Ranking" component={RankingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}