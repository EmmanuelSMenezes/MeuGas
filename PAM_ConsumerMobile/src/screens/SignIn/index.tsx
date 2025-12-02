import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import Button from "../../components/Button";
import { Input, PasswordInput } from "../../components/Shared";
import { BlueHeader } from "../../components/BlueHeader";
import { globalStyles } from "../../styles/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../hooks/AuthContext";
import { navigate } from "../../routes/rootNavigation";
import { useThemeContext } from "../../hooks/themeContext";
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

  const logoComponent = (
    <Image
      source={Logo}
      style={styles.headerLogo}
      resizeMode="contain"
    />
  );

  return (
    <View style={styles.mainContainer}>
      <BlueHeader title="Entrar" showBackButton={false} centerComponent={logoComponent} />
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
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
      </ScrollView>
    </View>
  );
};

export default SignIn;
