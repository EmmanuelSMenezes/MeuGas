import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import { Input, MaskedInput } from "../../components/Shared";
import { globalStyles } from "../../styles/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/AuthContext";
import { useThemeContext } from "../../hooks/themeContext";
import { Image } from 'react-native';
import Logo from "./../../assets/img/logo.png";
import { useGlobal } from "../../hooks/GlobalContext";
import { REACT_APP_URL_MS_AUTH } from "@env";
import api from "../../services/api";

interface PhoneAuthProps {
  name: string;
  phone: string;
}

const PhoneAuth: React.FC = () => {
  const { navigate } = useNavigation();
  const { dynamicTheme, themeController } = useThemeContext();
  const { openAlert } = useGlobal();
  const [isLoading, setIsLoading] = useState(false);

  const phoneAuthSchema = yup.object().shape({
    name: yup.string().required("Insira seu nome"),
    phone: yup.string().required("Insira seu telefone").min(11, "Telefone inválido"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<PhoneAuthProps>({
    resolver: yupResolver(phoneAuthSchema),
  });

  const onSubmit = async (data: PhoneAuthProps) => {
    setIsLoading(true);
    try {
      // Chamar API para enviar OTP
      const response = await api.post(
        `${REACT_APP_URL_MS_AUTH}/otp/send-login`,
        {
          phone: data.phone,
          name: data.name,
        }
      );

      if (response.data.success) {
        openAlert({
          title: "Código enviado",
          description: "Um código foi enviado para o seu telefone",
          type: "success",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
            onConfirm: () => {
              navigate("OTPVerification", {
                phone: data.phone,
                name: data.name
              });
            },
          },
        });
      } else {
        throw new Error(response.data.message || "Erro ao enviar código");
      }
    } catch (error: any) {
      openAlert({
        title: "Erro",
        description: error?.response?.data?.message || "Não foi possível enviar o código",
        type: "error",
        buttons: {
          confirmButtonTitle: "Ok",
          cancelButton: false,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={themeController(globalStyles.container)} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[themeController(styles.container)]}>
          <Image
            source={Logo}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[themeController(styles.title)]}>Acesse sua conta</Text>
          <Text style={[themeController(styles.subtitle)]}>
            Digite seu nome e celular para receber um código de verificação SMS
          </Text>

          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                refInput={ref}
                autoCapitalize="words"
                onSubmitEditing={() => setFocus("phone")}
                returnKeyType="next"
                onBlur={onBlur}
                inputStyle={themeController(styles.inputSpacing)}
                error={!!errors?.name}
                helperText={errors?.name?.message}
                placeholder="Nome completo"
                onChangeText={(text) => onChange(text)}
                value={value}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, value } }) => (
              <MaskedInput
                label=""
                mask="(99) 99999-9999"
                maxLength={15}
                inputStyle={themeController(styles.inputSpacing)}
                error={!!errors?.phone}
                helperText={errors?.phone?.message}
                placeholder="(xx) xxxxx-xxxx"
                onChangeText={(_, text) => onChange(text)}
                keyboardType="numeric"
                value={value}
              />
            )}
          />

          <Button
            title="Avançar"
            loading={isLoading}
            buttonStyle={themeController(styles.signInButton)}
            icon={
              <MaterialIcons
                name="arrow-forward"
                size={24}
                color={dynamicTheme.colors.white}
              />
            }
            onPress={handleSubmit(onSubmit)}
          />

          <Text style={themeController(styles.signUpButton)}>
            Ao continuar, você concorda com nossos{" "}
            <Text style={themeController(globalStyles.textHighlight)}>
              Termos de Uso
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PhoneAuth;

