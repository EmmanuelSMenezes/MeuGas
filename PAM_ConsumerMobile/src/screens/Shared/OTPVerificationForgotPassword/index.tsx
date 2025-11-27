
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Button, OTPInput } from '../../../components/Shared';
import { globalStyles } from '../../../styles/globalStyles';
import { styles } from './styles';
import { MaskedText } from 'react-native-mask-text';
import { REACT_APP_URL_MS_AUTH } from "@env"
import api from '../../../services/api';
import { RootStackParams } from '../../../interfaces/RouteTypes';
import { navigate } from '../../../routes/rootNavigation';
import { useAuth } from '../../../hooks/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobal } from '../../../hooks/GlobalContext';
import { useThemeContext } from '../../../hooks/themeContext';

const OTPVerificationForgotPassword: React.FC<RootStackParams<'OTPVerificationForgotPassword'>> = ({ route }) => {

  const { openAlert } = useGlobal();
  const { OTPSend, OTPSendForgotPassword, setUser } = useAuth();
  const { dynamicTheme, themeController } = useThemeContext();

  const timerSeconds = 60
  let timerRef = useRef(null);

  const [codeOTP, setCodeOTP] = useState<string>('');
  const [resendCodeTimer, setResendCodeTimer] = useState<number>(timerSeconds);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleResendCode = () => {
    OTPSendForgotPassword(route?.params?.phone)
    timerRef.current = handleResendCodeTimer()
  }

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await api.post<any>(
        `${REACT_APP_URL_MS_AUTH}/otp/verify/forgot-password?otp_code=${codeOTP}&phone_number=${route.params?.phone}`,
      );

      const { data, message } = response.data;
      await AsyncStorage.setItem('@PAM:token', data.token)

      openAlert({
        title: 'Código verificado',
        description: `${message}`,
        type: 'success',
        buttons: {
          confirmButtonTitle: 'Ok',
          cancelButton: false,
          onConfirm: () => navigate('NewPassword')
        }
      })

    } catch (error) {
      openAlert({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao tentar validar o código',
        type: 'error',
        buttons: {
          confirmButtonTitle: 'Ok',
          cancelButton: false
        }
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCodeTimer = () => {
    if (resendCodeTimer !== timerSeconds) {
      setResendCodeTimer(timerSeconds)
    }

    const timer = setInterval(() => {
      setResendCodeTimer(time => time - 1)
    }, 1000)

    // setTimeout(() => {
    //   clearInterval(timer)
    // }, (timerSeconds + 2) * 1000);

    return timer;
  }

  useEffect(() => {
    timerRef.current = handleResendCodeTimer()

    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (resendCodeTimer < 0) {
      clearInterval(timerRef.current);
    }
  }, [resendCodeTimer])

  return (
    <>
      <View style={[themeController(globalStyles.container), themeController(styles.container)]}>
        <View>
          <Text style={themeController(styles.title)}>Verificar celular</Text>
          <Text style={themeController(styles.subtitle)}>Um código de verificação foi enviado para o telefone{'\n'}
            <MaskedText style={themeController(globalStyles.textHighlight)} mask='(99) 99999-9999' children={` ${route.params?.phone}`} />
          </Text>
        </View>

        <OTPInput
          autoFocus
          pinLength={6}
          onChangeCode={(code) => setCodeOTP(code)}
        />

        <View style={themeController(styles.resendCodeContainer)}>
          {
            resendCodeTimer >= 0 ?
              <Text style={themeController(styles.resendCodeTimer)}>
                Aguarde {resendCodeTimer} segundos para solicitar um novo código.
              </Text> :
              <Text style={themeController(styles.resendCodeTitle)}>
                Não recebeu um código?
              </Text>
          }

          <TouchableOpacity
            disabled={resendCodeTimer >= 0}
            onPress={() => handleResendCode()}
          >
            <Text style={[themeController(styles.resendCodeButtonText), resendCodeTimer >= 0 && themeController(styles.disabledButton)]}>
              Reenviar código
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title='Verificar e continuar'
          loading={isLoading}
          buttonStyle={themeController(styles.confirmButton)}
          onPress={() => onSubmit()}
        />
      </View>
    </>
  );
};

export default OTPVerificationForgotPassword;
