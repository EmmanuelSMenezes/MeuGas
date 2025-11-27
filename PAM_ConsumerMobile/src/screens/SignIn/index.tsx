import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Text, TouchableOpacity } from "react-native";
import Button from "../../components/Button";
import { Header, Input, PasswordInput } from "../../components/Shared";
import { globalStyles } from "../../styles/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { styles } from "./styles";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/AuthContext";
import { navigate } from "../../routes/rootNavigation";
import RequestPermissionsModal from "../Shared/RequestPermissionModal";
import { useThemeContext } from "../../hooks/themeContext";
import { Image, ImageSourcePropType } from 'react-native';
import Logo from "./../../assets/img/logo.png";


interface LoginProps {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { login } = useAuth();
  const signInSchema = yup.object().shape({
    email: yup.string().email("E-mail inválido").required("Insira seu e-mail"),
    password: yup.string().required("Insira sua senha"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<LoginProps>({
    resolver: yupResolver(signInSchema),
  });
  const { dynamicTheme, themeController } = useThemeContext();

  const onSubmit = async (data: LoginProps) => {
    await login(data);
  };

  return (
    <View
      style={[
        themeController(globalStyles.container),
        themeController(styles.container),
      ]}
    >
      {/* <Header /> */}
      <Image
        source={Logo}
        style={styles.logo}
        resizeMode="contain"
      /> 
      <Text style={[themeController(styles.title)]}>Entrar</Text>

      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input
            refInput={ref}
            autoCapitalize="none"
            keyboardType="email-address"
            onSubmitEditing={() => setFocus("password")}
            returnKeyType="next"
            onBlur={onBlur}
            inputStyle={themeController(styles.inputSpacing)}
            error={!!errors?.email}
            helperText={errors?.email?.message}
            placeholder="E-mail"
            onChangeText={(text) => onChange(text)}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <PasswordInput
            refInput={ref}
            onBlur={onBlur}
            inputStyle={themeController(styles.inputSpacing)}
            error={!!errors?.password}
            helperText={errors?.password?.message}
            placeholder="Senha"
            onChangeText={(text) => onChange(text)}
          />
        )}
      />
      <TouchableOpacity
        style={themeController(styles.forgetPassword)}
        onPress={() => navigate("RecoverPassword")}
      >
        <Text style={[themeController(styles.forgetPasswordText)]}>
          Esqueceu a senha?
        </Text>
      </TouchableOpacity>
      <Button
        title="Entrar"
        loading={isSubmitting}
        buttonStyle={themeController(styles.signInButton)}
        icon={
          <MaterialIcons
            name="login"
            size={24}
            color={dynamicTheme.colors.white}
          />
        }
        onPress={handleSubmit(onSubmit)}
      />
      <Text style={themeController(styles.signUpButton)}>
        Não tem uma conta?{" "}
        <Text
          onPress={() => navigate("SignUp")}
          style={themeController(globalStyles.textHighlight)}
        >
          Registre-se
        </Text>
      </Text>
    </View> 
  );
};

export default SignIn;
