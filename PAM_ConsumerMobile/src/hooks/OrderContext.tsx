import { createContext, useCallback, useContext, useState } from "react";
import {
  REACT_APP_PAGSEGURO_TOKEN,
  REACT_APP_URL_MS_BILLING,
  REACT_APP_URL_MS_ORDER,
  REACT_APP_URL_PAGSEGURO_CHECKOUT_SESSION,
} from "@env";
import api from "../services/api";
import { useGlobal } from "./GlobalContext";
import {
  Order,
  OrderHistory,
  CreateOrder,
  OrderPayment,
  IOrderStatus,
  IOrderResponse,
  IPaymentMiniumPrice,
  PagSeguroSession,
} from "../interfaces/Order";
import { IData } from "../components/Select";
import { useUser } from "./UserContext";
import axios from "axios";
import { getErrorMessage, logError, logInfo, shouldShowError } from "../utils/errorHandler";

interface OrderProviderProps {
  children: React.ReactNode;
}

interface OrderContextValues {
  getAllOrders: (
    consumer_id: string,
    filter?: string,
    page?: number,
    itensPerPage?: number
  ) => Promise<OrderHistory>;
  getOrderDetails: (order_id: string) => Promise<Order>;
  getOrderPayment: (
    branch_id: string,
    latitude?: string | number,
    longitude?: string | number
  ) => Promise<OrderPayment>;
  createOrder: (order: CreateOrder) => Promise<IOrderResponse>;
  updateOrder: (order: CreateOrder) => Promise<IOrderResponse>;
  getOrderStatusList: () => Promise<IOrderStatus[]>;
  pay: IData[];
  setPay: React.Dispatch<React.SetStateAction<IData[]>>;
  branchOrderSettings: OrderPayment;
  setBranchOrderSettings: React.Dispatch<React.SetStateAction<OrderPayment>>;
  selected: string;
  setSelected: (selected) => void;
  orderDetails: Order;
  setOrderDetails: React.Dispatch<React.SetStateAction<Order>>;
  onGetOrderDetails: (order_id: string) => Promise<void>;
  ordersHistory: OrderHistory;
  setOrdersHistory: React.Dispatch<React.SetStateAction<OrderHistory>>;
  getPaymentMinimumPrice: (partner_id: string) => Promise<IPaymentMiniumPrice>;
  createSession3DS: () => Promise<PagSeguroSession>;
}

const OrderContext = createContext({} as OrderContextValues);

const OrderProvider = ({ children }: OrderProviderProps) => {
  const { openAlert } = useGlobal();
  const { defaultAddress } = useUser();

  const [selected, setSelected] = useState<string>("");

  const [orderDetails, setOrderDetails] = useState<Order>({} as Order);
  const [ordersHistory, setOrdersHistory] = useState<OrderHistory>();

  const [pay, setPay] = useState<IData[]>();
  const [branchOrderSettings, setBranchOrderSettings] =
    useState<OrderPayment>();

  const createSession3DS = useCallback(async (): Promise<PagSeguroSession> => {
    try {
      const { data } = await axios.post(
        REACT_APP_URL_PAGSEGURO_CHECKOUT_SESSION,
        undefined,
        {
          headers: {
            Authorization: `${REACT_APP_PAGSEGURO_TOKEN}`,
            accept: "application/json",
          },
        }
      );
      // console.log("resultado da session", data);
      return data;
    } catch (err) {
      // console.log(JSON.stringify(err));
    }
  }, []);

  const getAllOrders = useCallback(
    async (
      consumer_id: string,
      filter?: string,
      page?: number,
      itensPerPage?: number
    ): Promise<OrderHistory> => {
      try {
        const queries = {
          filter,
          page,
          itensPerPage,
        };

        const queriesData = Object.entries(queries)
          .filter(([key, value]) => !!value)
          .map(([key, value], index) => {
            if (value)
              return index === 0 ? `?${key}=${value}` : `${key}=${value}`;
          })
          .join("&");

        const response = await api.get(
          `${REACT_APP_URL_MS_ORDER}/order/byconsumer/${consumer_id}${queriesData}`
        );

        const { message, data } = response?.data;

        return data;
      } catch (error) {
        openAlert({
          title: "Erro inesperado",
          description: `${error?.response?.data?.message}`,
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });

        if (error.message === "Network Error") {
          openAlert({
            title: "Sem conexão",
            description: "Verifique sua conexão com a rede",
            type: "error",
            buttons: {
              confirmButtonTitle: "Ok",
              cancelButton: false,
            },
          });
        }
      }
    },
    []
  );

  const getOrderDetails = useCallback(
    async (order_id: string): Promise<Order> => {
      try {
        const response = await api.get(
          `${REACT_APP_URL_MS_ORDER}/order/details/${order_id}`
        );

        const { message, data } = response?.data;

        return data;
      } catch (error) {
        openAlert({
          title: "Erro inesperado",
          description: `${error?.response?.data?.message}`,
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });

        if (error.message === "Network Error") {
          openAlert({
            title: "Sem conexão",
            description: "Verifique sua conexão com a rede",
            type: "error",
            buttons: {
              confirmButtonTitle: "Ok",
              cancelButton: false,
            },
          });
        }
      }
    },
    []
  );

  const createOrder = useCallback(
    async (order: CreateOrder): Promise<IOrderResponse> => {
      try {
        const response = await api.post(
          `${REACT_APP_URL_MS_ORDER}/order/create`,
          order
        );

        const { message, data } = response?.data;

        return data;
      } catch (error) {
        // console.log(JSON.stringify(error));
        openAlert({
          title: "Erro inesperado",
          description: `${error?.response?.data?.message}`,
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });

        if (error.message === "Network Error") {
          openAlert({
            title: "Sem conexão",
            description: "Verifique sua conexão com a rede",
            type: "error",
            buttons: {
              confirmButtonTitle: "Ok",
              cancelButton: false,
            },
          });
        }
      }
    },
    []
  );

  const updateOrder = useCallback(
    async (order: CreateOrder): Promise<IOrderResponse> => {
      try {
        const response = await api.put(
          `${REACT_APP_URL_MS_ORDER}/order/update`,
          order
        );

        const { message, data } = response?.data;
        return data;
      } catch (error) {
        openAlert({
          title: "Erro inesperado",
          description: `${error?.response?.data?.message}`,
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });

        if (error.message === "Network Error") {
          openAlert({
            title: "Sem conexão",
            description: "Verifique sua conexão com a rede",
            type: "error",
            buttons: {
              confirmButtonTitle: "Ok",
              cancelButton: false,
            },
          });
        }
      }
    },
    []
  );

  const getOrderStatusList = useCallback(async (): Promise<IOrderStatus[]> => {
    try {
      const response = await api.get(`${REACT_APP_URL_MS_ORDER}/order/status`);

      const { message, data } = response?.data;

      return data.status;
    } catch (error) {
      openAlert({
        title: "Erro inesperado",
        description: `${error?.response?.data?.message}`,
        type: "error",
        buttons: {
          confirmButtonTitle: "Ok",
          cancelButton: false,
        },
      });

      if (error.message === "Network Error") {
        openAlert({
          title: "Sem conexão",
          description: "Verifique sua conexão com a rede",
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });
      }
    }
  }, []);

  const getOrderPayment = useCallback(
    async (
      branch_id: string,
      latitude: string | number = defaultAddress.latitude,
      longitude: string | number = defaultAddress.longitude
    ): Promise<OrderPayment> => {
      try {
        const response = await api.get(
          `${REACT_APP_URL_MS_ORDER}/order/payment/${branch_id}?latitude=${latitude}&longitude=${longitude}`
        );

        const { message, data } = response?.data;

        setBranchOrderSettings(data);

        return data;
      } catch (error) {
        openAlert({
          title: "Erro inesperado",
          description:
            "Houve um problema ao tentar requisitar as formas de pagamento",
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });

        if (error.message === "Network Error") {
          openAlert({
            title: "Sem conexão",
            description: "Verifique sua conexão com a rede",
            type: "error",
            buttons: {
              confirmButtonTitle: "Ok",
              cancelButton: false,
            },
          });
        }
      }
    },
    [defaultAddress]
  );

  const getPaymentMinimumPrice = useCallback(
    async (partner_id: string): Promise<IPaymentMiniumPrice> => {
      try {
        const response = await api.get(
          `${REACT_APP_URL_MS_BILLING}/payment/value-minimum?partner_id=${partner_id}`
        );

        // console.log(JSON.stringify(response))

        const { message, data } = response?.data;

        return data;
      } catch (error) {
        // console.log('Entrou error')
        // console.log(error)
        openAlert({
          title: "Erro inesperado",
          // description:
          //   "Houve um problema ao tentar requisitar o valor mínimo de pedido ",
          description: JSON.stringify(error.response),
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });

        if (error.message === "Network Error") {
          openAlert({
            title: "Sem conexão",
            description: "Verifique sua conexão com a rede",
            type: "error",
            buttons: {
              confirmButtonTitle: "Ok",
              cancelButton: false,
            },
          });
        }
      }
    },
    []
  );

  const onGetOrderDetails = useCallback(async (order_id: string) => {
    const data = await getOrderDetails(order_id);
    // console.log("ORDER DETAILS FOI CHAMADO", JSON.stringify(data));

    setOrderDetails(data);
  }, []);

  const contextValues = {
    createOrder,
    updateOrder,
    getOrderStatusList,
    getAllOrders,
    getOrderDetails,
    getOrderPayment,
    pay,
    setPay,
    branchOrderSettings,
    setBranchOrderSettings,
    selected,
    setSelected,
    orderDetails,
    setOrderDetails,
    onGetOrderDetails,
    ordersHistory,
    setOrdersHistory,
    getPaymentMinimumPrice,
    createSession3DS,
  };

  return (
    <OrderContext.Provider value={contextValues}>
      {children}
    </OrderContext.Provider>
  );
};

const useOrder = () => {
  const context = useContext(OrderContext);

  return context;
};

export { useOrder, OrderProvider };
