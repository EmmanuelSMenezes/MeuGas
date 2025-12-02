import React from "react";
import { View, Text, ScrollView } from "react-native";
import { styles } from "./styles";
import { BlueHeader } from "../../../../components/BlueHeader";

import pkg from "../../../../../package.json";
import { useThemeContext } from "../../../../hooks/themeContext";

const About: React.FC = () => {
  const { themeController } = useThemeContext();

  return (
    <View style={styles.mainContainer}>
      <BlueHeader title="Sobre o aplicativo" />
      <ScrollView style={styles.contentContainer}>
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
      </ScrollView>
    </View>
  );
};

export default About;
