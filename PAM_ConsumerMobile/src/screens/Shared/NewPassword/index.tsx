import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../../../styles/globalStyles";
import { styles } from "./styles";
import { Controller, useForm } from "react-hook-form";
import PasswordInput from "../../../components/PasswordInput";
import PasswordStrengthBar from "../../../components/PasswordStrengthBar";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Header } from "../../../components/Shared";
import { useAuth } from "../../../hooks/AuthContext";
import { useGlobal } from "../../../hooks/GlobalContext";
import { useNavigation } from "@react-navigation/native";
import { useThemeContext } from "../../../hooks/themeContext";

interface PersonalDataForm {
  password: string;
  passwordConfirmation: string;
}

const NewPassword: React.FC = () => {
  const personalDataSchema = yup.object().shape({
    password: yup.string().required("Campo obrigatório"),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password")], "As senhas não coincidem")
      .required("Campo obrigatório"),
  });

  const { user, resetPassword } = useAuth();
  const { dynamicTheme, themeController } = useThemeContext();
  const { openAlert } = useGlobal();
  const { navigate } = useNavigation();

  const {
    control,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<PersonalDataForm>({
    resolver: yupResolver(personalDataSchema),
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: PersonalDataForm) => {
    const { password, passwordConfirmation } = data;

    const message = await resetPassword({ password, passwordConfirmation });

    openAlert({
      title: "Senha alterada",
      description: message,
      type: "success",
      buttons: {
        confirmButtonTitle: "Ok",
        cancelButton: false,
        onConfirm: () =>
          user.user_id
            ? navigate("Tabs", { screen: "Profile" })
            : navigate("SignIn"),
      },
    });
  };

  return (
    <View style={themeController(globalStyles.container)}>
      <Header backButton />
      <Text style={themeController(globalStyles.title)}>Nova senha</Text>
      <View style={themeController(styles.container)}>
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <PasswordInput
              refInput={ref}
              returnKeyType="next"
              onSubmitEditing={() => setFocus("passwordConfirmation")}
              label="Senha"
              required
              inputStyle={themeController(styles.inputSpacing)}
              error={!!errors?.password}
              helperText={errors?.password?.message}
              placeholder="Escolha uma senha segura"
              onChangeText={(text) => onChange(text)}
            />
          )}
        />

        <PasswordStrengthBar password={watch("password")} />

        <Controller
          name="passwordConfirmation"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <PasswordInput
              required
              refInput={ref}
              label="Confirme sua senha"
              inputStyle={themeController(styles.inputSpacing)}
              error={!!errors?.passwordConfirmation}
              helperText={errors?.passwordConfirmation?.message}
              placeholder="Digite a senha novamente"
              onChangeText={(text) => onChange(text)}
            />
          )}
        />
        {watch("password")?.length < 8 && (
          <Text style={themeController(styles.passwordStrenghtError)}>
            Sua senha deve conter pelo menos 8 caracteres
          </Text>
        )}

        <Button
          title="Confirmar"
          loading={isSubmitting}
          disabled={isSubmitting}
          buttonStyle={themeController(styles.registerButton)}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

export default NewPassword;
