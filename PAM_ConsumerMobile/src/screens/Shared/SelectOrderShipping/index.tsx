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
import { useThemeContext } from "../../../hooks/themeContext";

interface ISelectLocationModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectOrderShipping = ({
  isVisible,
  setIsVisible,
}: ISelectLocationModalProps) => {
  const { dynamicTheme, themeController } = useThemeContext();
  const { freight, setFreight } = useCart();
  const { branchOrderSettings } = useOrder();

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
            <Text style={themeController(styles.title)}>Opções de envio</Text>
            <TouchableOpacity onPress={() => toggleModalVisible()}>
              <Ionicons name="close" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>
          <Text style={themeController(styles.subtitle)}>
            Escolha a forma que será enviada o seu pedido.
          </Text>

          <View style={themeController(styles.buttonsContainer)}>
            {branchOrderSettings?.shipping_options.length === 0 && (
              <Text style={themeController(globalStyles.listEmpty)}>
                Infelizmente não há formas de envio disponiveis para o seu
                endereço
              </Text>
            )}
            {branchOrderSettings?.shipping_options
              ?.sort((a, b) => a.value - b.value)
              .map((option) => {
                const isChecked =
                  freight?.delivery_option_id === option.delivery_option_id;
                return (
                  <RadioButton
                    key={option.delivery_option_id}
                    value={option.delivery_option_id}
                    checked={isChecked}
                    onPress={() => {
                      setFreight(option);
                      setIsVisible(false);
                    }}
                    containerStyle={[
                      themeController(styles.shippingCard),
                      isChecked && themeController(styles.shippingCardSelected),
                    ]}
                    // contentContainerStyle={themeController(styles.})
                  >
                    <View>
                      <View style={themeController(styles.shippingHeader)}>
                        <Text style={themeController(styles.shippingTitle)}>
                          {option.name}
                        </Text>
                        {/* {isChecked && (
                        <View style={themeController(styles.defaultShippingContainer)}>
                          <Text style={themeController(styles.defaultShipping)}>
                            Selecionado
                          </Text>
                        </View>
                      )} */}
                      </View>
                      <Text style={themeController(styles.shippingDescription)}>
                        {option?.value === 0
                          ? "Grátis"
                          : formatPrice(option.value)}
                      </Text>
                    </View>
                  </RadioButton>
                );
              })}

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

export default SelectOrderShipping;
