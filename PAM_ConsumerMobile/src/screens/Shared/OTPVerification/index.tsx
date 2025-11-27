import React, { useEffect, useRef, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Button, OTPInput } from "../../../components/Shared";
import { globalStyles } from "../../../styles/globalStyles";
import { styles } from "./styles";
import { MaskedText } from "react-native-mask-text";
import { REACT_APP_URL_MS_AUTH } from "@env";
import api from "../../../services/api";
import { RootStackParams } from "../../../interfaces/RouteTypes";
import { useAuth } from "../../../hooks/AuthContext";
import { useGlobal } from "../../../hooks/GlobalContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeContext } from "../../../hooks/themeContext";

const OTPVerification: React.FC<RootStackParams<"OTPVerification">> = ({
  route,
}) => {
  const { OTPSend, setUser } = useAuth();
  const { openAlert } = useGlobal();
  const { navigate, replace } = useNavigation<NativeStackNavigationProp<any>>();
  const { dynamicTheme, themeController } = useThemeContext();

  const timerSeconds = 60;
  let timerRef = useRef(null);

  const [codeOTP, setCodeOTP] = useState<string>("");
  const [resendCodeTimer, setResendCodeTimer] = useState<number>(timerSeconds);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleResendCode = () => {
    OTPSend();
    timerRef.current = handleResendCodeTimer();
  };

  const onSubmit = async () => {
    setIsLoading(true);

    try {
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

  return (
    <>
      <View style={[themeController(globalStyles.container), styles.container]}>
        <View>
          <Text style={[themeController(styles.title)]}>Verificar celular</Text>
          <Text style={themeController(styles.subtitle)}>
            Um código de verificação foi enviado para o telefone{"\n"}
            <MaskedText
              style={themeController(globalStyles.textHighlight)}
              mask="(99) 99999-9999"
              children={` ${route.params?.phone}`}
            />
          </Text>
        </View>

        <OTPInput
          autoFocus
          pinLength={6}
          onChangeCode={(code) => setCodeOTP(code)}
        />

        <View style={themeController(styles.resendCodeContainer)}>
          {resendCodeTimer >= 0 ? (
            <Text style={themeController(styles.resendCodeTimer)}>
              Aguarde {resendCodeTimer} segundos para solicitar um novo código.
            </Text>
          ) : (
            <Text style={themeController(styles.resendCodeTitle)}>
              Não recebeu um código?
            </Text>
          )}

          <TouchableOpacity
            disabled={resendCodeTimer >= 0}
            onPress={() => handleResendCode()}
          >
            <Text
              style={[
                themeController(styles.resendCodeButtonText),
                resendCodeTimer >= 0 && themeController(styles.disabledButton),
              ]}
            >
              Reenviar código
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Verificar e continuar"
          loading={isLoading}
          buttonStyle={themeController(styles.confirmButton)}
          onPress={() => onSubmit()}
        />
      </View>
    </>
  );
};

export default OTPVerification;
