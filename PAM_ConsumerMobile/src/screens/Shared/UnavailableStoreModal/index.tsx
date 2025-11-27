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
import { useNavigation } from "@react-navigation/native";
import { useOrder } from "../../../hooks/OrderContext";
import RadioButton from "../../../components/RadioButton";
import { useCart } from "../../../hooks/CartContext";
import { formatPrice } from "../../../utils/formatPrice";
import { globalStyles } from "../../../styles/globalStyles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeContext } from "../../../hooks/themeContext";

interface IUnavailableStoreModalProps {
  title: string;
  description: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const UnavailableStoreModal = ({
  title,
  description,
  isVisible,
  setIsVisible,
}: IUnavailableStoreModalProps) => {
  const { replace, pop } = useNavigation<NativeStackNavigationProp<any>>();
  const { dynamicTheme, themeController } = useThemeContext();

  const toggleModalVisible = () => setIsVisible((visible) => !visible);

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
            <Text style={themeController(styles.title)}>{title}</Text>
            <TouchableOpacity onPress={() => toggleModalVisible()}>
              <Ionicons name="close" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>
          <Text style={themeController(styles.subtitle)}>{description}</Text>

          <View style={themeController(styles.buttonsContainer)}>
            <TouchableOpacity
              onPress={() => toggleModalVisible()}
              style={themeController(styles.button)}
            >
              <Text style={themeController(styles.buttonText)}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UnavailableStoreModal;
