import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_URL_MS_AUTH } from "@env";
import { navigate } from "../routes/rootNavigation";

const api = axios.create({
  timeout: 30000,
});

api.interceptors.request.use(
  async (config) => {
    const [token, user] = await AsyncStorage.multiGet([
      "@PAM:token",
      "@PAM:user",
    ]);

    if (token[1]) config.headers.Authorization = `Bearer ${token[1]}`;
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    // Se receber 401 (Unauthorized), significa que o token expirou
    if (error?.response?.status === 401) {
      console.log("⚠️ Token expirado (401), redirecionando para login...");

      // Limpar apenas o token, manter outros dados
      await AsyncStorage.multiRemove([
        "@PAM:token",
        "@PAM:user",
        "@PAM:consumer",
      ]);

      // Redirecionar para a tela de login
      navigate("PhoneAuth");
    }

    return Promise.reject(error || "Something went wrong");
  }
);

export default api;
