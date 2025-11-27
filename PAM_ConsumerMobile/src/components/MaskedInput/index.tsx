import React from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { ViewProps, View, TextInput, TextInputProps, Text } from "react-native";
import { MaskedTextInputProps, MaskedTextInput } from "react-native-mask-text";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./styles";
import { useThemeContext } from "../../hooks/themeContext";

interface MaskedInputProps extends MaskedTextInputProps {
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

const MaskedInput = ({
  refInput,
  label,
  error,
  required,
  inputStyle,
  textInputStyle,
  helperText,
  ...props
}: MaskedInputProps) => {
  const { dynamicTheme, themeController } = useThemeContext();

  return (
    <View style={inputStyle}>
      {label && (
        <Text style={themeController(globalStyles.inputLabel)}>
          {label}{" "}
          {required && (
            <Text style={themeController(globalStyles.requiredField)}>*</Text>
          )}
        </Text>
      )}
      <MaskedTextInput
        ref={refInput}
        style={[themeController(globalStyles.inputContent), textInputStyle]}
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

export default MaskedInput;
