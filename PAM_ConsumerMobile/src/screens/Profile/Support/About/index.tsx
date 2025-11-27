import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import { globalStyles } from "../../../../styles/globalStyles";
import { Header } from "../../../../components/Shared";

import pkg from "../../../../../package.json";
import { useThemeContext } from "../../../../hooks/themeContext";

const About: React.FC = () => {
  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();

  return (
    <View style={themeController(globalStyles.container)}>
      <Header backButton />
      <Text style={themeController(globalStyles.title)}>Sobre o aplicativo</Text>
      <View
        style={{
          alignItems: "flex-start",
          justifyContent: "flex-start",
          paddingTop: 20,
        }}
      >
        <Text style={themeController(styles.subtitle)}>
          React native {pkg.dependencies["react-native"]}
        </Text>
        <Text style={themeController(styles.subtitle)}>
          React {pkg.dependencies["react"]}
        </Text>
        <Text style={themeController(styles.subtitle)}>
          Expo {pkg.dependencies["expo"]}
        </Text>
      </View>
    </View>
  );
};

export default About;
