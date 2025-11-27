import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View, Image } from "react-native";
import { Button, Input } from "../../../../components/Shared";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { useUser } from "../../../../hooks/UserContext";
import { Address } from "../../../../interfaces/User";
import { useAuth } from "../../../../hooks/AuthContext";
import { globalStyles } from "../../../../styles/globalStyles";
import { styles } from "./styles";
import { useCart } from "../../../../hooks/CartContext";
import Purchase from "../../../../components/Purchase";
import { MaskedText } from "react-native-mask-text";
import { formatPrice } from "../../../../utils/formatPrice";
import { OrderProps } from "../..";
import { orderStyles } from "../../../../styles/orderStyles";
import { useOrder } from "../../../../hooks/OrderContext";
import { useThemeContext } from "../../../../hooks/themeContext";

const Review: React.FC = () => {
  const { user } = useAuth();
  const { getAddress } = useUser();
  const { pay, setPay } = useOrder();
  const { cart, totalAmount, freight } = useCart();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useFormContext<OrderProps>();

  const { dynamicTheme, themeController } = useThemeContext();
  const { payment_card, payment_method, change, shipping_option } = watch();
  const { branchOrderSettings } = useOrder();

  const [recipientAddress, setRecipientAddress] = useState<string>();

  const transshipment = Number(change);
  const transshipmentDiff = transshipment / 100 - totalAmount;

  const selectedOrderShipping = branchOrderSettings.shipping_options.find(
    ({ delivery_option_id }) => shipping_option === delivery_option_id
  );

  const getSelectedAddress = async () => {
    const addressId = watch("address_id");

    if (!addressId) return;

    const data = await getAddress(addressId);

    let address = `${data.city}, ${data.state}, ${data.zip_code}, ${data.street}, ${data.district}, ${data.number}`;
    if (data.complement) address += `, ${data.complement}.`;

    setRecipientAddress(address);
  };

  useEffect(() => {
    getSelectedAddress();
  }, []);

  return (
    <View>
      <Text style={themeController(globalStyles.subtitle)}>
        Forma de entrega
      </Text>
      <Text style={themeController(globalStyles.description)}>
        Confira se os dados de envio estão corretos
      </Text>

      <View style={themeController(orderStyles.informationContainer)}>
        <Text style={themeController(orderStyles.recipientText)}>
          {freight?.name.toLowerCase().indexOf("retirada") > -1
            ? "Entregar"
            : "Enviar"}{" "}
          para{" "}
          <Text style={themeController(globalStyles.textHighlight)}>
            {user.profile.fullname}
          </Text>
        </Text>

        <Text style={themeController(orderStyles.addressText)}>
          {recipientAddress}
        </Text>
        <Text style={themeController(orderStyles.recipientText)}>
          Entrega será feita por{" "}
          <Text style={themeController(globalStyles.textHighlight)}>
            {selectedOrderShipping.name}
          </Text>
        </Text>
      </View>

      <Text style={themeController(globalStyles.subtitle)}>
        Forma de pagamento
      </Text>
      <Text style={themeController(globalStyles.description)}>
        A transação será descontada da seguinte forma
      </Text>

      <View style={themeController(orderStyles.informationContainer)}>
        <View style={themeController(orderStyles.purchaseInformationBeetween)}>
          <Text style={themeController(globalStyles.textHighlight)}>
            Método de pagamento:
          </Text>
          <Text style={themeController(orderStyles.paymentTitle)}>
            {pay.find(({ item }) => item === payment_method).label}
          </Text>
        </View>
        <View style={themeController(orderStyles.purchaseInformationBeetween)}>
          <Text style={themeController(globalStyles.textHighlight)}>
            Parcelamento:
          </Text>
          <Text style={themeController(orderStyles.paymentMethod)}>
            {payment_card?.installments
              ? payment_card?.installments
              : "À vista"}
          </Text>
        </View>
      </View>

      <Text style={themeController(globalStyles.subtitle)}>
        Você está comprando
      </Text>
      <Text style={themeController(globalStyles.description)}>
        Estes são os itens que você inseriu no carrinho
      </Text>
      <View style={themeController(orderStyles.informationContainer)}>
        {cart.map((item) => (
          <View
            key={item.product.product_id}
            style={themeController(orderStyles.purchaseContainer)}
          >
            <View style={themeController(orderStyles.purchaseContent)}>
              <Image
                style={orderStyles.purchaseImage}
                source={{
                  uri: item.product.images.find(
                    ({ product_image_id }) =>
                      item.product.image_default === product_image_id
                  ).url,
                }}
              />
              <View>
                <Text
                  numberOfLines={1}
                  style={themeController(orderStyles.purchaseName)}
                >
                  {item.product.name}
                </Text>
                <Text style={themeController(orderStyles.purchasePrice)}>
                  {formatPrice(item.product.price)}
                </Text>
              </View>
            </View>
            <Text style={themeController(orderStyles.purchaseQuantity)}>
              {item.quantity}x
            </Text>
          </View>
        ))}
        <View style={themeController(orderStyles.purchaseInformationBeetween)}>
          <Text style={themeController(globalStyles.textHighlight)}>
            Frete:
          </Text>
          <Text
            style={[
              themeController(orderStyles.purchaseTotal),
              freight?.value === 0 && themeController(orderStyles.freightFree),
            ]}
          >
            {freight?.value === 0 ? "GRÁTIS" : formatPrice(freight?.value)}
          </Text>
        </View>
        <View style={themeController(orderStyles.purchaseInformationBeetween)}>
          <Text style={themeController(globalStyles.textHighlight)}>
            Total:
          </Text>
          <Text style={themeController(orderStyles.purchaseTotal)}>
            {formatPrice(totalAmount)}
          </Text>
        </View>
      </View>

      {transshipment > 0 && (
        <>
          <Text style={themeController(globalStyles.subtitle)}>Seu troco</Text>
          <Text style={themeController(globalStyles.description)}>
            Valor que você receberá de volta
          </Text>

          <View style={themeController(orderStyles.informationContainer)}>
            <View>
              <View
                style={themeController(orderStyles.purchaseInformationBeetween)}
              >
                <Text style={themeController(globalStyles.textHighlight)}>
                  Valor informado para troco:
                </Text>
                <Text style={themeController(orderStyles.purchaseTotal)}>
                  {formatPrice(transshipment / 100)}
                </Text>
              </View>

              <View
                style={themeController(orderStyles.purchaseInformationBeetween)}
              >
                <Text style={themeController(globalStyles.textHighlight)}>
                  Total do pedido:
                </Text>
                <Text style={themeController(orderStyles.purchaseTotal)}>
                  {formatPrice(totalAmount)}
                </Text>
              </View>

              {transshipment > totalAmount ? (
                <Text style={themeController(orderStyles.transshipmentText)}>
                  Você receberá{" "}
                  <Text style={themeController(globalStyles.textHighlight)}>
                    {formatPrice(transshipmentDiff)}
                  </Text>{" "}
                  de troco.
                </Text>
              ) : (
                <Text
                  style={themeController(orderStyles.transshipmentTextWarn)}
                >
                  Valor informado menor que o total da compra.
                </Text>
              )}
            </View>
          </View>
        </>
      )}

      <Text style={themeController(globalStyles.subtitle)}>Observações</Text>
      <Text style={themeController(globalStyles.description)}>
        Aqui você pode inserir qualquer instrução ou detalhe sobre sua compra.
      </Text>

      <Controller
        name="observation"
        control={control}
        render={({ field }) => (
          <Input
            multiline
            textInputStyle={styles.noteInput}
            value={field.value}
            refInput={field.ref}
            error={!!errors?.observation}
            helperText={errors?.observation?.message}
            returnKeyType="next"
            placeholder="Instruções de entrega, detalhes do serviço..."
            onChangeText={(text) => field.onChange(text)}
          />
        )}
      />
    </View>
  );
};

export default Review;
