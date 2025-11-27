import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { useThemeContext } from "../../../../hooks/themeContext";

const Tabs: React.FC = () => {
  const { dynamicTheme, themeController } = useThemeContext();

  return (
    <View style={themeController(styles.tabsContainer)}>
      <TouchableOpacity style={themeController(styles.tabOptionButton)}>
        <Text style={[themeController(styles.tabOptionText)]}>Novidades</Text>
      </TouchableOpacity>
      <TouchableOpacity style={themeController(styles.tabOptionButton)}>
        <Text
          style={[
            themeController(styles.tabOptionText),
            themeController(styles.tabOptionTextActive),
          ]}
        >
          Produtos
        </Text>
        <View style={themeController(styles.tabOptionActive)} />
      </TouchableOpacity>
      <TouchableOpacity style={themeController(styles.tabOptionButton)}>
        <Text style={[themeController(styles.tabOptionText)]}>Categorias</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Tabs;
