import React from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ViewProps,
  TextInputProps,
} from "react-native";
import { styles } from "./styles";
import { theme } from "../../../styles/theme";
import { MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons";
import { useThemeContext } from "../../../hooks/themeContext";

interface InputSearchProps extends TextInputProps {
  refInput?: any;
  style?: ViewProps["style"];
  onPress?: () => void;
}

const InputSearch = ({
  refInput,
  style,
  onPress,
  ...props
}: InputSearchProps) => {
  const { dynamicTheme, themeController } = useThemeContext();

  return (
    <View style={[themeController(styles.inputSearchContainer), style]}>
      <TouchableOpacity onPress={onPress}>
        <AntDesign
          style={themeController(styles.iconSpacing)}
          name="search1"
          size={18}
          color={dynamicTheme.colors.gray}
        />
      </TouchableOpacity>
      <TextInput
        ref={refInput}
        style={themeController(styles.inputContent)}
        {...props}
      />
    </View>
  );
};

export default InputSearch;
