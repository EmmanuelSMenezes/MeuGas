import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ImageStyle,
  StyleSheetProperties,
  TextStyle,
  ViewStyle,
  StyleProp,
} from "react-native";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_URL_MS_AUTH } from "@env";
import { ITheme } from "../interfaces/Utils";
import api from "../services/api";
import { theme } from "../styles/theme";

interface IThemeValues {
  dynamicTheme: ITheme;
  setDynamicTheme: React.Dispatch<React.SetStateAction<ITheme>>;
  themeController: (
    style: ViewStyle | TextStyle | ImageStyle
  ) => ViewStyle | TextStyle | ImageStyle;
}

const ThemeContext = createContext({} as IThemeValues);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [signalRThemeConnection, setSignalRThemeConnection] = useState<
    HubConnection | undefined
  >();

  const [defaultTheme, setDefaultTheme] = useState({
    fonts: {
      light_italic: "Poppins_300Light_Italic",
      light: "Poppins_300Light",
      italic: "Poppins_400Regular_Italic",
      regular: "Poppins_400Regular",
      medium: "Poppins_500Medium",
      bold: "Poppins_700Bold",
    },

    colors: {
      primary: "#5271FF",
      primaryBackground: "hsl(0, 0%, 90.9%)",
      secondary: "#D5573B",
      text: "rgba(0, 0, 0, 0.54)",
      black: "#242424",
      gray: "#707070",
      lightgray: "hsl(0, 0%, 94.9%)",
      white: "#fff",
      background: "#fbfbfb",
      shadow: "#00000020",
      shadowPrimary: "#007EA715",
      success: "#03ac13",
      danger: "#ca3433",
      warning: "#ffbb33",
      blue: "#007EA7",
      shadowBlue: "#007EA715",
      gold: "#fe7914",
      orange: "#FFA500",
    },
  });
  const [dynamicTheme, setDynamicTheme] = useState(defaultTheme);

  const themeController = (style: TextStyle) => {
    const stylePropertiers = Object.entries(style);
    stylePropertiers.forEach(([key, value]) => {
      if (
        key === "backgroundColor" ||
        key === "color" ||
        key === "borderColor"
      ) {
        if (
          value === theme.colors.primary ||
          value === defaultTheme.colors.primary
        ) {
          style[key] = dynamicTheme.colors.primary;
        } else if (
          value === theme.colors.shadowPrimary ||
          value === defaultTheme.colors.shadowPrimary
        ) {
          style[key] = dynamicTheme.colors.shadowPrimary;
        }
      }
    });

    return style;
  };

  useEffect(() => {
    setDefaultTheme(dynamicTheme);
  }, [dynamicTheme]);

  const createHubConnectionSignalR = useCallback(async () => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${REACT_APP_URL_MS_AUTH}/style-hub`)
      .withAutomaticReconnect()
      .build();

    await newConnection.start();

    setSignalRThemeConnection(newConnection);
  }, []);

  const getDefaultTheme = useCallback(async () => {
    const { data } = await api.get(
      `${REACT_APP_URL_MS_AUTH}/settings/styleapp/get`
    );

    if (!data.data) return;

    const newTheme = {
      ...data.data,
      colors: {
        ...data.data.colors,
        shadowPrimary: data.data.colors.primary + "20",
      },
    };

    setDefaultTheme(newTheme);
    setDynamicTheme(newTheme);
  }, []);

  useEffect(() => {
    createHubConnectionSignalR();
    getDefaultTheme();
  }, []);

  useEffect(() => {
    if (
      signalRThemeConnection &&
      signalRThemeConnection.state === "Connected"
    ) {
      signalRThemeConnection.invoke("JoinCommunicationStyle");
      signalRThemeConnection.on("RefreshStyle", (_, theme) => {
        const { primary } = JSON.parse(theme).colors;

        setDynamicTheme((oldTheme) => ({
          ...oldTheme,
          colors: {
            ...oldTheme.colors,
            primary,
            shadowPrimary: primary + "10",
          },
        }));
      });
    }
  }, [signalRThemeConnection]);

  const contextValues = {
    dynamicTheme,
    setDynamicTheme,
    themeController,
  };

  return (
    <ThemeContext.Provider value={contextValues}>
      {children}
    </ThemeContext.Provider>
  );
};

const useThemeContext = () => {
  const context = useContext(ThemeContext);

  return context;
};

export { ThemeProvider, ThemeContext, useThemeContext };
