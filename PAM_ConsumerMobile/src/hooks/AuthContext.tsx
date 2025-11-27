import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SignUpData, User, Consumer, Address } from "../interfaces/User";
import { REACT_APP_URL_MS_AUTH } from "@env";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { navigate } from "../routes/rootNavigation";
import * as SplashScreen from "expo-splash-screen";
import { useUser } from "./UserContext";
import { useGlobal } from "./GlobalContext";

import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import NotificationHelper from "../../src/services/NotificationHelper";
import { getErrorMessage, logError, logInfo, logWarning, shouldShowError } from "../utils/errorHandler";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface AuthProviderProps {
  children: React.ReactNode;
}

interface LoginProps {
  email: string;
  password: string;
}

interface registerProps {
  roleName: number;
  email: string;
  password: string;
  fullname: string;
  phone: string;
  document: string;
}
interface UpdateProps {
  user_id: string;
  email: string;
  phone: string;
  fullname: string;
  avatar?: {
    uri: string;
    name: string;
    type: string;
  };
  document: string;
  active?: boolean | string;
  phone_verified?: boolean | string;
}
interface resetProps {
  password: string;
  passwordConfirmation: string;
}

interface AuthContextValues {
  user: User;
  photoProfile: string;
  setPhotoProfile: React.Dispatch<React.SetStateAction<string>>;
  login(data: LoginProps): Promise<void>;
  logout(): void;
  register(data: registerProps): Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  signUpData: SignUpData;
  setSignUpData: React.Dispatch<React.SetStateAction<SignUpData>>;
  OTPSend: () => void;
  OTPSendForgotPassword: (phone: string) => void;
  resetPassword(data: resetProps): Promise<string>;
  updateUser(data: UpdateProps): Promise<void>;
  deleteUser(user_id: string): Promise<void>;
  notifPush: (title: string, body: string, timerTrigger: number) => void;
  loading: boolean;
  setLoading: (loading) => void;
}

interface LoginProps {
  email: string;
  password: string;
}

const AuthContext = createContext({} as AuthContextValues);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { createConsumer, setConsumer, getConsumer, setUserLocation } =
    useUser();
  const { openAlert } = useGlobal();

  const [user, setUser] = useState<User>({} as User);
  const [photoProfile, setPhotoProfile] = useState<any>("");
  const [signUpData, setSignUpData] = useState<SignUpData>({} as SignUpData);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] =
    useState<Notifications.Notification>(null);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();
  const [loading, setLoading] = useState<boolean>(false)

  const OTPSend = useCallback(async () => {
    try {
      const response = await api.post(`${REACT_APP_URL_MS_AUTH}/otp/sms/send`);

      const { message } = response.data;

      // openAlert({
      //   title: 'Código enviado',
      //   description: message,
      //   type: 'success',
      //   buttons: {
      //     confirmButtonTitle: 'Ok',
      //     cancelButton: false
      //   }
      // })
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

      if (error.message === "Network Error") {
        openAlert({
          title: "Sem conexão",
          description: "Verifique sua conexão com a rede",
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });
      }
    }
  }, []);

  const OTPSendForgotPassword = useCallback(async (phone: string) => {
    try {
      const response = await api.post(
        `${REACT_APP_URL_MS_AUTH}/otp/sms/send/forgot-password?phone_number=${phone}`
      );
      const { message } = response.data;

      openAlert({
        title: "Código enviado",
        description: "SMS enviado com sucesso",
        type: "success",
        buttons: {
          confirmButtonTitle: "Ok",
          cancelButton: false,
        },
      });

      navigate("OTPVerificationForgotPassword", { phone: phone });
    } catch (error) {
      if (error.message === "Network Error") {
        openAlert({
          title: "Sem conexão",
          description: "Verifique sua conexão com a rede",
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });
      } else {
        openAlert({
          title: "Erro inesperado",
          description: `${error?.response?.data?.message}`,
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });
      }
    }
  }, []);

  const login = useCallback(async ({ email, password }: LoginProps) => {
    try {
      const response = await api.post(
        `${REACT_APP_URL_MS_AUTH}/session/create`,
        {
          roleName: 2,
          email,
          password,
        }
      );
      const { token, user } = response.data.data;

      setUser(user);

      await AsyncStorage.multiSet([
        ["@PAM:token", token],
        ["@PAM:user", JSON.stringify(user)],
      ]);
      const consumer = await getConsumer(user.user_id);
      setConsumer(consumer);

      if (!user.phone_verified) {
        OTPSend();
        navigate("OTPVerification", { phone: user.phone });
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

      if (error.message === "Network Error") {
        openAlert({
          title: "Sem conexão",
          description: "Verifique sua conexão com a rede",
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setUser({} as User);
      setConsumer({} as Consumer);
      setUserLocation(undefined);

      await AsyncStorage.multiRemove([
        "@PAM:token",
        "@PAM:user",
        "@PAM:consumer",
        "@PAM:cart",
        "@PAM:location",
      ]);
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

      if (error.message === "Network Error") {
        openAlert({
          title: "Sem conexão",
          description: "Verifique sua conexão com a rede",
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });
      }
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      const response = await api.post(
        `${REACT_APP_URL_MS_AUTH}/user/forgot-password?email=${email}&userRole=2`
      );
      const { message } = response.data;
      Alert.alert("Aviso!", message);
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

      if (error.message === "Network Error") {
        openAlert({
          title: "Sem conexão",
          description: "Verifique sua conexão com a rede",
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });
      }
    }
  }, []);

  const register = useCallback(async (data: registerProps) => {
    try {
      const { email, password } = data;
      const response = await api.post(
        `${REACT_APP_URL_MS_AUTH}/user/create`,
        data
      );
      const { message, status } = response.data;

      createConsumer({
        document: data.document,
        email: data.email,
        fantasy_name: data.fullname,
        legal_name: data.fullname,
        phone_number: data.phone,
        user_id: response.data.data.user_id,
      });

      openAlert({
        title: "Cadastrado com sucesso",
        description: message,
        type: "success",
        buttons: {
          confirmButtonTitle: "Ok",
          cancelButton: false,
          onConfirm: async () => await login({ email, password }),
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

      if (error.message === "Network Error") {
        openAlert({
          title: "Sem conexão",
          description: "Verifique sua conexão com a rede",
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });
      }
    }
  }, []);

  const loadStoragedUser = useCallback(async () => {
    try {
      const storagedUser = await AsyncStorage.getItem("@PAM:user");
      const storagedConsumer = await AsyncStorage.getItem("@PAM:consumer");
      const storagedLocation = await AsyncStorage.getItem("@PAM:location");

      const userData = storagedUser ? JSON.parse(storagedUser) : null;
      const consumerData = storagedConsumer
        ? JSON.parse(storagedConsumer)
        : null;
      const locationData = storagedLocation
        ? JSON.parse(storagedLocation)
        : null;

      if (userData && consumerData) {
        setConsumer(consumerData);
        setUser(userData);
      }

      if (locationData) setUserLocation(locationData);
    } catch (error) {
      logWarning("AuthContext.loadStorageData", "Erro ao carregar dados do AsyncStorage");
    } finally {
      await SplashScreen.hideAsync();
    }
  }, []);

  const resetPassword = useCallback(
    async (data: resetProps): Promise<string> => {
      try {
        const response = await api.post(
          `${REACT_APP_URL_MS_AUTH}/user/reset-password`,
          data
        );
        const { message } = response.data;

        return message;
      } catch (error) {
        openAlert({
          title: "Erro inesperado",
          description: "Ocorreu um erro ao tentar alterar sua senha",
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });

        if (error.message === "Network Error") {
          openAlert({
            title: "Sem conexão",
            description: "Verifique sua conexão com a rede",
            type: "error",
            buttons: {
              confirmButtonTitle: "Ok",
              cancelButton: false,
            },
          });
        }
      }
    },
    []
  );

  const updateUser = useCallback(async (changes: UpdateProps) => {
    try {
      setLoading(true)
      const formData = new FormData();

      Object.entries(changes).forEach(([key, value]) =>
        formData.append(key, value)
      );

      const response = await api.put(
        `${REACT_APP_URL_MS_AUTH}/user/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { data, message } = response.data;
      setLoading(false);
      setUser(data);
      await AsyncStorage.setItem("@PAM:user", JSON.stringify(user));

      openAlert({
        title: "Sucesso!",
        description: message,
        type: "success",
        buttons: {
          onConfirm: () => navigate("Tabs", { screen: "Profile" }),
          confirmButtonTitle: "Ok",
          cancelButton: false,
        },
      });
    } catch (error) {
      logError("AuthContext.signUp", error);
      setLoading(false);

      if (shouldShowError(error)) {
        const errorMsg = getErrorMessage(error);
        openAlert({
          title: errorMsg.title,
          description: errorMsg.description,
          type: errorMsg.type,
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });
      }
    }
  }, []);

  const deleteUser = useCallback(async (user_id: string) => {
    const data = [];
    data.push(user_id);
    try {
      const response = await api.delete(
        `${REACT_APP_URL_MS_AUTH}/user/delete`,
        { data: data }
      );

      const { message } = response.data;

      openAlert({
        title: "Sua conta foi excluída",
        description: `${message || "Esperamos que volte novamente"}`,
        type: "success",
        buttons: {
          confirmButtonTitle: "Ok",
          cancelButton: false,
          onConfirm: () => logout(),
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

      if (error.message === "Network Error") {
        openAlert({
          title: "Sem conexão",
          description: "Verifique sua conexão com a rede",
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });
      }
    }
  }, []);

  useEffect(() => {
    NotificationHelper.registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        logInfo("AuthContext.notificationResponse", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const notifPush = useCallback(
    (title: string, body: string, timerTrigger: number) => {
      NotificationHelper.send(title, body, timerTrigger);
    },
    []
  );

  useEffect(() => {
    loadStoragedUser();
  }, []);

  const contextValues = {
    user,
    setUser,
    signUpData,
    setSignUpData,
    login,
    forgotPassword,
    resetPassword,
    register,
    updateUser,
    deleteUser,
    logout,
    OTPSend,
    OTPSendForgotPassword,
    photoProfile,
    setPhotoProfile,
    notifPush,
    loading,
    setLoading
  };

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};

export { useAuth, AuthProvider };
