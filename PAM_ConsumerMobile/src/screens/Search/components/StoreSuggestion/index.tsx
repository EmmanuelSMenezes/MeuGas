import React from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { IBrands, IProduct } from "../../../../interfaces/User";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { styles } from "./styles";
import { IBranch } from "../../../../interfaces/Offer";
import { useThemeContext } from "../../../../hooks/themeContext";

interface StoreSuggestionProps extends TouchableOpacityProps {
  item: IBranch;
  relevant?: boolean;
}

const StoreSuggestion = ({
  item,
  relevant,
  ...props
}: StoreSuggestionProps) => {
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
        <MaterialIcons
          name="store"
          size={24}
          color={dynamicTheme.colors.text}
        />
      )}
      <Text style={themeController(styles.suggestionName)}>
        {item?.branch_name}
      </Text>
    </TouchableOpacity>
  );
};

export default StoreSuggestion;
