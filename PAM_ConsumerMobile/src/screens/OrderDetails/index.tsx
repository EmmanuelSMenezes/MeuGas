import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Image, ScrollView } from "react-native";
import { BlueHeader } from "../../components/BlueHeader";
import { globalStyles } from "../../styles/globalStyles";
import RatingModal from "../Shared/RatingModal";
import { styles } from "./styles";
import { useRoute, RouteProp, ParamListBase } from "@react-navigation/native";
import { Order } from "../../interfaces/Order";
import { formatPrice } from "../../utils/formatPrice";
import { orderStyles } from "../../styles/orderStyles";
import { useOrder } from "../../hooks/OrderContext";
import Loading from "../../components/Loading";
import {
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useGlobal } from "../../hooks/GlobalContext";
import { useStatusContext } from "../../hooks/StatusContext";
import { useAuth } from "../../hooks/AuthContext";
import { useReputation } from "../../hooks/ReputationContext";
import { useThemeContext } from "../../hooks/themeContext";
import { useUser } from "../../hooks/UserContext";
interface RouteParams extends RouteProp<ParamListBase> {
  params: {
    id: string;
  };
}

const OrderDetails: React.FC = () => {
  const { params } = useRoute<RouteParams>();
  const { user } = useAuth();
  const { consumer } = useUser();
  const { getBranchWasEvaluated } = useReputation();
  const {
    getOrderStatusList,
    orderDetails,
    setOrderDetails,
    onGetOrderDetails,
  } = useOrder();
  const { navigate, goBack } = useNavigation();
  const { openAlert } = useGlobal();
  const { signalROrderConnection } = useStatusContext();
  const { dynamicTheme, themeController } = useThemeContext();

  const [canEvaluate, setCanEvaluate] = useState<boolean>(false);
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);

  let recipientAddress = `${orderDetails?.consumer?.city}, ${orderDetails?.consumer?.state}, ${orderDetails?.consumer?.zip_code}, ${orderDetails?.consumer?.street}, ${orderDetails?.consumer?.district}, ${orderDetails?.consumer?.number}`;
  if (orderDetails?.consumer?.complement)
    recipientAddress += `, ${orderDetails.consumer.complement}`;

  const changeDiff = orderDetails?.amount - orderDetails?.change;

  const orderCreatedAt = new Date(orderDetails?.created_at).toLocaleDateString(
    "pt-BR",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  const orderStatusStyle = {
    "Aguardando pagamento": styles.statusColorPending,
    Pendente: styles.statusColorPending,
    Recusado: styles.statusColorCanceled,
    Aceito: styles.statusColorFinishedOrAccepted,
    "Em andamento": styles.statusColorPending,
    Concluído: styles.statusColorFinishedOrAccepted,
    "Cancelado pelo cliente": styles.statusColorCanceled,
  };

  const getOrderDetails = async () => {
    onGetOrderDetails(params.id);

    if (orderDetails.status_name === "Concluído") {
      const status = await getBranchWasEvaluated(
        orderDetails.partner.branch_id
      );

      if (!status?.rating_id) setCanEvaluate(true);
    }
  };

  const onCancelOrder = async () => {
    openAlert({
      title: "Tem certeza?",
      description:
        "Deseja cancelar este pedido? Essa ação não poderá ser desfeita.",
      type: "warning",
      buttons: {
        onConfirm: async () => {
          const statusList = await getOrderStatusList();

          const canceledByConsumerStatus = statusList?.find(
            (status) => "Cancelado pelo cliente" === status?.name
          );

          signalROrderConnection?.invoke(
            "MoveOrderStatus",
            orderDetails.order_id,
            canceledByConsumerStatus.order_status_id,
            user.user_id
          );

          openAlert({
            title: "Sucesso",
            description: "Seu pedido foi cancelado como solicitado",
            type: "success",
            buttons: {
              cancelButton: false,
              confirmButtonTitle: "Ok",
              onConfirm: () => goBack(),
            },
          });
        },
      },
    });
  };

  const orderIsPaid = (): boolean => {
    if (
      orderDetails?.payments[0]?.payment_local_name ===
        "Pagamento na Entrega" ||
      orderDetails?.status_name === "Cancelado pelo cliente"
    )
      return true;

    if (orderDetails.payment_history.length === 0) return false;

    const orderHistory = orderDetails.payment_history
      .sort(
        (a, b) =>
          new Date(a.created_at_payment).getTime() -
          new Date(b.created_at_payment).getTime()
      )
      .at(-1);

    const isPaid =
      orderHistory?.status_payment_name === "WAITING_PIX" ||
      orderHistory?.status_payment_name === "DECLINED";

    return !isPaid;
  };

  useEffect(() => {
    getOrderDetails();

    return () => {
      setOrderDetails({} as Order);
    };
  }, []);

  if (!orderDetails?.order_id) return <Loading />;
  return (
    <View style={styles.mainContainer}>
      <BlueHeader title="Detalhes do pedido" />
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <RatingModal
          isVisible={showRatingModal}
          setIsVisible={setShowRatingModal}
          onEvaluateStore={() => setCanEvaluate(false)}
          branchId={orderDetails?.partner.branch_id}
        />
        {/* <Text style={orderStyles.orderCreatedAt}>Realizado em 12 de junho de 2023</Text> */}

        <View style={themeController(styles.orderResumeContainer)}>
          <View style={themeController(styles.orderResume)}>
            <Text
              style={[
                themeController(styles.orderResumeValue),
                themeController(styles.orderNumberText),
              ]}
            >
              #{orderDetails.order_number}
            </Text>
            <Text style={themeController(styles.orderResumeLabel)}>
              N° do pedido
            </Text>
          </View>

          <View style={themeController(styles.orderResume)}>
            <Text style={[themeController(styles.orderResumeValue)]}>
              {orderCreatedAt}
            </Text>
            <Text style={themeController(styles.orderResumeLabel)}>
              Data do pedido
            </Text>
          </View>

          <View style={themeController(styles.orderResume)}>
            <Text
              style={[
                themeController(styles.orderResumeValue),
                orderStatusStyle[orderDetails.status_name],
              ]}
            >
              {orderDetails.status_name}
            </Text>
            <Text style={themeController(styles.orderResumeLabel)}>Status</Text>
          </View>
        </View>

        <View style={themeController(styles.buttonsContainer)}>
          {!orderIsPaid() && (
            <TouchableOpacity
              style={themeController(styles.redoPaymentButton)}
              onPress={() => navigate("RedoPayment", { order: orderDetails })}
            >
              <MaterialCommunityIcons
                name="replay"
                size={20}
                color={dynamicTheme.colors.white}
              />
              <Text style={themeController(styles.rateButtonText)}>
                Refazer pagamento
              </Text>
            </TouchableOpacity>
          )}

          {orderDetails?.payments[0]?.description !== "Pix" &&
            (orderDetails.status_name === "Pendente" ||
              orderDetails.status_name === "Aguardando pagamento") && (
              <TouchableOpacity
                style={themeController(styles.cancelOrderButton)}
                onPress={() => onCancelOrder()}
              >
                <MaterialCommunityIcons
                  name="cancel"
                  size={20}
                  color={dynamicTheme.colors.white}
                />
                <Text style={themeController(styles.rateButtonText)}>
                  Cancelar pedido
                </Text>
              </TouchableOpacity>
            )}

          {orderDetails.status_name === "Em andamento" && (
            <TouchableOpacity
              style={themeController(styles.orderChatButton)}
              onPress={() =>
                navigate("Chat", {
                  order_id: orderDetails.order_id,
                  description: `Pedido n° ${orderDetails.order_number}`,
                  partner: orderDetails.partner,
                })
              }
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={20}
                color={dynamicTheme.colors.white}
              />
              <Text style={themeController(styles.orderChatButtonText)}>
                Ajuda
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {canEvaluate && (
          <View style={themeController(styles.evaluatePartnerContainer)}>
            <Text style={themeController(styles.evaluatePartnerTitle)}>
              O que achou da loja{" "}
              <Text style={themeController(globalStyles.textHighlight)}>
                {orderDetails.partner.fantasy_name}
              </Text>
              ?
            </Text>
            <TouchableOpacity
              style={[themeController(styles.rateButton)]}
              onPress={() => setShowRatingModal(true)}
            >
              <Text style={themeController(styles.rateButtonText)}>
                Avaliar loja
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* <Text style={themeController(globalStyles.subtitle)}>Rastreamento</Text>
        <Text style={themeController(globalStyles.description)}>Veja onde seu pedido está</Text> */}

        <Text style={themeController(globalStyles.subtitle)}>Pedido</Text>
        <Text style={themeController(globalStyles.description)}>
          Você comprou os seguintes itens
        </Text>
        <View style={themeController(orderStyles.informationContainer)}>
          {orderDetails.order_itens.map((item) => (
            <View
              key={item.product_id}
              style={themeController(orderStyles.purchaseContainer)}
            >
              <View style={themeController(orderStyles.purchaseContent)}>
                <Image
                  style={orderStyles.purchaseImage}
                  source={{ uri: item.url }}
                />
                <View
                  style={themeController(orderStyles.purchaseItemInformations)}
                >
                  <Text
                    numberOfLines={1}
                    style={themeController(orderStyles.purchaseName)}
                  >
                    {item.product_name}
                  </Text>
                  <Text style={themeController(orderStyles.purchasePrice)}>
                    {formatPrice(item.product_value)}
                  </Text>
                </View>
              </View>
              <Text style={themeController(orderStyles.purchaseQuantity)}>
                {item.quantity}x
              </Text>
            </View>
          ))}
          <View
            style={themeController(orderStyles.purchaseInformationBeetween)}
          >
            <Text style={themeController(orderStyles.freightText)}>Frete</Text>
            <Text
              style={[
                themeController(orderStyles.purchaseTotal),
                orderDetails.shipping_options.value === 0 &&
                  themeController(orderStyles.freightFree),
              ]}
            >
              {orderDetails.shipping_options.value === 0
                ? "GRÁTIS"
                : formatPrice(orderDetails.shipping_options.value)}
            </Text>
          </View>
          <View
            style={themeController(orderStyles.purchaseInformationBeetween)}
          >
            <Text style={themeController(orderStyles.purchaseTotalLabel)}>
              Total
            </Text>
            <Text
              style={[
                themeController(orderStyles.purchaseTotal),
                themeController(globalStyles.textHighlight),
              ]}
            >
              {formatPrice(orderDetails.amount)}
            </Text>
          </View>
        </View>

        <Text style={themeController(globalStyles.subtitle)}>Pagamento</Text>
        <Text style={themeController(globalStyles.description)}>
          A transação foi efetuada da seguinte forma
        </Text>
        <View style={themeController(orderStyles.informationContainer)}>
          <View
            style={themeController(orderStyles.purchaseInformationBeetween)}
          >
            <Text style={themeController(globalStyles.textHighlight)}>
              Método de pagamento
            </Text>
            <Text style={themeController(orderStyles.paymentTitle)}>
              {orderDetails.payments[0].description}
            </Text>
          </View>
          <View
            style={themeController(orderStyles.purchaseInformationBeetween)}
          >
            <Text style={themeController(globalStyles.textHighlight)}>
              Parcelamento
            </Text>
            <Text style={themeController(orderStyles.paymentMethod)}>
              {orderDetails.payments[0]?.installments
                ? `${orderDetails.payments[0]?.installments}x`
                : "À vista"}
            </Text>
          </View>
        </View>

        {orderDetails.payments[0].description === "Dinheiro" &&
          orderDetails.change > 0 && (
            <>
              <Text style={themeController(globalStyles.subtitle)}>
                Seu troco
              </Text>
              <Text style={themeController(globalStyles.description)}>
                Valor que você receberá de volta
              </Text>

              <View style={themeController(orderStyles.informationContainer)}>
                <View>
                  <View
                    style={themeController(
                      orderStyles.purchaseInformationBeetween
                    )}
                  >
                    <Text style={themeController(globalStyles.textHighlight)}>
                      Valor informado para troco
                    </Text>
                    <Text style={themeController(orderStyles.purchaseTotal)}>
                      {formatPrice(orderDetails.change + orderDetails.amount)}
                    </Text>
                  </View>

                  <View
                    style={themeController(
                      orderStyles.purchaseInformationBeetween
                    )}
                  >
                    <Text style={themeController(globalStyles.textHighlight)}>
                      Total do pedido
                    </Text>
                    <Text style={themeController(orderStyles.purchaseTotal)}>
                      {formatPrice(orderDetails.payments[0].amount_paid)}
                    </Text>
                  </View>

                  <Text style={themeController(orderStyles.transshipmentText)}>
                    Você recebeu{" "}
                    <Text style={themeController(globalStyles.textHighlight)}>
                      {formatPrice(orderDetails.change)}
                    </Text>{" "}
                    de troco.
                  </Text>
                </View>
              </View>
            </>
          )}

        <Text style={themeController(globalStyles.subtitle)}>Endereço</Text>
        <Text style={themeController(globalStyles.description)}>
          Local de entrega do produto
        </Text>

        <View style={themeController(orderStyles.informationContainer)}>
          <Text style={themeController(orderStyles.recipientText)}>
            {orderDetails?.shipping_options.name
              .toLowerCase()
              .indexOf("retirada") > -1
              ? "Entregar"
              : "Enviar"}{" "}
            para{" "}
            <Text style={themeController(globalStyles.textHighlight)}>
              {orderDetails.consumer.legal_name}
            </Text>
          </Text>
          <Text style={themeController(orderStyles.addressText)}>
            {recipientAddress}
          </Text>

          <Text style={themeController(orderStyles.recipientText)}>
            Entrega foi feita por{" "}
            <Text style={themeController(globalStyles.textHighlight)}>
              {orderDetails.shipping_options.name}
            </Text>
          </Text>
        </View>

        {orderDetails.observation && (
          <>
            <Text style={themeController(globalStyles.subtitle)}>
              Observações
            </Text>
            <Text style={themeController(globalStyles.description)}>
              Detalhes que você forneceu para o pedido
            </Text>

            <View style={themeController(orderStyles.informationContainer)}>
              <Text style={themeController(orderStyles.observationsContent)}>
                {orderDetails.observation}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default OrderDetails;
