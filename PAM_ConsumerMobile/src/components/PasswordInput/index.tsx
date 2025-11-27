import React, { useState } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import {
  View,
  ViewProps,
  TextInput,
  TextInputProps,
  Text,
  TouchableOpacity,
} from "react-native";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { globalStyles } from "../../styles/globalStyles";
import { useThemeContext } from "../../hooks/themeContext";

interface PasswordInputProps extends TextInputProps {
  refInput?: any;
  required?: boolean;
  label?: string | React.ReactNode;
  inputStyle?: ViewProps["style"];
  textInputStyle?: TextInputProps["style"];
  error?: boolean;
  helperText?:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
}

const PasswordInput = ({
  refInput,
  label,
  required,
  error,
  inputStyle,
  textInputStyle,
  helperText,
  ...props
}: PasswordInputProps) => {
  const { dynamicTheme, themeController } = useThemeContext();
  const [hiddenPassword, setHiddenPassword] = useState(true);

  const toggleHiddenPassword = () => setHiddenPassword((hidden) => !hidden);

  return (
    <View style={inputStyle}>
      {label && (
        <Text style={themeController(globalStyles.inputLabel)}>
          {label}{" "}
          {required && <Text style={themeController(globalStyles.requiredField)}>*</Text>}
        </Text>
      )}
      <View style={[themeController(styles.inputContainer), textInputStyle]}>
        <TextInput
          ref={refInput}
          {...props}
          style={themeController(styles.inputContent)}
          secureTextEntry={hiddenPassword}
        />
        <TouchableOpacity onPress={() => toggleHiddenPassword()}>
          {hiddenPassword ? (
            <Ionicons name="eye-off-outline" size={24} color={dynamicTheme.colors.black} />
          ) : (
            <Ionicons name="eye-outline" size={24} color={dynamicTheme.colors.black} />
          )}
        </TouchableOpacity>
      </View>
      {helperText && (
        <Text
          style={
            error
              ? themeController(globalStyles.helperTextErrorStyle)
              : themeController(globalStyles.helperTextStyle)
          }
        >{`${helperText}`}</Text>
      )}
    </View>
  );
};

export default PasswordInput;
