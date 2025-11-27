import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  Button,
  Header,
  Input,
  MaskedInput,
  RadioButton,
} from "../../components/Shared";
import { styles } from "./styles";
import Select, { IData } from "../../components/Select";
import { Controller, useForm } from "react-hook-form";
import { globalStyles } from "../../styles/globalStyles";
import { Order, OrderPayment } from "../../interfaces/Order";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useUser } from "../../hooks/UserContext";
import { formatCardNumber } from "../../utils/formatCardNumber";
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import Payment from "payment";
import { useThemeContext } from "../../hooks/themeContext";
import { useOrder } from "../../hooks/OrderContext";
import { RootStackParamList } from "../../interfaces/RouteTypes";
import CardCodeModal from "../Checkout/components/CardCodeModal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { formatPrice } from "../../utils/formatPrice";
import { useGlobal } from "../../hooks/GlobalContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const images = require("../../components/CreditCard/card-images");

const validate = Payment.fns;

interface IRouteParams extends RouteProp<RootStackParamList> {
  params: {
    order: Order;
  };
}

interface IRedoOrderPayment {
  address: {
    street: string;
    city: string;
    state: string;
    number: string;
    complement: string;
    district: string;
    zip_code: string;
    latitude: string | number;
    longitude: string | number;
  };
  address_id?: string;
  address_partner?: boolean;
  payment_local: string;
  payment_method: string;
  payment_card: {
    card_id: string;
  };
  change?: string;
  shipping_option: string;
}

const RedoPayment = () => {
  const { params } = useRoute<IRouteParams>();
  const { order } = params;

  const { navigate, goBack, replace } =
    useNavigation<NativeStackNavigationProp<any>>();
  const { dynamicTheme, themeController } = useThemeContext();
  const { consumer } = useUser();
  const { openAlert, closeAlert } = useGlobal();
  const { onGetOrderDetails } = useOrder();

  const [payments, setPayments] = useState<OrderPayment>();
  const [paymentLocals, setPaymentLocals] = useState<IData[]>([]);
  const [showCardCodeModal, setShowCardCodeModal] = useState(false);
  const [cardCode, setCardCode] = useState("");

  const orderSchema = yup.object().shape({
    payment_local: yup
      .string()
      .required("Selecione alguma forma de onde pagar"),
    payment_method: yup
      .string()
      .required("Selecione alguma forma de pagamento"),
    payment_card: yup.object().when("payment_method", {
      is: (value) =>
        !!pay?.find(
          ({ item, label }) =>
            value === item &&
            (label.toUpperCase() === "CARTÃO DE CRÉDITO" ||
              label.toUpperCase() === "CARTÃO DE DÉBITO")
        ),
      then: (schema) =>
        schema
          .shape({
            card_id: yup
              .string()
              .required("Escolha um cartão de crédito/débito"),
          })
          .required(),
    }),
    change: yup.string().test({
      test: (value) => Number(value) / 100 > order.amount || !Number(value),
      message: `O valor inserido deve ser maior que o total do pedido (${formatPrice(
        order.amount
      )}).`,
    }),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<IRedoOrderPayment>({
    resolver: yupResolver(orderSchema),
  });

  const { getAllCards, consumerCards } = useUser();
  const { updateOrder, getOrderPayment, pay, setPay, selected, setSelected } =
    useOrder();

  const isCardPaymentMethod = !!pay?.find(
    ({ item, label }) =>
      watch("payment_method") === item &&
      (label.toUpperCase() === "CARTÃO DE CRÉDITO" ||
        label.toUpperCase() === "CARTÃO DE DÉBITO")
  );

  const isPixPaymentMethod = !!pay?.find(
    ({ item, label }) =>
      watch("payment_method") === item && label.toUpperCase() === "PIX"
  );

  const getPayment = async () => {
    const paymentsResponse = await getOrderPayment(order?.partner.branch_id);

    const pays: IData[] = paymentsResponse.payment_options.map(
      ({ payment_options_id, description }) => ({
        item: payment_options_id,
        label: description,
      })
    );

    let locals: IData[] = paymentsResponse.payment_options.map(
      ({ payment_local_id, payment_local_name }) => ({
        item: payment_local_id,
        label: payment_local_name,
      })
    );

    locals = locals.filter(
      ({ item }, index) =>
        locals.findIndex((local) => local.item === item) === index
    );

    setPay(pays);
    setPaymentLocals(locals);
    setPayments(paymentsResponse);
  };

  const onSubmit = async (data: IRedoOrderPayment) => {
    const orderData = {
      order_id: order.order_id,
      order_itens: order.order_itens,
      shipping_options: order.shipping_options,
      amount: order.amount,
      created_by: consumer.consumer_id,
      observation: order.observation || "",
      consumer_id: consumer.consumer_id,
      updated_by: consumer.consumer_id,
      address_id: order.shipping.address_id,
      address: {
        legal_name: consumer.legal_name,
        fantasy_name: consumer.fantasy_name,
        document: consumer.document,
        email: consumer.email,
        phone_number: consumer.phone_number,

        street: order.consumer.street,
        city: order.consumer.city,
        state: order.consumer.state,
        number: order.consumer.number,
        complement: order.consumer.complement,
        district: order.consumer.district,
        zip_code: order.consumer.zip_code,
        latitude: order.consumer.latitude,
        longitude: order.consumer.longitude,
      },
      shipping_company_id: "7e1386fa-c4d7-4c11-9489-a3068996bac0",
      branch_id: order.partner.branch_id,
      change:
        Number(data?.change) > 0 ? Number(data.change) / 100 - order.amount : 0,
      payments: [
        {
          payment_id: order.payments[0].payment_id,
          card_id: data?.payment_card?.card_id,
          security_code: cardCode,
          payment_options_id: data.payment_method,
          amount_paid: order.payments[0].amount_paid,
          installments: 1,
        },
      ],
    };
    // console.log('payload',JSON.stringify(orderData) )

    // Ao criar um pedido, recebe-se as informações do pedido e resposta do pagamento da pagseguro
    const response = await updateOrder(orderData);

    // Para pagamentos feitos via PIX e Cartão, será receibido um objeto da pagseguro com as informações a serem validadas.
    const { sucessPayment, errorPayment } = response?.pagseguro;
    const { status } = sucessPayment ? JSON.parse(sucessPayment) : "";

    // Após realizar a nova tentativa de pagamento, essa função é chamada para atualizar as informações dos detalhes do pedido.
    onGetOrderDetails(order.order_id);

    // Alertar ao usuário se o pagamento do pedido deu errado
    if (
      status === "CANCELED" ||
      status === "DECLINED" ||
      errorPayment?.errorMessages?.length > 0
    ) {
      openAlert({
        title: "Pagamento recusado",
        description:
          "Não foi possível realizar o pagamento com as informações fornecidas. Tente novamente",
        type: "error",
        buttons: {
          cancelButton: false,
          confirmButton: false,
          orientation: "horizontal",
          extraButtons: [
            {
              title: "Ok",
              onPress: () => {
                goBack();
                closeAlert();
              },
            },
          ],
        },
      });

      return;
    }

    if (isPixPaymentMethod) {
      replace("PixPayment", {
        pix: JSON.parse(sucessPayment),
        order,
      });
      return;
    }

    // Caso nenhuma das condições anteriores sejam satisfeitas, segue fluxo normal de pedido concluído.
    openAlert({
      title: "Pagamento confirmado",
      description:
        "Recebemos seu pagamento, em breve seu pedido será confirmado",
      type: "success",
      buttons: {
        cancelButton: false,
        confirmButton: false,
        orientation: "horizontal",
        extraButtons: [
          {
            title: "Ok",
            onPress: () => {
              goBack();
              closeAlert();
            },
          },
        ],
      },
    });
  };

  const handleValidateBeforeSubmit = async () => {
    const isValid = await trigger();

    if (isCardPaymentMethod && isValid) {
      setShowCardCodeModal(true);
      return;
    }

    handleSubmit(onSubmit)();
  };

  useEffect(() => {
    getPayment();
    getAllCards();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ minHeight: "100%" }}
      showsVerticalScrollIndicator={false}
    >
      <View style={themeController(styles.container)}>
        <CardCodeModal
          isVisible={showCardCodeModal}
          setIsVisible={setShowCardCodeModal}
          onChangeCardCode={setCardCode}
          onSubmitCardCode={handleSubmit(onSubmit)}
        />

        <View>
          <Header backButton />
          <Text style={themeController(styles.title)}>Realizar pagamento</Text>
        </View>

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
                      .filter(
                        ({ payment_local_id }) => payment_local_id === item
                      )
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
                    setSelected(
                      pay.find((option) => option.item === item).label
                    );
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
                Após a confirmação do pedido, será gerado um código para
                realizar o pagamento via pix.
              </Text>
            )}
          </View>
        )}

        {isCardPaymentMethod && (
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

            {!!errors?.payment_card?.card_id && (
              <Text style={themeController(globalStyles.helperTextErrorStyle)}>
                {errors?.payment_card?.card_id?.message}
              </Text>
            )}

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
              <Text style={themeController(styles.newPaymentButtonText)}>
                Adicionar novo cartão
              </Text>
            </TouchableOpacity>
          </View>
        )}

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

        <TouchableOpacity
          disabled={isSubmitting}
          style={[themeController(styles.submitButton)]}
          onPress={() => handleValidateBeforeSubmit()}
        >
          <Text style={themeController(styles.submitButtonText)}>
            Confirmar
          </Text>
          {isSubmitting ? (
            <ActivityIndicator size={18} color={dynamicTheme.colors.white} />
          ) : (
            <Feather
              name="chevron-right"
              size={16}
              color={dynamicTheme.colors.white}
            />
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RedoPayment;
