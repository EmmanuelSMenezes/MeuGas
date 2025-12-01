import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { Header } from "../../components/Shared";
import { useGlobal } from "../../hooks/GlobalContext";
import { styles } from "./styles";
import { theme } from "../../styles/theme";
import { useOrder } from "../../hooks/OrderContext";
import { useUser } from "../../hooks/UserContext";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import { formatPrice } from "../../utils/formatPrice";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { orderStyles } from "../../styles/orderStyles";
import { useStatusContext } from "../../hooks/StatusContext";
import { useThemeContext } from "../../hooks/themeContext";
import { useAuth } from "../../hooks/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Orders: React.FC = () => {
  const { openAlert } = useGlobal();
  const { user } = useAuth();
  const { consumer } = useUser();
  const { getAllOrders, getOrderStatusList, ordersHistory, setOrdersHistory } =
    useOrder();
  const { dynamicTheme, themeController } = useThemeContext();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { navigate, replace } = useNavigation<NativeStackNavigationProp<any>>();

  const { signalROrderConnection } = useStatusContext();

  const onGetOrders = async () => {
    const data = await getAllOrders(consumer.consumer_id);

    setOrdersHistory(data);
    setIsLoading(false);
  };

  const onGetMoreOrders = async (filter?: string) => {
    setIsLoading(true);

    const { orders } = await getAllOrders(
      consumer.consumer_id,
      filter,
      currentPage + 1
    );

    setOrdersHistory((oldOrders) => {
      return {
        ...ordersHistory,
        orders: oldOrders.orders.concat(orders),
      };
    });

    setCurrentPage((page) => page + 1);
    setIsLoading(false);
  };

  const orderStatusStyle = {
    "Aguardando pagamento": orderStyles.statusColorPending,
    Pendente: orderStyles.statusColorPending,
    Recusado: orderStyles.statusColorCanceled,
    Aceito: orderStyles.statusColorFinishedOrAccepted,
    "Em andamento": orderStyles.statusColorPending,
    Concluído: orderStyles.statusColorFinishedOrAccepted,
    "Cancelado pelo cliente": orderStyles.statusColorCanceled,
  };

  const orderStatusIcon = {
    "Aguardando pagamento": (
      <MaterialIcons name="toll" size={18} color={dynamicTheme.colors.white} />
    ),
    Pendente: (
      <MaterialIcons
        name="access-time"
        size={18}
        color={dynamicTheme.colors.white}
      />
    ),
    Recusado: (
      <MaterialCommunityIcons
        name="cancel"
        size={18}
        color={dynamicTheme.colors.white}
      />
    ),
    Aceito: (
      <MaterialIcons name="check" size={18} color={dynamicTheme.colors.white} />
    ),
    "Em andamento": (
      <MaterialIcons
        name="delivery-dining"
        size={18}
        color={dynamicTheme.colors.white}
      />
    ),
    Concluído: (
      <MaterialIcons name="check" size={18} color={dynamicTheme.colors.white} />
    ),
    "Cancelado pelo cliente": (
      <MaterialCommunityIcons
        name="cancel"
        size={18}
        color={dynamicTheme.colors.white}
      />
    ),
  };

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (!user?.user_id) {
      console.log("❌ Orders - Usuário não autenticado, redirecionando para login");
      replace("PhoneAuth");
      return;
    }

    console.log("✅ Orders - Usuário autenticado:", user.user_id);
    onGetOrders();
    getOrderStatusList();
  }, []);

  useEffect(() => {
    if (signalROrderConnection && ordersHistory?.orders?.length > 0) {
      signalROrderConnection.on(
        "OrderStatusChanged",
        async (order_id, order_status_id, status_name) => {
          const order = ordersHistory.orders.findIndex(
            (order) => order.order_id === order_id
          );

          if (order >= 0) {
            // Se o pedido foi concluído, remove da lista
            if (status_name === "Concluído") {
              const newOrders = ordersHistory.orders.filter(
                (o) => o.order_id !== order_id
              );

              setOrdersHistory((orders) => {
                return {
                  ...orders,
                  orders: newOrders,
                };
              });
            } else {
              // Caso contrário, apenas atualiza o status
              const currentOrder = ordersHistory.orders[order];
              currentOrder.orders_status_id = order_status_id;
              currentOrder.status_name = status_name;

              const newOrders = [...ordersHistory.orders];
              newOrders[order] = currentOrder;

              setOrdersHistory((orders) => {
                return {
                  ...orders,
                  orders: newOrders,
                };
              });
            }
          }
        }
      );
    }
  }, [signalROrderConnection && ordersHistory?.orders?.length > 0]);

  return (
    <View style={globalStyles.container}>
      <Header backButton />

      <FlatList
        data={ordersHistory?.orders}
        ListHeaderComponent={
          <Text style={globalStyles.title}>Seus pedidos</Text>
        }
        ListEmptyComponent={
          !isLoading && (
            <Text style={globalStyles.listEmpty}>
              Você ainda não fez pedidos
            </Text>
          )
        }
        ListFooterComponent={
          isLoading && (
            <ActivityIndicator size={24} color={dynamicTheme.colors.primary} />
          )
        }
        onEndReachedThreshold={0.4}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd === 0) return;

          if (
            ordersHistory?.pagination?.totalPages >= currentPage &&
            !isLoading
          ) {
            onGetMoreOrders();
          }
        }}
        contentContainerStyle={styles.orderListContainer}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.order_id}
        extraData={dynamicTheme}
        renderItem={({ item }) => (
          <View
            key={item.order_id}
            style={themeController(styles.orderContainer)}
          >
            <View style={themeController(styles.orderHeader)}>
              <Text style={themeController(styles.orderId)}>
                Pedido n° {item.order_number}
              </Text>

              <View
                style={[
                  themeController(styles.orderStatus),
                  orderStatusStyle[item.status_name],
                ]}
              >
                {orderStatusIcon[item.status_name]}
                <Text style={[themeController(styles.orderStatusText)]}>
                  {item.status_name}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigate("StoreDetails", { branch_id: item.partner.branch_id })
              }
              style={themeController(styles.orderStoreContainer)}
            >
              <View style={themeController(styles.orderStore)}>
                <MaterialIcons
                  name="store"
                  size={18}
                  color={theme.colors.text}
                />
                <Text style={themeController(styles.storeName)}>
                  {item.partner.branch_name}
                </Text>
              </View>
              <Entypo
                name="chevron-small-right"
                size={18}
                color={theme.colors.text}
              />
            </TouchableOpacity>

            {item.order_itens.map((orderItem) => (
              <View
                key={orderItem.order_item_id}
                style={themeController(styles.orderContent)}
              >
                <View style={themeController(styles.orderItem)}>
                  <Image
                    style={styles.orderItemImage}
                    source={{ uri: orderItem.url }}
                  />
                  <View style={themeController(styles.orderItemInformations)}>
                    <Text
                      numberOfLines={1}
                      style={themeController(styles.orderItemName)}
                    >
                      {orderItem.product_name}
                    </Text>
                    <Text style={themeController(styles.orderItemPrice)}>
                      {formatPrice(orderItem.product_value)}
                    </Text>
                  </View>
                </View>

                <Text style={themeController(styles.orderItemQuantity)}>
                  {orderItem.quantity}x
                </Text>
              </View>
            ))}

            <View style={themeController(styles.orderFooter)}>
              {item.status_name === "Em andamento" && (
                <TouchableOpacity
                  style={themeController(styles.orderHelpButton)}
                  onPress={() =>
                    navigate("Chat", {
                      order_id: item.order_id,
                      description: `Pedido n° ${item.order_number}`,
                      partner: item.partner,
                    })
                  }
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={18}
                    color={dynamicTheme.colors.white}
                  />
                  <Text style={themeController(styles.orderHelpButtonText)}>
                    Ajuda
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  styles.orderDetailsButton,
                  { backgroundColor: dynamicTheme.colors.primary },
                ]}
                onPress={() => navigate("OrderDetails", { id: item.order_id })}
              >
                <Text style={themeController(styles.orderDetailsButtonText)}>
                  Ver detalhes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Orders;
