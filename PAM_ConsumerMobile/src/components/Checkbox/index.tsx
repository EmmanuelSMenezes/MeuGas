import React from "react";
import { View } from "react-native";
import { Checkbox as ExpoCheckbox, CheckboxProps } from "expo-checkbox";
import { styles } from "./styles";
import { theme } from "../../styles/theme";
import { useThemeContext } from "../../hooks/themeContext";

interface CustomCheckboxProps extends CheckboxProps {
  error?: boolean;
  style?: CheckboxProps["style"];
}

const Checkbox = ({ error, style, ...props }: CustomCheckboxProps) => {
  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();

  return (
    <ExpoCheckbox
      color={
        !!props.value ? dynamicTheme.colors.primary : dynamicTheme.colors.gray
      }
      style={[
        themeController(styles.checkboxStyle),
        error && themeController(styles.checkboxError),
        !!props.value && themeController(styles.checkedBorder),
        style,
      ]}
      {...props}
    />
  );
};

export default Checkbox;
