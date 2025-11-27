import { StatusBar } from "expo-status-bar";
import Providers from "./src/hooks/Providers";
import Routes from "./src/routes";
import React from "react";
import {
  useFonts,
  Poppins_300Light_Italic,
  Poppins_400Regular_Italic,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import QuickAlert from "./src/components/QuickAlert";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_300Light_Italic,
    Poppins_400Regular_Italic,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Providers>
        <StatusBar
          backgroundColor={"transparent"}
          translucent
          animated
          style="auto"
        />
        <QuickAlert />
        <Routes />
      </Providers>
    </GestureHandlerRootView>
  );
}
