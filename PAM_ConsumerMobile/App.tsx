import { StatusBar } from "expo-status-bar";
import Providers from "./src/hooks/Providers";
import Routes from "./src/routes";
import React, { useCallback, useEffect } from "react";
import {
  useFonts,
  Poppins_300Light_Italic,
  Poppins_400Regular_Italic,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import QuickAlert from "./src/components/QuickAlert";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_300Light_Italic,
    Poppins_400Regular_Italic,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      onLayoutRootView();
    }
  }, [fontsLoaded, fontError, onLayoutRootView]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
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
