import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Button, RadioButton } from "../../../../components/Shared";
import { globalStyles } from "../../../../styles/globalStyles";
import { styles } from "./styles";
import { theme } from "../../../../styles/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../../../hooks/UserContext";
import { useFormContext, Controller } from "react-hook-form";
import { OrderProps } from "../..";
import { useCart } from "../../../../hooks/CartContext";
import { formatPrice } from "../../../../utils/formatPrice";
import SelectOrderShipping from "../../../Shared/SelectOrderShipping";
import { usePartner } from "../../../../hooks/PartnerContext";
import UnavailableStoreModal from "../../../Shared/UnavailableStoreModal";
import { useOffer } from "../../../../hooks/OfferContext";
import { useOrder } from "../../../../hooks/OrderContext";
import { useThemeContext } from "../../../../hooks/themeContext";

interface Address {
  address_id: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  zip_code: string;
  active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  latitude: string | number;
  longitude: string | number;
}

const Address: React.FC = () => {
  const { dynamicTheme, themeController } = useThemeContext();
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showShippingWays, setShowShippingWays] = useState(false);

  const { freight, cartBranch } = useCart();
  const { addresses, getAllAddresses, defaultAddress } = useUser();
  const { getStoreIsAvailable } = useOffer();
  const { navigate } = useNavigation();
  const { getStore } = usePartner();

  const [partnerAddresses, setPartnerAddresses] = useState<Address[]>();
  const [showUnavailableStoreModal, setShowUnavailableStoreModal] =
    useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useFormContext<OrderProps>();

  const isAvailableStore = async (newAddressId: string) =>
    new Promise(async (resolve, reject) => {
      try {
        const address = addresses.find(
          ({ address_id }) => newAddressId === address_id
        );

        const isAvailable = await getStoreIsAvailable(
          cartBranch?.branch_id,
          Number(address.latitude),
          Number(address.longitude)
        );

        if (!isAvailable) {
          setShowUnavailableStoreModal(true);
        }

        resolve(isAvailable);
      } catch (err) {
        reject(err);
      }
    });

  const getStoreAdressDetails = async (branch: string) => {
    const { address } = await getStore(branch);
    const aux = [];
    aux.push(address);
    setPartnerAddresses(aux);
  };

  useEffect(() => {
    getAllAddresses();
    if (!!cartBranch?.branch_id) getStoreAdressDetails(cartBranch?.branch_id);
  }, []);

  return (
    <View style={styles.container}>
      <UnavailableStoreModal
        title="Endereço indisponível"
        description="A loja responsável pelo produto que você quer adquirir não está disponível neste endereço."
        isVisible={showUnavailableStoreModal}
        setIsVisible={setShowUnavailableStoreModal}
      />
      <SelectOrderShipping
        isVisible={showShippingWays}
        setIsVisible={setShowShippingWays}
      />

      {!freight?.name ||
      freight?.name.toLowerCase().indexOf("retirada") === -1 ? (
        <>
          <Text
            style={[
              themeController(styles.subtitle),
              errors?.address_id && themeController(globalStyles.requiredField),
            ]}
          >
            Receba no seu endereço
          </Text>
          <Text style={themeController(styles.description)}>
            Selecione um endereço para entrega
          </Text>

          <View style={themeController(styles.addressesContainer)}>
            {addresses.length > 0 ? (
              addresses.map((item) => {
                let address = `${item.city}, ${item.state}, ${item.zip_code}, ${item.street}, ${item.district}, ${item.number}`;
                if (item.complement) address += `, ${item.complement}.`;
                return (
                  <Controller
                    key={item.address_id}
                    name="address_id"
                    control={control}
                    render={({ field }) => (
                      <RadioButton
                        value={item.address_id}
                        checked={item.address_id === field.value}
                        onPress={async () => {
                          const available = await isAvailableStore(
                            item.address_id
                          );

                          if (available) {
                            field.onChange(item.address_id);
                            setValue("address", item);
                          }
                        }}
                        containerStyle={[
                          themeController(styles.addressCard),
                          item.address_id === field.value &&
                            themeController(styles.addressCardSelected),
                        ]}
                        contentContainerStyle={themeController(
                          styles.addressContent
                        )}
                      >
                        <Text style={themeController(styles.addressTitle)}>
                          {item.description}
                        </Text>
                        <Text
                          style={themeController(styles.addressDescription)}
                        >
                          {address}
                        </Text>
                      </RadioButton>
                    )}
                  />
                );
              })
            ) : (
              <Text style={themeController(globalStyles.addressesEmpty)}>
                Nenhum endereço cadastrado
              </Text>
            )}
          </View>
        </>
      ) : (
        <>
          <Text
            style={[
              themeController(styles.subtitle),
              errors?.address_id && themeController(globalStyles.requiredField),
            ]}
          >
            Retirada local em
          </Text>
          <Text style={themeController(styles.description)}>
            Selecione um endereço para retirada
          </Text>

          <View style={themeController(styles.addressesContainer)}>
            {partnerAddresses?.length > 0 &&
              partnerAddresses?.map((item) => {
                let address = `${item.city}, ${item.state}, ${item.zip_code}, ${item.street}, ${item.district}, ${item.number}`;
                if (item.complement) address += `, ${item.complement}.`;
                return (
                  <Controller
                    key={item.address_id}
                    name="address_partner"
                    control={control}
                    render={({ field }) => (
                      <RadioButton
                        value={item.address_id}
                        checked={field.value}
                        onPress={() => {
                          field.onChange(true);
                        }}
                        containerStyle={[
                          themeController(styles.partnerAddressCard),
                          field.value &&
                            themeController(styles.addressCardSelected),
                        ]}
                      >
                        <Text
                          style={themeController(styles.addressDescription)}
                        >
                          {address}
                        </Text>
                      </RadioButton>
                    )}
                  />
                );
              })}
          </View>
        </>
      )}
      <Text
        style={[
          themeController(styles.subtitle),
          themeController(styles.shippingWayTitle),
          errors?.shipping_option &&
            themeController(globalStyles.requiredField),
        ]}
      >
        Forma de envio
      </Text>
      <Text style={themeController(styles.description)}>
        Selecione como deseja receber seu pedido
      </Text>

      <View style={themeController(styles.addressesContainer)}>
        {freight ? (
          <Text style={[themeController(styles.shippingWayText)]}>
            <Text style={themeController(globalStyles.textHighlight)}>
              {freight.name} -{" "}
            </Text>
            {freight.value === 0 ? "GRÁTIS" : formatPrice(freight.value)}
          </Text>
        ) : (
          <Text style={themeController(globalStyles.listEmpty)}>
            Nenhuma forma de envio foi selecionada
          </Text>
        )}

        <TouchableOpacity
          style={themeController(styles.newAddressButton)}
          onPress={() => setShowShippingWays(true)}
        >
          <MaterialIcons
            name="local-shipping"
            size={24}
            color={dynamicTheme.colors.primary}
          />
          <Text style={[themeController(styles.newAddressButtonText)]}>
            Selecionar forma de envio
          </Text>
        </TouchableOpacity>

        {errors?.shipping_option && (
          <Text
            style={[
              themeController(globalStyles.helperTextErrorStyle),
              themeController(styles.errorText),
            ]}
          >
            {errors?.shipping_option?.message}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Address;
