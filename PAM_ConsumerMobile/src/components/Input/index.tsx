import React from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { View, TextInput, TextInputProps, Text, ViewProps } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { theme } from "../../styles/theme";
import { styles } from "./styles";
import { useThemeContext } from "../../hooks/themeContext";

interface InputProps extends TextInputProps {
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

const Input = ({
  refInput,
  label,
  error,
  required,
  inputStyle,
  textInputStyle,
  helperText,
  ...props
}: InputProps) => {
  const { dynamicTheme, themeController } = useThemeContext();

  return (
    <View style={themeController(styles.inputContainer)}>
      {label && (
        <Text style={themeController(globalStyles.inputLabel)}>
          {label}{" "}
          {required && (
            <Text style={themeController(globalStyles.requiredField)}>*</Text>
          )}
        </Text>
      )}
      <TextInput
        ref={refInput}
        style={[themeController(globalStyles.inputContent), inputStyle, textInputStyle]}
        {...props}
      />
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

export default Input;
