import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { REACT_APP_URL_MS_CONSUMER } from "@env";
import api from "../services/api";
import { Alert } from "react-native";
import {
  Address,
  Consumer,
  ConsumerProps,
  ICard,
  ICreateCard,
} from "../interfaces/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobal } from "./GlobalContext";
import { goBack, navigate } from "../routes/rootNavigation";
import { getErrorMessage, logError, shouldShowError } from "../utils/errorHandler";

interface UserProviderProps {
  children: React.ReactNode;
}

interface UserContextValues {
  getAllAddresses: () => Promise<any>;
  getAddress: (addressId: string) => Promise<Address>;
  addresses: Address[];
  postNewAddress: (newAddress: Address) => void;
  getConsumer: (user_id: string) => Promise<Consumer>;
  createConsumer: (data: ConsumerProps) => void;
  removeAddress: (address_ids: string[]) => Promise<any>;
  updateAddress: (address: Address) => Promise<any>;
  updateConsumer: (newConsumer: ConsumerProps) => Promise<void>;
  consumer: Consumer;
  setConsumer: React.Dispatch<React.SetStateAction<Consumer>>;
  userLocation: Address;
  setUserLocation: React.Dispatch<React.SetStateAction<Address>>;
  defaultAddress: Address;
  createCard: (card: ICreateCard) => Promise<void>;
  getAllCards: () => Promise<ICard[]>;
  consumerCards: ICard[];
  setConsumerCards: React.Dispatch<React.SetStateAction<ICard[]>>;
  updateCard: (card: ICard) => Promise<void>;
  deleteCard: (card_id: string) => Promise<void>;
}

const UserContext = createContext({} as UserContextValues);

const UserProvider = ({ children }: UserProviderProps) => {
  const { openAlert } = useGlobal();

  const [consumer, setConsumer] = useState<Consumer>({} as Consumer);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [userLocation, setUserLocation] = useState<Address>();

  const [consumerCards, setConsumerCards] = useState<ICard[]>([]);

  // Carregar consumer do AsyncStorage quando o app inicia
  useEffect(() => {
    const loadConsumerFromStorage = async () => {
      try {
        const storagedConsumer = await AsyncStorage.getItem("@PAM:consumer");
        if (storagedConsumer) {
          const consumerData = JSON.parse(storagedConsumer);
          console.log("📦 Consumer carregado do AsyncStorage:", consumerData);
          setConsumer(consumerData);
        }
      } catch (error) {
        console.error("❌ Erro ao carregar consumer do AsyncStorage:", error);
      }
    };

    loadConsumerFromStorage();
  }, []);

  const defaultAddress = userLocation
    ? userLocation
    : addresses.find(
        ({ address_id }) => address_id === consumer?.default_address
      );

  const createConsumer = useCallback(async (data: ConsumerProps) => {
    try {
      const response = await api.post(
        `${REACT_APP_URL_MS_CONSUMER}/consumer/create`,
        data
      );

      setConsumer(response?.data);
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

  const getConsumer = useCallback(
    async (user_id: string): Promise<Consumer> => {
      try {
        const response = await api.get(
          `${REACT_APP_URL_MS_CONSUMER}/consumer?user_id=${user_id}`
        );
        const { data } = response?.data;

        await AsyncStorage.setItem("@PAM:consumer", JSON.stringify(data));

        return data;
      } catch (error) {
        logError("UserContext.getConsumer", error);

        if (shouldShowError(error)) {
          const errorMsg = getErrorMessage(error);
          openAlert({
            title: errorMsg.title,
            description: errorMsg.description,
            type: errorMsg.type,
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

  const updateConsumer = useCallback(async (newConsumer: Consumer) => {
    try {
      const response = await api.put(
        `${REACT_APP_URL_MS_CONSUMER}/consumer/update`,
        {
          ...newConsumer,
          active: true,
        }
      );

      const { data } = response?.data;

      await AsyncStorage.setItem("@PAM:consumer", JSON.stringify(data));

      setConsumer(data);
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

  const getAllAddresses = useCallback(async (): Promise<any> => {
    try {
      const response = await api.get(
        `${REACT_APP_URL_MS_CONSUMER}/address/all?consumer_id=${consumer.consumer_id}`
      );

      const { data } = response?.data;

      if (
        data.length > 0 &&
        !data.find(
          (address) => address?.address_id === consumer?.default_address
        )
      ) {
        await updateConsumer({
          ...consumer,
          default_address: data[0].address_id,
        });
      }

      setAddresses(data);

      return response?.data;
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
  }, [consumer]);

  const getAddress = useCallback(
    async (address_id: string): Promise<Address> => {
      try {
        const response = await api.get(
          `${REACT_APP_URL_MS_CONSUMER}/address/get?address_id=${address_id}`
        );

        return response?.data?.data;
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

  const postNewAddress = useCallback(
    async (newAddress: Address) => {
      const data = {
        ...newAddress,
        consumer_id: consumer?.consumer_id,
      };

      try {
        const response = await api.post(
          `${REACT_APP_URL_MS_CONSUMER}/address/create`,
          data
        );

        const { message } = response?.data;

        if (addresses.length === 0) {
          await updateConsumer({
            ...consumer,
            default_address: response?.data?.data?.address_id,
          });
        }

        openAlert({
          title: "Endereço cadastrado",
          description: message,
          type: "success",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
            onConfirm: () => {
              getAllAddresses();
              goBack();
            },
          },
        });
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
    [consumer, addresses]
  );

  const removeAddress = useCallback(
    async (address_ids: string[]): Promise<any> => {
      try {
        const response = await api.delete(
          `${REACT_APP_URL_MS_CONSUMER}/address/delete`,
          {
            data: address_ids,
          }
        );

        const { message } = response?.data;

        openAlert({
          title: "Endereço removido",
          description: message,
          type: "success",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });

        return response?.data;
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

  const updateAddress = useCallback(
    async (address: Address): Promise<any> => {
      try {
        const response = await api.put(
          `${REACT_APP_URL_MS_CONSUMER}/address/update`,
          {
            ...address,
            consumer_id: consumer.consumer_id,
          }
        );

        return response?.data;
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
    [consumer]
  );

  const createCard = useCallback(
    async (card: ICreateCard): Promise<any> => {
      try {
        const response = await api.post(
          `${REACT_APP_URL_MS_CONSUMER}/card/create`,
          {
            ...card,
            consumer_id: consumer.consumer_id,
          }
        );

        getAllCards();

        return response?.data;
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
    [consumer]
  );

  const getAllCards = useCallback(async (): Promise<ICard[]> => {
    try {
      const response = await api.get(
        `${REACT_APP_URL_MS_CONSUMER}/card/get/consumer/${consumer?.consumer_id}`
      );

      setConsumerCards(response.data.data);

      return response?.data;
    } catch (error) {
      logError("UserContext.getAllCards", error);

      if (shouldShowError(error)) {
        const errorMsg = getErrorMessage(error);
        openAlert({
          title: errorMsg.title,
          description: errorMsg.description || "Ocorreu um problema ao requisitar os cartões do usuário",
          type: errorMsg.type,
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });
      }
    }
  }, [consumer]);

  const updateCard = useCallback(
    async (card: ICard): Promise<any> => {
      try {
        const response = await api.put(
          `${REACT_APP_URL_MS_CONSUMER}/card/update`,
          card
        );

        getAllCards();

        return response?.data;
      } catch (error) {
        openAlert({
          title: "Erro inesperado",
          description: `Ocorreu um problema ao requisitar os cartões do usuário`,
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
    [consumer]
  );

  const deleteCard = useCallback(
    async (card_id: string): Promise<any> => {
      try {
        const response = await api.delete(
          `${REACT_APP_URL_MS_CONSUMER}/card/delete?card_id=${card_id}`
        );

        getAllCards();

        return response?.data;
      } catch (error) {
        openAlert({
          title: "Erro inesperado",
          description: `Ocorreu um problema ao requisitar os cartões do usuário`,
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
    [consumer]
  );

  const contextValues = {
    getAllAddresses,
    getAddress,
    postNewAddress,
    addresses,
    getConsumer,
    createConsumer,
    removeAddress,
    consumer,
    setConsumer,
    updateAddress,
    updateConsumer,
    userLocation,
    setUserLocation,
    defaultAddress,
    createCard,
    getAllCards,
    consumerCards,
    setConsumerCards,
    updateCard,
    deleteCard,
  };

  return (
    <UserContext.Provider value={contextValues}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);

  return context;
};

export { useUser, UserProvider };
