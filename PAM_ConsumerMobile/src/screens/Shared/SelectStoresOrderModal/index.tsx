import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";
import { Ionicons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import { useSearchFilter } from "../../../hooks/SearchFilterContext";
import { useThemeContext } from "../../../hooks/themeContext";

interface ISelectStoresOrderModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onOrderStores: (orderBy: string, sortBy: string) => void;
}

const SelectStoresOrderModal = ({
  isVisible,
  setIsVisible,
  onOrderStores,
}: ISelectStoresOrderModalProps) => {
  const { orderStoresBy, setOrderStoresBy, clearStoreOrders, setSortStoresBy } =
    useSearchFilter();
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
            <Text style={themeController(styles.title)}>Ordenar lojas</Text>
            <TouchableOpacity onPress={() => toggleModalVisible()}>
              <Ionicons name="close" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>

          <Text style={themeController(styles.subtitle)}>
            Selecione uma forma de ordenação
          </Text>

          <View style={themeController(styles.buttonsContainer)}>
            <TouchableOpacity
              onPress={() => {
                if (orderStoresBy === "OrdersNumbers") {
                  onOrderStores("", "Asc");
                } else {
                  onOrderStores("OrdersNumbers", "Desc");
                }

                setIsVisible(false);
              }}
              style={[
                themeController(styles.orderCard),
                orderStoresBy === "OrdersNumbers" &&
                  themeController(styles.orderCardSelected),
              ]}
            >
              <View style={themeController(styles.orderHeader)}>
                <FontAwesome5
                  name="box"
                  size={16}
                  color={
                    orderStoresBy === "OrdersNumbers"
                      ? dynamicTheme.colors.primary
                      : dynamicTheme.colors.gray
                  }
                />
                <Text
                  style={[
                    themeController(styles.orderTitle),
                    orderStoresBy === "OrdersNumbers" &&
                      themeController(styles.orderTitleSelected),
                  ]}
                >
                  Quantidade de pedidos
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (orderStoresBy === "Ratings") {
                  onOrderStores("", "Asc");
                } else {
                  onOrderStores("Ratings", "Desc");
                }

                setIsVisible(false);
              }}
              style={[
                themeController(styles.orderCard),
                orderStoresBy === "Ratings" &&
                  themeController(styles.orderCardSelected),
              ]}
            >
              <View style={themeController(styles.orderHeader)}>
                <FontAwesome
                  name="star"
                  size={20}
                  color={
                    orderStoresBy === "Ratings"
                      ? dynamicTheme.colors.primary
                      : dynamicTheme.colors.gray
                  }
                />
                <Text
                  style={[
                    themeController(styles.orderTitle),
                    orderStoresBy === "Ratings" &&
                      themeController(styles.orderTitleSelected),
                  ]}
                >
                  Avaliações
                </Text>
              </View>
            </TouchableOpacity>
          </View>

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
    </Modal>
  );
};

export default SelectStoresOrderModal;
