import React from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { IBrands, IProduct } from "../../../../interfaces/User";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { styles } from "./styles";
import { Category } from "../../../../interfaces/Category";
import { useThemeContext } from "../../../../hooks/themeContext";

interface ItemSuggestionProps extends TouchableOpacityProps {
  item: Category;
  relevant?: boolean;
}

const ItemSuggestion = ({ item, relevant, ...props }: ItemSuggestionProps) => {
  const { dynamicTheme, themeController } = useThemeContext();

  return (
    <TouchableOpacity
      {...props}
      style={themeController(styles.suggestionContainer)}
    >
      {relevant ? (
        <MaterialIcons
          name="star"
          size={24}
          color={dynamicTheme.colors.primary}
        />
      ) : (
        <MaterialCommunityIcons
          name="tag"
          size={22}
          color={dynamicTheme.colors.text}
        />
      )}
      <Text style={themeController(styles.suggestionName)}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );
};

export default ItemSuggestion;
