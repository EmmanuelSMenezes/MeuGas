import React from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { styles } from "./styles";
import { useThemeContext } from "../../../../hooks/themeContext";

interface OptionProps extends TouchableOpacityProps {
  icon?: React.ReactNode;
  title: string;
  badge?: number;
  color?: string;
}

const Option = ({ icon, title, color, badge, style, ...rest }: OptionProps) => {
  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();

  return (
    <TouchableOpacity
      style={[themeController(styles.container), style]}
      {...rest}
    >
      <View style={themeController(styles.optionsInfo)}>
        {icon && icon}
        <Text style={[themeController(styles.title), color && { color }]}>
          {title}
        </Text>
      </View>

      {badge && <Text style={themeController(styles.badge)}>{badge}</Text>}
    </TouchableOpacity>
  );
};

export default Option;
