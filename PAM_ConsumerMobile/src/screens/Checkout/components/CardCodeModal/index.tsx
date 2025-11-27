import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import Input from "../../../../components/Input";
import { theme } from "./../../../../styles/theme";
import { useThemeContext } from "../../../../hooks/themeContext";

interface ICardCodeModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onChangeCardCode: (code: string) => void;
  onSubmitCardCode: () => void;
}

const CardCodeModal = ({
  isVisible,
  setIsVisible,
  onChangeCardCode,
  onSubmitCardCode,
}: ICardCodeModalProps) => {
  const { dynamicTheme, themeController } = useThemeContext();

  const [code, setCode] = useState("");
  const [error, setError] = useState<string>("");

  const toggleModalVisible = () => setIsVisible((visible) => !visible);

  const onChangeCVV = (text: string) => {
    if (error && code.length === 3) setError(undefined);
    onChangeCardCode(text);
    setCode(text);
  };

  const onSubmitCVV = () => {
    if (code.length !== 3) {
      setError("Preencha este campo com até 3 dígitos para prosseguir");
      return;
    }

    setIsVisible(false);
    onSubmitCardCode();
  };

  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      visible={isVisible}
      transparent
    >
      <View style={themeController(styles.container)}>
        <KeyboardAvoidingView
          behavior="padding"
          style={themeController(styles.content)}
        >
          <View style={themeController(styles.header)}>
            <Text style={themeController(styles.title)}>
              Código de verificação
            </Text>
            <TouchableOpacity onPress={() => toggleModalVisible()}>
              <Ionicons name="close" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>
          <Text style={themeController(styles.subtitle)}>
            Digite o CVV do seu cartão que fica localizado na parte de trás
            dele.
          </Text>

          <Image
            resizeMode="contain"
            source={require("./../../../../assets/img/card-cvv.png")}
            style={styles.cardImage}
          />

          <View style={themeController(styles.buttonsContainer)}>
            <Input
              label="CVV"
              autoFocus
              placeholder="XXX"
              maxLength={3}
              keyboardType="numeric"
              onChangeText={(text) => onChangeCVV(text)}
              helperText={error}
              error={!!error}
            />

            <TouchableOpacity
              onPress={() => onSubmitCVV()}
              style={[themeController(styles.button)]}
            >
              <Text style={[themeController(styles.buttonText)]}>
                Confirmar
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CardCodeModal;
