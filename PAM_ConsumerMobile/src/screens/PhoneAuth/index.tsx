import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import Button from "../../components/Button";
import { MaskedTextInput } from "react-native-mask-text";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigation } from "@react-navigation/native";
import Logo from "./../../assets/img/logo.png";
import { useGlobal } from "../../hooks/GlobalContext";
import { REACT_APP_URL_MS_AUTH } from "@env";
import api from "../../services/api";

interface PhoneAuthProps {
  name: string;
  phone: string;
}

const PhoneAuth: React.FC = () => {
  const { navigate, goBack } = useNavigation();
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
    console.log("📱 PhoneAuth - Iniciando envio OTP");
    console.log("📱 PhoneAuth - Nome:", data.name);
    console.log("📱 PhoneAuth - Telefone:", data.phone);

    setIsLoading(true);
    try {
      const payload = {
        phone: data.phone,
        name: data.name,
      };
      console.log("📱 PhoneAuth - Payload:", JSON.stringify(payload));
      console.log("📱 PhoneAuth - URL:", `${REACT_APP_URL_MS_AUTH}/otp/send-login`);

      const response = await api.post(
        `${REACT_APP_URL_MS_AUTH}/otp/send-login`,
        payload
      );

      console.log("📱 PhoneAuth - Response:", JSON.stringify(response.data));

      if (response.data.success) {
        console.log("✅ PhoneAuth - OTP enviado com sucesso, navegando...");
        navigate("OTPVerification", {
          phone: data.phone,
          name: data.name
        });
      } else {
        throw new Error(response.data.message || "Erro ao enviar código");
      }
    } catch (error: any) {
      console.log("❌ PhoneAuth - Erro:", error?.message);
      console.log("❌ PhoneAuth - Response:", error?.response?.data);
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
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* Header Azul com Logo */}
      <View style={styles.blueHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <Image
          source={Logo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Formulário Branco */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Nome</Text>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <View>
                  <TextInput
                    ref={ref}
                    autoCapitalize="words"
                    onSubmitEditing={() => setFocus("phone")}
                    returnKeyType="next"
                    onBlur={onBlur}
                    style={styles.input}
                    placeholder="Insira seu nome aqui"
                    placeholderTextColor="#999999"
                    onChangeText={(text) => onChange(text)}
                    value={value}
                  />
                  {errors?.name && (
                    <Text style={styles.errorText}>{errors.name.message}</Text>
                  )}
                </View>
              )}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Celular</Text>
            <Controller
              name="phone"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View>
                  <MaskedTextInput
                    mask="(99) 99999-9999"
                    style={styles.input}
                    placeholder="(00) 00000-0000"
                    placeholderTextColor="#999999"
                    onChangeText={(_, text) => onChange(text)}
                    keyboardType="numeric"
                    value={value}
                  />
                  {errors?.phone && (
                    <Text style={styles.errorText}>{errors.phone.message}</Text>
                  )}
                </View>
              )}
            />
          </View>

          <Button
            title="Avançar"
            loading={isLoading}
            buttonStyle={styles.submitButton}
            icon={
              <MaterialIcons
                name="arrow-forward"
                size={24}
                color="#FFFFFF"
              />
            }
            onPress={handleSubmit(onSubmit)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default PhoneAuth;

