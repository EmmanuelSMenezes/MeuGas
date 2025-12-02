import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, OTPInput } from "../../../components/Shared";
import { styles } from "./styles";
import { MaskedText } from "react-native-mask-text";
import { REACT_APP_URL_MS_AUTH, REACT_APP_URL_MS_CONSUMER } from "@env";
import api from "../../../services/api";
import { RootStackParams } from "../../../interfaces/RouteTypes";
import { useAuth } from "../../../hooks/AuthContext";
import { useUser } from "../../../hooks/UserContext";
import { useGlobal } from "../../../hooks/GlobalContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeContext } from "../../../hooks/themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import Logo from "../../../assets/img/logo.png";

const OTPVerification: React.FC<RootStackParams<"OTPVerification">> = ({
  route,
}) => {
  const { OTPSend, setUser } = useAuth();
  const { setConsumer } = useUser();
  const { openAlert } = useGlobal();
  const { navigate, replace, goBack } = useNavigation<NativeStackNavigationProp<any>>();
  const { dynamicTheme, themeController } = useThemeContext();

  const timerSeconds = 60;
  let timerRef = useRef(null);

  const [codeOTP, setCodeOTP] = useState<string>("");
  const [resendCodeTimer, setResendCodeTimer] = useState<number>(timerSeconds);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleResendCode = async () => {
    try {
      // Se veio da tela PhoneAuth, usar novo endpoint
      if (route.params?.name) {
        console.log("Reenviando código OTP para login...");
        await api.post(
          `${REACT_APP_URL_MS_AUTH}/otp/send-login`,
          {
            phone: route.params?.phone,
            name: route.params?.name,
          }
        );
        console.log("Código reenviado com sucesso");
      } else {
        // Fluxo antigo
        OTPSend();
      }
      timerRef.current = handleResendCodeTimer();
    } catch (error) {
      console.error("Erro ao reenviar código:", error);
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      // Se veio da tela PhoneAuth (tem name nos params), usar novo endpoint de login
      if (route.params?.name) {
        console.log("Verificando OTP para login...");
        const response = await api.post<any>(
          `${REACT_APP_URL_MS_AUTH}/otp/verify-login`,
          {
            otpCode: codeOTP,
            phone: route.params?.phone,
            name: route.params?.name,
          }
        );
        const { data } = response.data;
        console.log("OTP verificado com sucesso, dados:", data);

        // Salvar token e usuário no AsyncStorage
        await AsyncStorage.multiSet([
          ["@PAM:token", data.token],
          ["@PAM:user", JSON.stringify(data.user)],
        ]);
        console.log("Token e usuário salvos no AsyncStorage");

        // Atualizar estado do usuário
        setUser(data.user);
        console.log("Estado do usuário atualizado");

        // Buscar e salvar consumer (ou criar vazio se não existir)
        try {
          console.log("Buscando consumer...");
          const consumerResponse = await api.get(
            `${REACT_APP_URL_MS_CONSUMER}/consumer?user_id=${data.user.user_id}`
          );
          console.log("📦 Resposta do consumer:", consumerResponse?.data);
          const consumerData = consumerResponse?.data?.data;
          console.log("📦 Consumer data extraído:", consumerData);

          if (consumerData && consumerData.consumer_id) {
            await AsyncStorage.setItem("@PAM:consumer", JSON.stringify(consumerData));
            setConsumer(consumerData); // Atualizar estado do consumer
            console.log("✅ Consumer encontrado e salvo:", consumerData);
          } else {
            throw new Error("Consumer data is null or invalid");
          }
        } catch (error) {
          console.log("⚠️ Consumer não encontrado, criando vazio...", error?.message);
          // Criar consumer vazio para permitir login
          const emptyConsumer = {
            consumer_id: "",
            user_id: data.user.user_id,
            default_address: null,
            legal_name: data.user.profile?.fullname || data.user.fullname || "",
            fantasy_name: data.user.profile?.fullname || data.user.fullname || "",
            document: "",
            email: data.user.email || "",
            phone_number: data.user.phone || "",
            active: true,
          };
          console.log("📦 Consumer vazio criado:", emptyConsumer);
          await AsyncStorage.setItem("@PAM:consumer", JSON.stringify(emptyConsumer));
          setConsumer(emptyConsumer as any); // Atualizar estado do consumer
          console.log("✅ Consumer vazio salvo no AsyncStorage");
        }

        // Navegar para Tabs
        console.log("Navegando para Tabs...");
        replace("Tabs");
      } else {
        // Fluxo antigo (verificação de telefone após cadastro)
        const response = await api.post<any>(
          `${REACT_APP_URL_MS_AUTH}/otp/verify?otp_code=${codeOTP}`
        );
        const { data, message } = response.data;

        setUser((user) => {
          return {
            ...user,
            phone_verified: true,
          };
        });

        openAlert({
          title: "Código verificado",
          description: `${message}`,
          type: "success",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
            onConfirm: () => replace("Tabs"),
          },
        });
      }
    } catch (error) {
      openAlert({
        title: "Erro inesperado",
        description: `${error?.response?.data?.message}`,
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

  const handleResendCodeTimer = () => {
    if (resendCodeTimer !== timerSeconds) {
      setResendCodeTimer(timerSeconds);
    }

    const timer = setInterval(() => {
      setResendCodeTimer((time) => time - 1);
    }, 1000);

    // setTimeout(() => {
    //   clearInterval(timer)
    // }, (timerSeconds + 2) * 1000);

    return timer;
  };

  useEffect(() => {
    timerRef.current = handleResendCodeTimer();

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (resendCodeTimer < 0) {
      clearInterval(timerRef.current);
    }
  }, [resendCodeTimer]);

  // Mascarar telefone para exibição (ex: (61) 9 9***-**87)
  const maskedPhone = route.params?.phone
    ? `(${route.params.phone.slice(0, 2)}) 9 ${route.params.phone.slice(3, 4)}***-**${route.params.phone.slice(-2)}`
    : "";

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

      {/* Conteúdo Branco */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.formTitle}>Código de validação SMS</Text>
          <Text style={styles.formSubtitle}>
            Informe abaixo o código que foi enviado por SMS para o número cadastrado.
          </Text>

          <Text style={styles.phoneNumber}>{maskedPhone}</Text>

          <View style={styles.otpContainer}>
            <OTPInput
              autoFocus
              pinLength={6}
              onChangeCode={(code) => setCodeOTP(code)}
            />
          </View>

          <View style={styles.resendCodeContainer}>
            <Text style={styles.resendCodeTitle}>
              Ainda não recebeu o código?
            </Text>

            <TouchableOpacity
              disabled={resendCodeTimer >= 0}
              onPress={() => handleResendCode()}
            >
              <Text
                style={[
                  styles.resendCodeButtonText,
                  resendCodeTimer >= 0 && styles.disabledButton,
                ]}
              >
                {resendCodeTimer >= 0
                  ? `Enviar código novamente (${resendCodeTimer}s)`
                  : "Enviar código novamente"
                }
              </Text>
            </TouchableOpacity>
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
            onPress={() => onSubmit()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default OTPVerification;
