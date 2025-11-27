import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, FlatList, Image } from "react-native";
import {
  Button,
  Input,
  MaskedInput,
  RadioButton,
} from "../../../../components/Shared";
import { styles } from "./styles";
import Select, { IData } from "../../../../components/Select";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { globalStyles } from "../../../../styles/globalStyles";
import { OrderProps } from "../..";
import { useOrder } from "../../../../hooks/OrderContext";
import { OrderPayment } from "../../../../interfaces/Order";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { useUser } from "../../../../hooks/UserContext";
import { formatCardNumber } from "../../../../utils/formatCardNumber";
import { useNavigation } from "@react-navigation/native";
import Payment from "payment";
import { useThemeContext } from "../../../../hooks/themeContext";
import { useCart } from "../../../../hooks/CartContext";
const images = require("../../../../components/CreditCard/card-images");

const validate = Payment.fns;

interface IPay {
  payments: OrderPayment;
}

interface IPaymentLocal {
  payment_local_id: string;
  payment_local_name: string;
}

const Payments = ({ payments }: IPay) => {
  const installments = [
    {
      item: "i1",
      label: "1x de R$ 100,00",
    },
    {
      item: "i2",
      label: "2x de R$ 50,00",
    },
    {
      item: "i3",
      label: "3x de R$ 33,33",
    },
    {
      item: "i4",
      label: "4x de R$ 25,00",
    },
    {
      item: "i5",
      label: "5x de R$ 20,00",
    },
    {
      item: "i6",
      label: "6x de R$ 16,67",
    },
    {
      item: "i7",
      label: "7x de R$ 14,30",
    },
    {
      item: "i8",
      label: "8x de R$ 12,50",
    },
    {
      item: "i9",
      label: "9x de R$ 11,11",
    },
    {
      item: "i10",
      label: "10x de R$ 10,00",
    },
    {
      item: "i11",
      label: "11x de R$ 9,10",
    },
    {
      item: "i12",
      label: "12x de R$ 8,33",
    },
  ];

  const { navigate } = useNavigation();
  const { dynamicTheme, themeController } = useThemeContext();

  const [paymentLocals, setPaymentLocals] = useState<IData[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useFormContext<OrderProps>();
  const { getAllCards, consumerCards } = useUser();
  const { pay, setPay, selected, setSelected, getPaymentMinimumPrice } =
    useOrder();
  const { totalAmount, cartBranch } = useCart();

  const getPaymentLocals = async () => {
    const { value_minimum } = await getPaymentMinimumPrice(
      cartBranch.partner_id
    );

    let locals: IData[] = payments.payment_options.map(
      ({ payment_local_id, payment_local_name }) => ({
        item: payment_local_id,
        label: payment_local_name,
      })
    );

    locals = locals.filter(
      ({ item }, index) =>
        locals.findIndex((local) => local.item === item) === index
    );

    if (totalAmount < value_minimum) {
      const paymentLocalIndex = locals.findIndex(
        ({ label }) => label.toUpperCase() === "PAGAMENTO NO APLICATIVO"
      );

      locals.splice(paymentLocalIndex, 1);
    }

    setPaymentLocals(locals);
  };

  useEffect(() => {
    const pays: IData[] = payments.payment_options.map(
      ({ payment_options_id, description }) => ({
        item: payment_options_id,
        label: description,
      })
    );

    setPay(pays);
    getAllCards();
    getPaymentLocals();
  }, []);

  return (
    <View style={themeController(styles.container)}>
      <View style={themeController(styles.paymentsContainer)}>
        <Text style={themeController(globalStyles.subtitle)}>
          Onde deseja fazer o pagamento?
        </Text>
        <Text style={themeController(globalStyles.description)}>
          Selecione onde será realizado o pagamento
        </Text>

        <Controller
          name="payment_local"
          control={control}
          render={({ field }) => (
            <Select
              data={paymentLocals}
              onChange={(item) => {
                field.onChange(item);
                setPay(
                  payments.payment_options
                    .filter(({ payment_local_id }) => payment_local_id === item)
                    .map(({ payment_options_id, description }) => ({
                      item: payment_options_id,
                      label: description,
                    }))
                );
                setSelected("");
                setValue("payment_method", "");
              }}
              value={field.value || ""}
            />
          )}
        />

        {!!errors?.payment_local && (
          <Text style={themeController(globalStyles.helperTextErrorStyle)}>
            {errors?.payment_local?.message}
          </Text>
        )}
      </View>

      {watch("payment_local") && (
        <View style={themeController(styles.paymentsContainer)}>
          <Text style={themeController(globalStyles.subtitle)}>
            Forma de pagamento
          </Text>
          <Text style={themeController(globalStyles.description)}>
            Selecione como deseja realizar o pagamento
          </Text>
          <Controller
            name="payment_method"
            control={control}
            render={({ field }) => (
              <Select
                data={pay}
                onChange={(item) => {
                  setSelected(pay.find((option) => option.item === item).label);
                  field.onChange(item);
                  setValue("change", "");
                }}
                value={field.value || selected}
              />
            )}
          />
          {!!errors?.payment_method && (
            <Text style={themeController(globalStyles.helperTextErrorStyle)}>
              {errors?.payment_method?.message}
            </Text>
          )}

          {!!pay?.find(
            ({ item, label }) =>
              watch("payment_method") === item && label === "Pix"
          ) && (
            <Text style={themeController(globalStyles.description)}>
              Após a confirmação do pedido, será gerado um código para realizar
              o pagamento via pix.
            </Text>
          )}
        </View>
      )}

      {!!selected &&
        selected.toLowerCase().indexOf("cartão") > -1 &&
        paymentLocals
          .find(({ item }) => item === watch("payment_local"))
          ?.label.toUpperCase() !== "PAGAMENTO NA ENTREGA" && (
          <View style={themeController(styles.paymentsContainer)}>
            <Text style={themeController(globalStyles.subtitle)}>
              Selecione o cartão que deseja utilizar
            </Text>
            <Text style={themeController(globalStyles.description)}>
              Caso precise, adicione um novo cartão para prosseguir com a compra
            </Text>

            <View style={themeController(styles.cardsContainer)}>
              {consumerCards.length > 0 ? (
                consumerCards.map((item) => {
                  const type = validate?.cardType(item.number);
                  return (
                    <Controller
                      key={item.card_id}
                      name="payment_card.card_id"
                      control={control}
                      render={({ field }) => (
                        <RadioButton
                          value={item.card_id}
                          checked={item.card_id === field.value}
                          onPress={async () => {
                            field.onChange(item.card_id);

                            setValue("payment_card.card_number", item.number);
                            setValue("payment_card.holder", item.name);
                            setValue(
                              "payment_card.expiration_date",
                              item.validity
                            );
                          }}
                          containerStyle={[
                            themeController(styles.cardContainer),
                            item.card_id === field.value &&
                              themeController(styles.selectedCard),
                          ]}
                          contentContainerStyle={themeController(
                            styles.cardContent
                          )}
                        >
                          <Text style={themeController(styles.cardTitle)}>
                            {formatCardNumber(item.number)}
                          </Text>
                          <Text style={themeController(styles.cardDescription)}>
                            {item.name}
                          </Text>
                          <Image
                            style={styles.logo}
                            source={{ uri: type ? images[type] : type }}
                          />
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

            <TouchableOpacity
              style={themeController(styles.newPaymentButton)}
              onPress={() =>
                navigate("AddPayment", {
                  type:
                    selected.toLowerCase().indexOf("crédito") > -1
                      ? "Crédito"
                      : "Débito",
                })
              }
            >
              <MaterialIcons
                name="add"
                size={24}
                color={dynamicTheme.colors.primary}
              />
              <Text style={[themeController(styles.newPaymentButtonText)]}>
                Adicionar novo cartão
              </Text>
            </TouchableOpacity>
          </View>
        )}

      {/* {!!pay?.find(
        ({ item, label }) =>
          watch("payment_method") === item &&
          selected.toLowerCase().indexOf("crédito") > -1
      ) && (
        <View style={themeController(styles.paymentsContainer)}>
          <Text style={themeController(globalStyles.subtitle)}>
            Meios de pagamento
          </Text>
          <Text style={themeController(globalStyles.description)}>
            Selecione como deseja dividir a transação.
          </Text>
          <Controller
            name="payment_card.installments"
            control={control}
            render={({ field }) => (
              <Select
                data={installments}
                onChange={(item) => {
                  field.onChange(item);
                }}
                value={field.value}
              />
            )}
          />
        </View>
      )} */}

      {!!pay?.find(
        ({ item, label }) =>
          watch("payment_method") === item &&
          selected.toLowerCase().indexOf("dinheiro") > -1
      ) && (
        <View style={themeController(styles.paymentsContainer)}>
          <Text style={themeController(globalStyles.subtitle)}>
            Precisa de troco?
          </Text>
          <Text style={themeController(globalStyles.description)}>
            Caso precise, insira o valor que possui e vamos devolver a
            diferença.
          </Text>

          <Controller
            name="change"
            control={control}
            render={({ field }) => (
              <MaskedInput
                refInput={field.ref}
                // label="Valor do troco"
                value={field.value}
                error={!!errors?.change}
                helperText={errors?.change?.message}
                placeholder="R$ 0,00"
                type={"currency"}
                options={{
                  prefix: "R$ ",
                  decimalSeparator: ",",
                  groupSeparator: ".",
                  precision: 2,
                }}
                onChangeText={(_, text) => field.onChange(text)}
                keyboardType="numeric"
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Payments;
