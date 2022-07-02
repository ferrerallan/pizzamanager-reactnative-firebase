import React from "react";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
// import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "styled-components/native";
import theme from "./src/theme";
import { useFonts, DMSans_400Regular } from "@expo-google-fonts/dm-sans";
import { DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display";
import { AuthProvider } from "@hooks/auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// import { SignIn } from "@screens/SignIn";
import { Product } from "@screens/Product";
import { Order } from "@screens/Order";
import { Orders } from "@screens/Orders";
import { Teste } from "@screens/Teste";
import { Routes } from "./src/routes";
import { SignIn } from "@screens/SignIn";
import { Home } from "@screens/Home";

export default function App() {

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSerifDisplay_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
