import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_URL_MS_AUTH } from "@env";
// import { navigate } from "../routes/rootNavigation";

const api = axios.create({
  timeout: 2000,
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
    if (error.response.status === 401) await AsyncStorage.clear();

    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response.status === 401) await AsyncStorage.clear();

    return Promise.reject(error || "Something went wrong");
  }
);

export default api;
