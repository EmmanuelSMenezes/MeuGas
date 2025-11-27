import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import * as Location from "expo-location";
import { useGlobal } from "../../../hooks/GlobalContext";
import { Camera } from "expo-camera";
import { PermissionResources } from "../../../interfaces/Utils";
import { useThemeContext } from "../../../hooks/themeContext";

interface IRequestPermissionsModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
  setIsLoading?: boolean;
  permissions: PermissionResources[];
}

const RequestPermissionsModal = ({
  isVisible,
  setIsVisible,
  permissions,
}: IRequestPermissionsModalProps) => {
  const { openAlert } = useGlobal();
  const { dynamicTheme, themeController } = useThemeContext();
  const [currentPermissionIndex, setCurrentPermissionIndex] =
    useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentPermissionToRequest: PermissionResources =
    permissions[currentPermissionIndex];

  const toggleModalVisible = () => {
    openAlert({
      title: "Sem permissão",
      description:
        "Você não concedeu acesso a essa permissão. Algumas funcionalidades podem não funcionar corretamente",
      type: "warning",
      buttons: {
        cancelButton: false,
        confirmButtonTitle: "Ok",
      },
    });
    setIsVisible((visible) => !visible);
  };

  const requestPermissions = async () => {
    setIsLoading((loading) => !loading);

    let status = "denied";

    switch (currentPermissionToRequest) {
      case "camera":
        const { status: cameraStatus } =
          await Camera.requestCameraPermissionsAsync();

        status = cameraStatus;
        break;
      case "location":
        const { status: locationStatus } =
          await Location.requestForegroundPermissionsAsync();

        status = locationStatus;
        break;
      default:
        break;
    }

    if (status !== "granted") {
      openAlert({
        title: "Sem permissão",
        description:
          "Você não concedeu acesso a essa permissão. Algumas funcionalidades podem não funcionar corretamente",
        type: "warning",
        buttons: {
          cancelButton: false,
          confirmButtonTitle: "Ok",
        },
      });
    }

    if (currentPermissionIndex + 1 < permissions.length) {
      setCurrentPermissionIndex((index) => index + 1);
    } else {
      setIsVisible(false);
      openAlert({
        title: "Tudo pronto",
        description: "Agora você já pode aproveitar o aplicativo",
        type: "success",
        buttons: {
          cancelButton: false,
          confirmButtonTitle: "Ok",
        },
      });
    }

    setIsLoading((loading) => !loading);
  };

  const permissionMessages = {
    camera: {
      title: "Acesso à câmera",
      description:
        "Alguns recursos do aplicativo podem exigir o uso da sua câmera. Mas fique tranquilo, este recurso só será usado quando requisitado pela funcionalidade.",
    },
    location: {
      title: "Acesso à localização",
      description:
        "Alguns recursos do aplicativo podem exigir o uso da sua localização. Mas fique tranquilo, este recurso só será usado quando requisitado pelafuncionalidade.",
    },
  };

  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      visible={isVisible && permissions.length > 0}
      transparent
    >
      <View style={themeController(styles.container)}>
        <View style={themeController(styles.content)}>
          <View style={themeController(styles.header)}>
            <Text style={themeController(styles.title)}>
              {permissionMessages[currentPermissionToRequest]?.title}
            </Text>
            <TouchableOpacity onPress={() => toggleModalVisible()}>
              <Ionicons name="close" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>
          <Text style={themeController(styles.subtitle)}>
            {permissionMessages[currentPermissionToRequest]?.description}
          </Text>

          <View style={themeController(styles.buttonsContainer)}>
            <TouchableOpacity
              disabled={isLoading}
              onPress={() => requestPermissions()}
              style={themeController(styles.button)}
            >
              {isLoading && (
                <ActivityIndicator size={18} color={theme.colors.white} />
              )}

              <Text style={themeController(styles.buttonText)}>
                Conceder permissão
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleModalVisible()}
              style={[
                themeController(styles.button),
                themeController(styles.buttonSecondary),
              ]}
            >
              <Text
                style={[
                  themeController(styles.buttonText),
                  themeController(styles.buttonSecondaryText),
                ]}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RequestPermissionsModal;
