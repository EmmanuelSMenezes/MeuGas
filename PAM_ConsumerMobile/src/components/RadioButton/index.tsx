import React from "react";
import {
  TouchableOpacityProps,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import {
  RadioButton as RadioButtonPaper,
  RadioButtonProps as RadioButtonPaperProps,
} from "react-native-paper";
import { styles } from "./styles";
import { theme } from "../../styles/theme";
import { useThemeContext } from "../../hooks/themeContext";

interface RadioButtonProps extends RadioButtonPaperProps {
  children: React.ReactNode;
  containerStyle?: TouchableOpacityProps["style"];
  contentContainerStyle?: ViewProps["style"];
  checked: boolean;
  alignment?: "flex-start" | "center" | "flex-end";
}

const RadioButton = ({
  children,
  containerStyle,
  contentContainerStyle,
  alignment = "center",
  checked,
  ...props
}: RadioButtonProps) => {
  const { dynamicTheme, themeController } = useThemeContext();

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        themeController(styles.radioButtonContainer),
        containerStyle,
        { alignItems: alignment },
      ]}
    >
      <RadioButtonPaper
        {...props}
        status={checked ? "checked" : "unchecked"}
        uncheckedColor={dynamicTheme.colors.gray}
        color={dynamicTheme.colors.primary}
      />
      <View
        style={[themeController(styles.labelContainer), contentContainerStyle]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};

export default RadioButton;
