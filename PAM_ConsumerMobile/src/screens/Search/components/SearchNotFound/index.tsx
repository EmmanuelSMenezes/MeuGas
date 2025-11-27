import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import { MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons";
import { styles } from "./styles";
import { theme } from "../../../../styles/theme";
import { globalStyles } from "../../../../styles/globalStyles";
import { useThemeContext } from "../../../../hooks/themeContext";
interface SearchNotFoundProps extends TouchableOpacityProps {
  search: string;
}

const SearchNotFound = ({ search, ...props }: SearchNotFoundProps) => {
  const { dynamicTheme, themeController } = useThemeContext();

  return (
    <TouchableOpacity
      {...props}
      style={themeController(styles.searchNotFoundContainer)}
    >
      <AntDesign name="search1" size={18} color={dynamicTheme.colors.text} />
      <Text style={themeController(styles.searchMessage)}>
        Pesquisar por{" "}
        <Text style={themeController(globalStyles.textHighlight)}>
          {search}
        </Text>
      </Text>
    </TouchableOpacity>
  );
};

export default SearchNotFound;
