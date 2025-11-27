import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Button, Header, Steps } from "../../components/Shared";
import { styles } from "./styles";
import Review from "./components/Review";
import Address from "./components/Address";
import { Feather } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import * as yup from "yup";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useOrder } from "../../hooks/OrderContext";
import { useUser } from "../../hooks/UserContext";
import { useCart } from "../../hooks/CartContext";
import { useGlobal } from "../../hooks/GlobalContext";
import { useNavigation } from "@react-navigation/native";
import { CreateOrder, Order, OrderPayment } from "../../interfaces/Order";
import { formatPrice } from "../../utils/formatPrice";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import UnavailableStoreModal from "../Shared/UnavailableStoreModal";
import { useOffer } from "../../hooks/OfferContext";
import CardCodeModal from "./components/CardCodeModal";
import Payments from "./components/Payment";
import { useThemeContext } from "../../hooks/themeContext";
import { PagSeguro } from "../../utils/pagSeguroScript";
import { REACT_APP_PAGSEGURO_PUBLIC_KEY } from "@env";
import WebView from "react-native-webview";

export interface OrderProps {
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
    installments: string;
    card_number: string;
    expiration_date: string;
    cvv: string;
    holder: string;
    document: string;
    card_id: string;
  };
  change?: string;
  shipping_option: string;
  observation?: string;
}

const Checkout: React.FC = () => {
  const { dynamicTheme, themeController } = useThemeContext();
  const { consumer, addresses, defaultAddress } = useUser();
  const { createOrder, getOrderPayment, pay, createSession3DS } = useOrder();
  const { getStoreIsAvailable } = useOffer();
  const { cart, totalAmount, clearCart, freight, cartBranch } = useCart();
  const { openAlert, closeAlert } = useGlobal();
  const { goBack } = useNavigation();
  const { replace } = useNavigation<NativeStackNavigationProp<any>>();

  const [currentStep, setCurrentStep] = useState(0);
  const [payments, setPayments] = useState<OrderPayment>();
  const [cardCode, setCardCode] = useState("");

  const [showUnavailableStoreModal, setShowUnavailableStoreModal] =
    useState(false);
  const [showCardCodeModal, setShowCardCodeModal] = useState(false);

  const [showWebView, setShowWebView] = useState(false);
  const [pagseguroSession, setPagseguroSession] = useState("");
  const [customerRequest, setCustomerRequest] = useState<any>();

  const webViewRef = useRef(null);

  const orderSchema = yup.object().shape({
    address_id: yup.string().required("Selecione alguma forma de entrega"),
    address_partner: yup
      .boolean()
      .required("Selecione algum ponto de retirada"),
    payment_local: yup
      .string()
      .required("Selecione alguma forma de onde pagar"),
    payment_method: yup
      .string()
      .required("Selecione alguma forma de pagamento"),
    payment_card: yup.object().when("payment_method", {
      is: (value) => value === "3" || value === "4",
      then: (schema) =>
        schema.shape({
          installments: yup.string().required("Campo obrigatório"),
          card_number: yup.string().required("Campo obrigatório"),
          card_id: yup.string().required("Campo obrigatório"),
          expiration_date: yup.string().required("Campo obrigatório"),
          cvv: yup.string().required("Obrigatório"),
          holder: yup.string().required("Campo obrigatório"),
          document: yup.string().required("Campo obrigatório"),
        }),
    }),
    shipping_option: yup.string().required("Selecione alguma forma de envio"),
    observation: yup.string(),
    change: yup.string().test({
      test: (value) => Number(value) / 100 > totalAmount || !Number(value),
      message: `O valor inserido deve ser maior que o total do pedido (${formatPrice(
        totalAmount
      )}).`,
    }),
  });

  const methods = useForm<OrderProps>({
    resolver: yupResolver(orderSchema),
  });

  const previousStep = () => setCurrentStep((tab) => tab - 1);

  const triggerFields = async () => {
    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = await methods.trigger(["address_id", "shipping_option"]);
        break;

      case 1:
        isValid = await methods.trigger([
          "payment_local",
          "payment_method",
          "change",
        ]);
        break;

      default:
        break;
    }

    return isValid;
  };

  const nextStep = async () => {
    const isValid = await triggerFields();

    if (isValid) setCurrentStep((tab) => tab + 1);
  };

  const TabOptions = [
    {
      id: 1,
      label: "Endereço",
      tab: "Address",
      component: () => <Address />,
      action: () => {},
    },
    {
      id: 2,
      label: "Pagamento",
      tab: "Payment",
      component: () => <Payments payments={payments} />,
      action: () => {},
    },
    {
      id: 3,
      label: "Revisão",
      tab: "Review",
      component: () => <Review />,
      action: () => {},
    },
  ];

  const TabContent = useMemo(
    () => TabOptions[currentStep].component,
    [currentStep]
  );

  const getPayment = async () => {
    const data = await getOrderPayment(cartBranch?.branch_id);
    // console.log("-> SHIPPING", JSON.stringify(data));
    setPayments(data);
  };

  const getShippingWaysOnUpdate = async () => {
    const data = await getOrderPayment(
      cartBranch.branch_id,
      methods.watch("address.latitude"),
      methods.watch("address.longitude")
    );

    setPayments(data);
  };

  const selectDefaultAddress = async () => {
    const hasId =
      defaultAddress?.address_id !== "1" && defaultAddress?.address_id;

    if (hasId) {
      const isAvailable = await isAvailableStore();
      if (!isAvailable) return;

      methods.setValue("address_id", defaultAddress.address_id);
      methods.setValue("address", defaultAddress);
      if (freight?.name.toLowerCase().indexOf("retirada") != -1) {
        methods.setValue("address_partner", true);
      } else {
        methods.setValue("address_partner", false);
      }
    }
  };

  useEffect(() => {
    selectDefaultAddress();
    getPayment();
  }, []);

  useEffect(() => {
    if (freight)
      methods.setValue("shipping_option", freight.delivery_option_id);
  }, [freight]);

  useEffect(() => {
    if (methods.watch("address_id")) {
      getShippingWaysOnUpdate();
    }
  }, [methods.watch("address_id")]);

  const transshipmentDiff = Number(methods.watch("change")) / 100 - totalAmount;
  const isCardPaymentMethod = !!pay?.find(
    ({ item, label }) =>
      methods.watch("payment_method") === item &&
      (label.toUpperCase() === "CARTÃO DE CRÉDITO" ||
        label.toUpperCase() === "CARTÃO DE DÉBITO")
  );

  const isDigitalPaymentMethod = !!payments?.payment_options?.find(
    ({ payment_local_name, payment_local_id }) =>
      methods.watch("payment_local") === payment_local_id &&
      payment_local_name.toUpperCase() === "PAGAMENTO NO APLICATIVO"
  );

  const isAvailableStore = async () => {
    const isAvailable = await getStoreIsAvailable(
      cartBranch?.branch_id,
      Number(methods.watch("address.latitude")),
      Number(methods.watch("address.longitude"))
    );

    if (!isAvailable) {
      setShowUnavailableStoreModal(true);
    }

    return isAvailable;
  };

  const onSubmit = async (data: OrderProps) => {

    // console.log(data)

    // Ao chamar essa função, recebemos um boolean que condiz se a loja está disponível ou não
    // (horários e dias de funcionamento de acordo com o endereço selecionado são levados em consideração)
    const isAvailable = await isAvailableStore();

    // E caso não esteja disponível, o pedido não é realizado.
    if (!isAvailable) {
      return;
    }

    const orderData = {
      // Passa por todos os itens do carrinho e monta um objeto que a API está esperando
      order_itens: cart.map(({ quantity, product }) => {
        return {
          product_id: product.product_id,
          product_name: product.name,
          quantity: quantity,
          product_value: product.price,
        };
      }),
      shipping_options: freight,
      amount: totalAmount,
      created_by: consumer.consumer_id,
      observation: data.observation || "",
      consumer_id: consumer.consumer_id,
      address: {
        legal_name: consumer.legal_name,
        fantasy_name: consumer.fantasy_name,
        document: consumer.document,
        email: consumer.email,
        phone_number: consumer.phone_number,
        street: data.address.street,
        city: data.address.city,
        state: data.address.state,
        number: data.address.number,
        complement: data.address.complement,
        district: data.address.district,
        zip_code: data.address.zip_code,
        latitude: data.address.latitude,
        longitude: data.address.longitude,
      },
      shipping_company_id: "7e1386fa-c4d7-4c11-9489-a3068996bac0",
      branch_id: cartBranch?.branch_id,
      change: Number(data?.change) > 0 ? transshipmentDiff : 0,
      payments: [
        {
          payment_options_id: data?.payment_method,
          amount_paid: totalAmount,
          installments: 1,
        },
      ],
    };

    // console.log("card", JSON.stringify(data.payment_card));

    if (isCardPaymentMethod && isDigitalPaymentMethod) {
      const expirationCurrentYear = new Date();
      const expirationStartYear = expirationCurrentYear
        .getFullYear()
        .toString()
        .slice(0, 2);
      const [expirationMonth, expirationYear] =
        data.payment_card.expiration_date.split("/");

      const card = PagSeguro?.encryptCard({
        publicKey: REACT_APP_PAGSEGURO_PUBLIC_KEY,
        holder: data.payment_card.holder,
        number: data.payment_card.card_number.replaceAll(" ", ""),
        expMonth: expirationMonth,
        expYear: expirationYear,
        securityCode: cardCode,
      });

      if (card.hasErrors) {
        openAlert({
          title: "Dado(s) inválido(s)",
          description:
            "Houve um erro ao tentar cadastrar o cartão. Revise os dados e tente novamente.",
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });

        return;
      }

      orderData.payments[0]["card_id"] = data?.payment_card?.card_id;
      orderData.payments[0]["security_code"] = cardCode;

      orderData["encrypted"] = card.encryptedCard;

      // Verifica se é cartão de débito para continuar a etapa com a PagBank
      if (
        !!pay?.find(
          ({ item, label }) =>
            methods.watch("payment_method") === item &&
            label.toUpperCase() === "CARTÃO DE DÉBITO"
        )
      ) {
        const { session } = await createSession3DS();

        const request = {
          data: {
            customer: {
              name: consumer.legal_name,
              email: consumer.email,
              phones: [
                {
                  country: "55",
                  area: consumer.phone_number.slice(0, 2),
                  number: consumer.phone_number.slice(2),
                  type: "MOBILE",
                },
              ],
            },
            paymentMethod: {
              type: "DEBIT_CARD",
              installments: 1,
              card: {
                number: data.payment_card.card_number.replaceAll(" ", ""),
                expMonth: expirationMonth,
                expYear: expirationYear,
                holder: {
                  name: data.payment_card.holder,
                },
              },
            },
            amount: {
              value: totalAmount * 100,
              currency: "BRL",
            },
            billingAddress: {
              street: data.address.street,
              number: data.address.number,
              complement: data.address.complement,
              regionCode: data.address.state,
              country: "BRA",
              city: data.address.city,
              postalCode: data.address.zip_code,
            },
            shippingAddress: {
              street: data.address.street,
              number: data.address.number,
              complement: data.address.complement,
              regionCode: data.address.state,
              country: "BRA",
              city: data.address.city,
              postalCode: data.address.zip_code,
            },
            dataOnly: false,
          },
        };

        // console.log("to passando por aqui viu", JSON.stringify(request));
        setShowWebView(true);

        setTimeout(() => {
          webViewRef?.current?.postMessage(
            JSON.stringify({
              request,
              session,
            })
          );
        }, 3000);

        return;
      }
    }

    // Caso a forma de envio do pedido seja retirada na loja, não será setado no objeto o ID do endereço do consumidor.
    if (!data.address_partner) orderData["address_id"] = data.address_id;

    // console.log("payload", JSON.stringify(orderData));

    // Ao criar um pedido, recebe-se as informações do pedido e resposta do pagamento da pagseguro
    const order = await createOrder(orderData);

    // console.log("response", JSON.stringify(order));
    // Para pagamentos feitos via PIX e Cartão, será receibido um objeto da pagseguro com as informações a serem validadas.
    const { sucessPayment, errorPayment } = order?.pagseguro;
    const { status } = sucessPayment ? JSON.parse(sucessPayment) : "";

    // Alertar ao usuário se o pagamento do pedido deu errado
    if (
      status === "CANCELED" ||
      status === "DECLINED" ||
      errorPayment?.errorMessages?.length > 0
    ) {
      openAlert({
        title: "Pagamento recusado",
        description:
          "Seu pedido foi gerado, mas não foi possível realizar o pagamento",
        type: "error",
        buttons: {
          cancelButton: false,
          confirmButton: false,
          orientation: "horizontal",
          extraButtons: [
            {
              title: "Ver pedido",
              onPress: () => {
                replace("OrderDetails", { id: order.order_id });
                closeAlert();
                clearCart();
              },
            },
            {
              title: "Ok",
              onPress: () => {
                goBack();
                closeAlert();
                clearCart();
              },
            },
          ],
        },
      });

      return;
    }

    // Caso o pagamento seja feito via pix, será levado a outra página para pagamento
    if (
      !!pay?.find(
        ({ item, label }) =>
          methods.watch("payment_method") === item && label === "Pix"
      )
    ) {
      openAlert({
        title: "Pedido aguardando pagamento",
        description:
          "Seu pedido está aguardando o pagamento, resta realizar o pagamento.",
        type: "success",
        buttons: {
          cancelButton: false,
          confirmButton: false,
          orientation: "horizontal",
          extraButtons: [
            {
              title: "Ok",
              onPress: () => {
                closeAlert();
                replace("PixPayment", {
                  pix: JSON.parse(sucessPayment),
                  order,
                });
                clearCart();
              },
            },
          ],
        },
      });

      return;
    }

    // Caso nenhuma das condições anteriores sejam satisfeitas, segue fluxo normal de pedido concluído.
    openAlert({
      title: "Pedido realizado",
      description: "Seu pedido será enviado o mais breve possível.",
      type: "success",
      buttons: {
        cancelButton: false,
        confirmButton: false,
        orientation: "horizontal",
        extraButtons: [
          {
            title: "Ver pedido",
            onPress: () => {
              replace("OrderDetails", { id: order.order_id });
              closeAlert();
              clearCart();
            },
          },
          {
            title: "Ok",
            onPress: () => {
              goBack();
              closeAlert();
              clearCart();
            },
          },
        ],
      },
    });

    // return response;
  };

  if (showWebView) {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          ref={webViewRef}
          source={{
            html: `<html>
            <head>
              <script src="https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js"></script>
              <script>
                document.addEventListener("message", ({ data }) => {
                  const { session, request } = JSON.parse(data);

                  window.ReactNativeWebView.postMessage("Sessão utilizada -> "+session)
                  window.ReactNativeWebView.postMessage("Request utilizada -> "+session)

                  PagSeguro.setUp({
                    session,
                    env: 'PROD'
                  });

                  PagSeguro.authenticate3DS(request).then( result => {
                    window.ReactNativeWebView.postMessage("Erro ao tentar autenticar 3DS ->");
                    window.ReactNativeWebView.postMessage(JSON.stringify(result));
                    this.logResponseToScreen(result);
                    this.stopLoading();
                  }).catch((err) => {
                    window.ReactNativeWebView.postMessage("Erro ao tentar autenticar 3DS ->")
                    window.ReactNativeWebView.postMessage(JSON.stringify(err));
                    if(err instanceof PagSeguro.PagSeguroError ) {
                        window.alert(JSON.stringify(err.detail))
                        // console.log(err);
                        // console.log(err.detail);
                        this.stopLoading();
                    }
                  })
                });

              </script>
            </head>
            <body>
              <p id="output">undefined</p>
            </body>
          </html>`,
          }}
          onMessage={({ nativeEvent }) => {
            // console.log("MESSAGE ->", nativeEvent.data);
            // // console.log("MESSAGE ->", JSON.parse(nativeEvent.data));
          }}
          injectedJavaScript={`window.alert(${pagseguroSession})`}
        />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ minHeight: "100%" }}
      showsVerticalScrollIndicator={false}
    >
      <View style={themeController(styles.container)}>
        <UnavailableStoreModal
          title="Loja indisponível"
          description="No momento, esta loja se encontra indisponível para receber novos pedidos devido ao horário."
          isVisible={showUnavailableStoreModal}
          setIsVisible={setShowUnavailableStoreModal}
        />

        <CardCodeModal
          isVisible={showCardCodeModal}
          setIsVisible={setShowCardCodeModal}
          onChangeCardCode={setCardCode}
          onSubmitCardCode={methods.handleSubmit(onSubmit)}
        />

        <View style={themeController(styles.header)}>
          <Header backButton />
          <Text style={themeController(styles.title)}>Realizar pedido</Text>
          <Steps ordered vertical currentTab={currentStep} tabs={TabOptions} />
        </View>

        <View style={themeController(styles.content)}>
          <FormProvider {...methods}>
            <TabContent />
          </FormProvider>
          <View style={themeController(styles.footer)}>
            {currentStep !== 0 ? (
              <TouchableOpacity
                style={themeController(styles.previousButton)}
                onPress={previousStep}
              >
                <Feather
                  name="chevron-left"
                  size={18}
                  color={dynamicTheme.colors.primary}
                />
                <Text style={themeController(styles.previousButtonText)}>
                  Anterior
                </Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}

            {currentStep !== 2 ? (
              <TouchableOpacity
                style={themeController(styles.nextButton)}
                onPress={nextStep}
              >
                <Text style={themeController(styles.nextButtonText)}>
                  Próximo
                </Text>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={methods.formState.isSubmitting}
                style={[themeController(styles.nextButton)]}
                onPress={
                  isCardPaymentMethod && isDigitalPaymentMethod
                    ? () => setShowCardCodeModal(true)
                    : methods.handleSubmit(onSubmit)
                }
              >
                <Text style={themeController(styles.nextButtonText)}>
                  Finalizar
                </Text>
                {methods.formState.isSubmitting ? (
                  <ActivityIndicator size={18} color={theme.colors.white} />
                ) : (
                  <Feather
                    name="chevron-right"
                    size={16}
                    color={theme.colors.white}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Checkout;
