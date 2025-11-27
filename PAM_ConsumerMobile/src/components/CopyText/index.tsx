import React, { useState } from "react";
import {
  TextProps,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles";
import { theme } from "../../styles/theme";
import * as Clipboard from "expo-clipboard";
import { useThemeContext } from "../../hooks/themeContext";

interface CopyTextProps {
  textToCopy: string;
  containerStyle?: TouchableOpacityProps["style"];
  style?: TextProps["style"];
}

const CopyText = ({ textToCopy, containerStyle, style }: CopyTextProps) => {
  const { dynamicTheme, themeController } = useThemeContext();
  const [isCopied, setIsCopied] = useState(false);

  const onCopyText = async () => {
    setIsCopied(true);

    await Clipboard.setStringAsync(textToCopy);

    setTimeout(() => {
      setIsCopied((copied) => !copied);
    }, 2000);
  };

  return (
    <TouchableOpacity
      onPress={() => onCopyText()}
      style={[themeController(styles.container), containerStyle]}
    >
      <Text numberOfLines={1} style={[themeController(styles.text), style]}>{textToCopy}</Text>
      {isCopied ? (
        <Feather
          name="check"
          size={16}
          style={themeController(styles.copiedTextIcon)}
          color={dynamicTheme.colors.white}
        />
      ) : (
        <Feather name="copy" size={20} color={dynamicTheme.colors.primary} />
      )}
    </TouchableOpacity>
  );
};

export default CopyText;
