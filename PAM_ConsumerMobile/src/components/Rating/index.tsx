import React from "react";
import {
  View,
  TouchableOpacity,
  ViewProps,
  TouchableOpacityProps,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import styles from "./styles";
import { useThemeContext } from "../../hooks/themeContext";

interface RatingProps {
  onRate?: (rate: number) => void;
  value?: number;
  containerStyle?: ViewProps["style"];
  buttonStyle?: TouchableOpacityProps["style"];
  disabledStars?: boolean;
  iconSize?: number;
}

const Rating = ({
  onRate,
  value,
  containerStyle,
  buttonStyle,
  disabledStars,
  iconSize = 36,
}: RatingProps) => {
  const { dynamicTheme, themeController } = useThemeContext();

  return (
    <View style={[themeController(styles.starsContainer), containerStyle]}>
      {[1, 2, 3, 4, 5].map((index) => (
        <TouchableOpacity
          key={index.toString()}
          style={[themeController(styles.starButton), buttonStyle]}
          onPress={() => onRate(index)}
          disabled={!onRate}
        >
          <MaterialIcons
            name={"star"}
            size={iconSize}
            color={
              disabledStars || value < index
                ? dynamicTheme.colors.primaryBackground
                : dynamicTheme.colors.gold
            }
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Rating;
