import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
} from "react-native";
import { styles } from "./styles";
import { useThemeContext } from "../../../../hooks/themeContext";

interface CategorySuggestionProps extends TouchableOpacityProps {
  id: string;
  text: string;
  active?: boolean;
}

const CategorySuggestion = ({
  id,
  text,
  active,
  ...props
}: CategorySuggestionProps) => {
  const { dynamicTheme, themeController } = useThemeContext();

  return (
    <TouchableOpacity
      style={[
        themeController(styles.suggestionContainer),
        active && themeController(styles.suggestionContainerActive),
      ]}
      {...props}
    >
      <Text
        style={[
          themeController(styles.categorySuggestionText),
          active && themeController(styles.categorySuggestionTextActive),
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default CategorySuggestion;
