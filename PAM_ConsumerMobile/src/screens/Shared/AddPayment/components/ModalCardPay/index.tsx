import React from "react";
import { View, Modal, Text, Pressable, TouchableOpacity } from "react-native";
import styles from "./styles";
import { theme } from "../../../../../styles/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { globalStyles } from "../../../../../styles/globalStyles";
import Cards from "./Cards";
import { navigate } from "../../../../../routes/rootNavigation";
import { AntDesign } from "@expo/vector-icons";
import { useThemeContext } from "../../../../../hooks/themeContext";
// import { Container } from './styles';

interface IModal {
  modalVisible: boolean;
  setModalVisible: (modalVisible) => void;
}

const ModalCardPay = ({ modalVisible, setModalVisible }: IModal) => {
  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={[themeController(styles.centeredView)]}
          onTouchEnd={() => setModalVisible(false)}
        >
          <View style={themeController(styles.modalView)}>
            <Text
              style={[themeController(globalStyles.title), { fontSize: 16 }]}
            >
              Selecione o tipo de cartão
            </Text>
            <TouchableOpacity
              style={themeController(styles.rowContainer)}
              onPress={() => navigate("AddPayment", { type: "Crédito" })}
            >
              <Cards
                text="Crédito"
                icon={
                  <AntDesign
                    name="creditcard"
                    size={20}
                    color={dynamicTheme.colors.primary}
                  />
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={themeController(styles.rowContainer)}
              onPress={() => navigate("AddPayment", { type: "Débito" })}
            >
              <Cards
                text="Débito"
                icon={
                  <MaterialIcons
                    name="credit-card"
                    size={20}
                    color={dynamicTheme.colors.primary}
                  />
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalCardPay;
