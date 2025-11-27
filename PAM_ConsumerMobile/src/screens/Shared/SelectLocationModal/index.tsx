import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { globalStyles } from "../../../styles/globalStyles";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../../hooks/UserContext";
import * as Location from "expo-location";
import { useGlobal } from "../../../hooks/GlobalContext";
import { Address } from "../../../interfaces/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeContext } from "../../../hooks/themeContext";

interface ISelectLocationModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectLocationModal = ({
  isVisible,
  setIsVisible,
}: ISelectLocationModalProps) => {
  const { openAlert } = useGlobal();
  const { navigate } = useNavigation();
  const { getAllAddresses, setUserLocation } = useUser();
  const { dynamicTheme, themeController } = useThemeContext();

  const [gettingLocation, setGettingLocation] = useState(false);

  const toggleModalVisible = () => setIsVisible((visible) => !visible);

  const handleGetUserLocation = async () => {
    setGettingLocation(true);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        openAlert({
          title: "Sem permissão",
          description:
            "Para utilizar essa função, precisamos ter acesso a sua localização",
          type: "error",
          buttons: {
            cancelButton: false,
            confirmButtonTitle: "Ok",
          },
        });
      }

      let location = await Location.getLastKnownPositionAsync();
      const { coords } = location;

      if (coords) {
        const { latitude, longitude } = coords;

        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        const data: Address = {
          city: response[0]?.city || response[0]?.subregion || "",
          zip_code: response[0]?.postalCode || "",
          number: response[0]?.streetNumber || "",
          street: response[0]?.street || "",
          state: response[0]?.region || "",
          district: response[0]?.district || "",
          complement: "",
          address_id: "1",
          description: "Localização atual",
          latitude,
          longitude,
        };

        let address = `${data.city}, ${data.state}, ${data.zip_code}, ${data.street}, ${data.district}, ${data.number}`;
        if (data.complement) address += `, ${data.complement}.`;

        openAlert({
          title: "Este é seu endereço?",
          description: address,
          type: "warning",
          buttons: {
            onCancel: () => {
              toggleModalVisible();
            },
            onConfirm: async () => {
              toggleModalVisible();
              setUserLocation(data);
              await AsyncStorage.setItem("@PAM:location", JSON.stringify(data));
            },
          },
        });
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setGettingLocation(false);
    }
  };

  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      visible={isVisible}
      transparent
    >
      <View style={themeController(styles.container)}>
        <View style={themeController(styles.content)}>
          <View style={themeController(styles.header)}>
            <Text style={themeController(styles.title)}>
              Selecione uma localização
            </Text>
            <TouchableOpacity onPress={() => toggleModalVisible()}>
              <Ionicons name="close" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>
          <Text style={themeController(styles.subtitle)}>
            Escolha uma forma de selecionar sua localização para ver as ofertas
            da região
          </Text>

          <View style={themeController(styles.buttonsContainer)}>
            <TouchableOpacity
              disabled={gettingLocation}
              onPress={() => handleGetUserLocation()}
              style={themeController(styles.button)}
            >
              {gettingLocation ? (
                <ActivityIndicator size={18} color={theme.colors.white} />
              ) : (
                <MaterialIcons
                  name="my-location"
                  size={24}
                  color={theme.colors.white}
                />
              )}

              <Text style={themeController(styles.buttonText)}>
                Usar minha localização atual
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                getAllAddresses();
                toggleModalVisible();
                navigate("Addresses");
              }}
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
                Selecionar um endereço
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SelectLocationModal;
