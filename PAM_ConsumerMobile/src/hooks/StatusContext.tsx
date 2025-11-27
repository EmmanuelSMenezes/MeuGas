import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { REACT_APP_URL_MS_ORDER } from "@env";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOrder } from "./OrderContext";

interface IStatusContext {
  signalROrderConnection?: HubConnection;
  setSignalROrderConnection: (connection: HubConnection) => void;
}

interface IOrderStatus {
  order_id: string;
  status: string;
}

const StatusContext = createContext<IStatusContext>({} as IStatusContext);

const StatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [signalROrderConnection, setSignalROrderConnection] = useState<
    HubConnection | undefined
  >();

  const { onGetOrderDetails, ordersHistory, setOrdersHistory } = useOrder();

  const createHubConnectionSignalR = useCallback(async () => {
    const token = await AsyncStorage.getItem("@PAM:token");
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${REACT_APP_URL_MS_ORDER}/order-status-hub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    await newConnection.start();

    setSignalROrderConnection(newConnection);
  }, []);

  useEffect(() => {
    if (signalROrderConnection) {
      signalROrderConnection.on(
        "OrderStatusChanged",
        async (order_id, order_status_id, status_name) => {
          // onGetOrderDetails(order_id);
          // console.log("fui chamado", order_id, order_status_id, status_name);

          const order = ordersHistory.orders.findIndex(
            (order) => order.order_id === order_id
          );

          if (order >= 0) {
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
      );
    }
  }, [signalROrderConnection]);

  useEffect(() => {
    createHubConnectionSignalR();
  }, []);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const contextValue = {
    signalROrderConnection,
    setSignalROrderConnection,
  };

  return (
    <StatusContext.Provider value={contextValue}>
      {children}
    </StatusContext.Provider>
  );
};
const useStatusContext = () => {
  const context = useContext(StatusContext);

  return context;
};

export { useStatusContext, StatusContext, StatusProvider };
