import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Header, RadioButton } from "../../components/Shared";
import { globalStyles } from "../../styles/globalStyles";
import { useUser } from "../../hooks/UserContext";
import { useAuth } from "../../hooks/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";
import { theme } from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";
import { useGlobal } from "../../hooks/GlobalContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeContext } from "../../hooks/themeContext";

const Addresses: React.FC = () => {
  const {
    consumer,
    addresses,
    getAllAddresses,
    removeAddress,
    updateConsumer,
    setUserLocation,
    defaultAddress,
  } = useUser();
  const { dynamicTheme, themeController } = useThemeContext();

  const { openAlert } = useGlobal();
  const { navigate, goBack } = useNavigation();

  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const updateDefaultAddress = async (address_id: string) => {
    setSelectedAddress(address_id);
    goBack();

    await updateConsumer({
      ...consumer,
      default_address: address_id,
    });

    setUserLocation(undefined);
    await AsyncStorage.removeItem("@PAM:location");
  };

  const handleRemoveAddress = (address_id: string) => {
    openAlert({
      title: "Tem certeza?",
      description: "Deseja remover este endereço?",
      type: "warning",
      buttons: {
        onConfirm: async () => {
          await removeAddress([address_id]);
          if (address_id === selectedAddress) setSelectedAddress("");
          getAllAddresses();
        },
      },
    });
  };

  return (
    <MenuProvider>
      <View style={themeController(globalStyles.container)}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Header backButton />
          <Text style={themeController(globalStyles.title)}>
            Seus endereços
          </Text>

          <View style={themeController(styles.addressesContainer)}>
            {addresses.length > 0 ? (
              addresses?.map((item) => {
                let address = `${item.city}, ${item.state}, ${item.zip_code}, ${item.street}, ${item.district}, ${item.number}`;

                const currentDefaultAddress = selectedAddress
                  ? item.address_id === selectedAddress
                  : item.address_id === defaultAddress.address_id;

                return (
                  <TouchableOpacity
                    key={item.address_id}
                    onPress={() => {
                      updateDefaultAddress(item.address_id);
                    }}
                    style={[
                      themeController(styles.addressCard),
                      currentDefaultAddress && {
                        backgroundColor: dynamicTheme.colors.shadowPrimary,
                      },
                    ]}
                  >
                    {currentDefaultAddress ? (
                      <View
                        style={[
                          themeController(styles.checkFilledContainer),
                          { backgroundColor: dynamicTheme.colors.primary },
                        ]}
                      >
                        <MaterialIcons
                          name="check"
                          size={12}
                          color={dynamicTheme.colors.white}
                        />
                      </View>
                    ) : (
                      <View
                        style={themeController(styles.checkOutlineContainer)}
                      />
                    )}
                    <View style={{ flex: 1 }}>
                      <View style={themeController(styles.addressHeader)}>
                        <Text style={themeController(styles.addressTitle)}>
                          {item.description}
                        </Text>
                        <Menu>
                          <MenuTrigger
                            style={themeController(styles.moreButton)}
                          >
                            <MaterialIcons
                              name="more-vert"
                              size={20}
                              color={dynamicTheme.colors.gray}
                            />
                          </MenuTrigger>
                          <MenuOptions
                            customStyles={{
                              optionsContainer: {
                                borderRadius: 12,
                                maxWidth: 120,
                              },
                            }}
                          >
                            <MenuOption
                              onSelect={() =>
                                navigate("AddAddress", {
                                  address_id: item.address_id,
                                })
                              }
                            >
                              <View
                                style={themeController(
                                  styles.moreOptionsButton
                                )}
                              >
                                <Text
                                  style={themeController(
                                    styles.moreOptionsButtonText
                                  )}
                                >
                                  Editar
                                </Text>
                              </View>
                            </MenuOption>
                            <MenuOption
                              onSelect={() =>
                                handleRemoveAddress(item.address_id)
                              }
                            >
                              <View
                                style={themeController(
                                  styles.moreOptionsButton
                                )}
                              >
                                <Text
                                  style={themeController(
                                    styles.moreOptionsButtonText
                                  )}
                                >
                                  Excluir
                                </Text>
                              </View>
                            </MenuOption>
                          </MenuOptions>
                        </Menu>
                      </View>
                      <Text style={themeController(styles.addressDescription)}>
                        {address}
                      </Text>
                      {item.complement && (
                        <Text style={themeController(styles.addressComplement)}>
                          {item.complement}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={themeController(globalStyles.addressesEmpty)}>
                Nenhum endereço cadastrado
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={themeController(styles.newAddressButton)}
            onPress={() => navigate("AddAddress")}
          >
            <MaterialIcons
              name="add"
              size={24}
              color={dynamicTheme.colors.primary}
            />
            <Text
              style={[
                themeController(styles.newAddressButtonText),
                { color: dynamicTheme.colors.primary },
              ]}
            >
              Adicionar novo endereço
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </MenuProvider>
  );
};

export default Addresses;
