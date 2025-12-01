import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Button, Header, Steps, Input } from "../../components/Shared";
import { styles } from "./styles";
import Review from "./components/Review";
import Address from "./components/Address";
import { Feather } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { globalStyles } from "../../styles/globalStyles";
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
import { useAuth } from "../../hooks/AuthContext";

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
  const { user } = useAuth();
  const { consumer, defaultAddress: userDefaultAddress } = useUser();
  const { createOrder, getOrderPayment, pay, createSession3DS } = useOrder();
  const { getStoreIsAvailable } = useOffer();
  const { cart, totalAmount, clearCart, freight, cartBranch } = useCart();
  const { openAlert, closeAlert } = useGlobal();
  const { goBack, navigate } = useNavigation();
  const { replace } = useNavigation<NativeStackNavigationProp<any>>();

  const [payments, setPayments] = useState<OrderPayment>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);

  const [showUnavailableStoreModal, setShowUnavailableStoreModal] =
    useState(false);

  // Buscar endereço padrão do consumer se userDefaultAddress não estiver disponível
  const defaultAddress = useMemo(() => {
    console.log("🏠 Checkout - Calculando defaultAddress");
    console.log("  - userDefaultAddress:", userDefaultAddress);
    console.log("  - consumer?.default_address:", consumer?.default_address);
    console.log("  - consumer?.addresses?.length:", consumer?.addresses?.length);

    if (userDefaultAddress) {
      console.log("✅ Usando userDefaultAddress");
      return userDefaultAddress;
    }
    if (consumer?.default_address && consumer?.addresses?.length > 0) {
      const found = consumer.addresses.find(addr => addr.address_id === consumer.default_address);
      console.log("✅ Encontrado endereço do consumer:", found);
      return found;
    }
    console.log("⚠️ Usando primeiro endereço como fallback:", consumer?.addresses?.[0]);
    return consumer?.addresses?.[0]; // Fallback para o primeiro endereço
  }, [userDefaultAddress, consumer?.default_address, consumer?.addresses]);

  // Schema simplificado - campos necessários
  const orderSchema = yup.object().shape({
    shipping_option: yup.string().required("Selecione uma forma de envio"),
    payment_method: yup.string().required("Selecione uma forma de pagamento"),
    payment_local: yup.string().required("Selecione onde pagar"),
    observation: yup.string(),
    change: yup.string(),
  });

  const methods = useForm<OrderProps>({
    resolver: yupResolver(orderSchema),
    defaultValues: {
      observation: '',
    }
  });

  const getPayment = async () => {
    console.log("📦 Checkout - getPayment chamado");
    console.log("📦 cartBranch:", cartBranch);
    console.log("📦 cartBranch?.branch_id:", cartBranch?.branch_id);

    if (!cartBranch?.branch_id) {
      console.log("❌ Checkout - branch_id não disponível, abortando getPayment");
      setIsLoadingPayments(false);
      return;
    }

    try {
      setIsLoadingPayments(true);
      const data = await getOrderPayment(cartBranch?.branch_id);
      console.log("📦 Dados de pagamento recebidos:", data);
      setPayments(data);
    } catch (error) {
      console.log("❌ Erro ao carregar pagamentos:", error);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const getShippingWaysOnUpdate = async () => {
    console.log("📦 Checkout - getShippingWaysOnUpdate chamado");
    const data = await getOrderPayment(
      cartBranch.branch_id,
      methods.watch("address.latitude"),
      methods.watch("address.longitude")
    );
    console.log("📦 Dados de envio atualizados:", data);
    setPayments(data);
  };

  const selectDefaultAddress = async () => {
    const hasId =
      defaultAddress?.address_id !== "1" && defaultAddress?.address_id;

    if (hasId) {
      methods.setValue("address_id", defaultAddress.address_id);
      methods.setValue("address", defaultAddress);
      methods.setValue("address_partner", false);
    }
  };

  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (!user?.user_id) {
      console.log("❌ Checkout - Usuário não autenticado, redirecionando para login");
      // Redirecionar imediatamente para a tela de login
      replace("PhoneAuth");
      return;
    }

    console.log("✅ Checkout - Usuário autenticado:", user.user_id);
    selectDefaultAddress();
  }, []);

  // Carregar dados de pagamento (aguardar defaultAddress estar disponível)
  useEffect(() => {
    console.log("📦 Checkout - useEffect de pagamento disparado");
    console.log("📦 cartBranch?.branch_id:", cartBranch?.branch_id);
    console.log("📦 defaultAddress:", defaultAddress);
    console.log("📦 consumer?.default_address:", consumer?.default_address);
    console.log("📦 consumer?.addresses?.length:", consumer?.addresses?.length);

    if (cartBranch?.branch_id && defaultAddress) {
      console.log("✅ Checkout - cartBranch e defaultAddress disponíveis, carregando pagamento");
      getPayment();
    } else {
      console.log("⏳ Checkout - Aguardando dados:", {
        cartBranch: !!cartBranch?.branch_id,
        defaultAddress: !!defaultAddress,
        consumer_default_address: !!consumer?.default_address,
        addresses_length: consumer?.addresses?.length || 0
      });
      // Se não tiver os dados necessários, marcar como não carregando
      setIsLoadingPayments(false);
    }
  }, [cartBranch?.branch_id, defaultAddress?.address_id]);

  // Configurar valores padrão quando payments carregar
  useEffect(() => {
    console.log("📦 Checkout - Configurando valores padrão");
    console.log("📦 payments:", payments);
    console.log("📦 shipping_options:", payments?.shipping_options);
    console.log("📦 payment_options:", payments?.payment_options);

    if (payments?.shipping_options?.length > 0 && !methods.watch("shipping_option")) {
      const defaultShipping = payments.shipping_options[0];
      console.log("✅ Setando shipping_option padrão:", defaultShipping.delivery_option_id);
      methods.setValue("shipping_option", defaultShipping.delivery_option_id);
    }

    if (payments?.payment_options?.length > 0 && !methods.watch("payment_method")) {
      const firstPayment = payments.payment_options[0];
      console.log("✅ Setando payment_method padrão:", firstPayment.payment_options_id);
      methods.setValue("payment_method", firstPayment.payment_options_id);
      methods.setValue("payment_local", firstPayment.payment_local_id);
    }
  }, [payments]);





  const onSubmit = async (data: OrderProps) => {
    try {
      setIsSubmitting(true);

      // Validações básicas
      if (!defaultAddress || !defaultAddress.address_id) {
        openAlert({
          title: "Endereço necessário",
          description: "Você precisa ter um endereço cadastrado para fazer o pedido.",
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });
        setIsSubmitting(false);
        return;
      }

      // Buscar opções selecionadas
      const shippingOption = payments?.shipping_options?.find(
        s => s.delivery_option_id === data.shipping_option
      );

      const paymentOption = payments?.payment_options?.find(
        p => p.payment_options_id === data.payment_method
      );

      if (!shippingOption) {
        openAlert({
          title: "Erro",
          description: "Selecione uma forma de entrega.",
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });
        setIsSubmitting(false);
        return;
      }

      if (!paymentOption) {
        openAlert({
          title: "Erro",
          description: "Selecione uma forma de pagamento.",
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });
        setIsSubmitting(false);
        return;
      }

      const orderData = {
        order_itens: cart.map(({ quantity, product }) => ({
          product_id: product.product_id,
          product_name: product.name,
          quantity: quantity,
          product_value: product.price,
        })),
        shipping_options: shippingOption,
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
          street: defaultAddress.street,
          city: defaultAddress.city,
          state: defaultAddress.state,
          number: defaultAddress.number,
          complement: defaultAddress.complement || "",
          district: defaultAddress.district,
          zip_code: defaultAddress.zip_code,
          latitude: defaultAddress.latitude,
          longitude: defaultAddress.longitude,
        },
        shipping_company_id: "7e1386fa-c4d7-4c11-9489-a3068996bac0",
        branch_id: cartBranch?.branch_id,
        address_id: defaultAddress.address_id,
        change: 0,
        payments: [
          {
            payment_options_id: paymentOption.payment_options_id,
            amount_paid: totalAmount,
            installments: 1,
          },
        ],
      };

      console.log("📦 Criando pedido:", orderData);

      // Criar o pedido
      const order = await createOrder(orderData);

      console.log("✅ Pedido criado:", order);

      // Limpar carrinho e mostrar sucesso
      await clearCart();

      openAlert({
        title: "Pedido realizado com sucesso! 🎉",
        description: `Seu pedido #${order.order_number || ''} foi criado e será processado em breve.`,
        type: "success",
        buttons: {
          cancelButton: false,
          confirmButton: false,
          orientation: "horizontal",
          extraButtons: [
            {
              title: "Ver pedido",
              onPress: () => {
                closeAlert();
                replace("OrderDetails", { id: order.order_id });
              },
            },
            {
              title: "Voltar ao início",
              onPress: () => {
                closeAlert();
                replace("Home");
              },
            },
          ],
        },
      });

    } catch (error) {
      console.error("❌ Erro ao criar pedido:", error);

      openAlert({
        title: "Erro ao criar pedido",
        description: error?.message || "Ocorreu um erro ao processar seu pedido. Tente novamente.",
        type: "error",
        buttons: {
          confirmButtonTitle: "Ok",
          cancelButton: false,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verificar se está tudo carregado
  const isLoading = isLoadingPayments;

  // Log para debug
  useEffect(() => {
    console.log("📊 Checkout - Estado de loading:");
    console.log("  - isLoadingPayments:", isLoadingPayments);
    console.log("  - payments:", payments ? "✅ Carregado" : "❌ Não carregado");
    console.log("  - defaultAddress:", defaultAddress ? "✅ Carregado" : "❌ Não carregado");
    console.log("  - isLoading final:", isLoading);
  }, [isLoadingPayments, payments, defaultAddress]);

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

        <View style={themeController(styles.header)}>
          <Header backButton />
          <Text style={themeController(styles.title)}>Finalizar Pedido</Text>
        </View>

        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
            <ActivityIndicator size="large" color={dynamicTheme.colors.primary} />
            <Text style={[themeController(globalStyles.description), { marginTop: 16, textAlign: 'center' }]}>
              Carregando informações do pedido...
            </Text>
          </View>
        ) : (
          <View style={themeController(styles.content)}>
            <FormProvider {...methods}>
              {/* Resumo do Pedido */}
              <Review />

              {/* Endereço de Entrega */}
              {defaultAddress && (
                <View style={{ marginTop: 20, padding: 16, backgroundColor: dynamicTheme.colors.background, borderRadius: 8 }}>
                  <Text style={themeController(globalStyles.subtitle)}>
                    📍 Endereço de Entrega
                  </Text>
                  <Text style={themeController(globalStyles.description)}>
                    {defaultAddress.street}, {defaultAddress.number}
                  </Text>
                  <Text style={themeController(globalStyles.description)}>
                    {defaultAddress.district} - {defaultAddress.city}/{defaultAddress.state}
                  </Text>
                </View>
              )}

              {/* Forma de Entrega */}
              {payments?.shipping_options && payments.shipping_options.length > 0 ? (
                <View style={{ marginTop: 20 }}>
                  <Text style={themeController(globalStyles.subtitle)}>
                    🚚 Forma de Entrega
                  </Text>
                  <Text style={themeController(globalStyles.description)}>
                    Confira se os dados de envio estão corretos
                  </Text>
                  <Controller
                    control={methods.control}
                    name="shipping_option"
                    render={({ field: { onChange, value } }) => (
                      <View style={{ marginTop: 8 }}>
                        {payments.shipping_options.map((option) => (
                          <TouchableOpacity
                            key={option.delivery_option_id}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              padding: 12,
                              marginBottom: 8,
                              backgroundColor: value === option.delivery_option_id
                                ? dynamicTheme.colors.primary + '20'
                                : dynamicTheme.colors.background,
                              borderRadius: 8,
                              borderWidth: 1,
                              borderColor: value === option.delivery_option_id
                                ? dynamicTheme.colors.primary
                                : 'transparent',
                            }}
                            onPress={() => onChange(option.delivery_option_id)}
                          >
                            <View style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              borderWidth: 2,
                              borderColor: value === option.delivery_option_id
                                ? dynamicTheme.colors.primary
                                : '#ccc',
                              marginRight: 12,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                              {value === option.delivery_option_id && (
                                <View style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: dynamicTheme.colors.primary,
                                }} />
                              )}
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={themeController(globalStyles.subtitle)}>
                                {option.name}
                              </Text>
                              <Text style={themeController(globalStyles.description)}>
                                {formatPrice(option.value)}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  />
                  {methods.formState.errors.shipping_option && (
                    <Text style={{ color: 'red', marginTop: 4 }}>
                      {methods.formState.errors.shipping_option.message}
                    </Text>
                  )}
                </View>
              ) : (
                <View style={{ marginTop: 20, padding: 16, backgroundColor: '#FFF3CD', borderRadius: 8 }}>
                  <Text style={{ color: '#856404' }}>
                    ⚠️ Nenhuma opção de entrega disponível
                  </Text>
                </View>
              )}

              {/* Forma de Pagamento */}
              {payments?.payment_options && payments.payment_options.length > 0 ? (
                <View style={{ marginTop: 20 }}>
                  <Text style={themeController(globalStyles.subtitle)}>
                    💰 Forma de Pagamento
                  </Text>
                  <Text style={themeController(globalStyles.description)}>
                    A transação será descontada da seguinte forma
                  </Text>
                  <Controller
                    control={methods.control}
                    name="payment_method"
                    render={({ field: { onChange, value } }) => (
                      <View style={{ marginTop: 8 }}>
                        {payments.payment_options.map((option) => (
                          <TouchableOpacity
                            key={option.payment_options_id}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              padding: 12,
                              marginBottom: 8,
                              backgroundColor: value === option.payment_options_id
                                ? dynamicTheme.colors.primary + '20'
                                : dynamicTheme.colors.background,
                              borderRadius: 8,
                              borderWidth: 1,
                              borderColor: value === option.payment_options_id
                                ? dynamicTheme.colors.primary
                                : 'transparent',
                            }}
                            onPress={() => {
                              onChange(option.payment_options_id);
                              methods.setValue("payment_local", option.payment_local_id);
                            }}
                          >
                            <View style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              borderWidth: 2,
                              borderColor: value === option.payment_options_id
                                ? dynamicTheme.colors.primary
                                : '#ccc',
                              marginRight: 12,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                              {value === option.payment_options_id && (
                                <View style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: dynamicTheme.colors.primary,
                                }} />
                              )}
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={themeController(globalStyles.subtitle)}>
                                {option.description}
                              </Text>
                              <Text style={themeController(globalStyles.description)}>
                                {option.payment_local_name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  />
                  {methods.formState.errors.payment_method && (
                    <Text style={{ color: 'red', marginTop: 4 }}>
                      {methods.formState.errors.payment_method.message}
                    </Text>
                  )}
                </View>
              ) : (
                <View style={{ marginTop: 20, padding: 16, backgroundColor: '#FFF3CD', borderRadius: 8 }}>
                  <Text style={{ color: '#856404' }}>
                    ⚠️ Nenhuma opção de pagamento disponível
                  </Text>
                </View>
              )}

              {/* Campo de observação */}
              <View style={{ marginTop: 20 }}>
                <Text style={themeController(globalStyles.subtitle)}>
                  📝 Observações (opcional)
                </Text>
                <Controller
                  control={methods.control}
                  name="observation"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Ex: Deixar na portaria, tocar a campainha..."
                      value={value}
                      onChangeText={onChange}
                      multiline
                      numberOfLines={3}
                      style={{ minHeight: 80, textAlignVertical: 'top', marginTop: 8 }}
                    />
                  )}
                />
              </View>

              {/* Botão de finalizar */}
              <View style={themeController(styles.footer)}>
                <TouchableOpacity
                  disabled={isSubmitting}
                  style={[
                    themeController(styles.nextButton),
                    { width: '100%', opacity: isSubmitting ? 0.6 : 1 }
                  ]}
                  onPress={methods.handleSubmit(onSubmit)}
                >
                  <Text style={themeController(styles.nextButtonText)}>
                    {isSubmitting ? 'Processando...' : 'Finalizar Pedido'}
                  </Text>
                  {isSubmitting ? (
                    <ActivityIndicator size={18} color={theme.colors.white} />
                  ) : (
                    <Feather
                      name="check"
                      size={18}
                      color={theme.colors.white}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </FormProvider>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Checkout;
