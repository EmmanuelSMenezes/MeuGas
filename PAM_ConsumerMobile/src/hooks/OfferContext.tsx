import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  REACT_APP_URL_MS_CONSUMER,
  REACT_APP_URL_MS_OFFER,
  REACT_APP_URL_MS_PARTNER,
} from "@env";
import api from "../services/api";
import { useGlobal } from "./GlobalContext";
import {
  IBranch,
  IBranches,
  IOfferProducts,
  IOfferSearchedProducts,
  ISearchFilters,
} from "../interfaces/Offer";
import { useUser } from "./UserContext";
import { useLocation } from "./LocationContext";
import { TSortOptions } from "../interfaces/Utils";
import { getErrorMessage, logError, shouldShowError } from "../utils/errorHandler";

export type OrderProductsBy = 'Ratings' | 'Price'

interface OfferProviderProps {
  children: React.ReactNode;
}

interface OfferContextValues {
  getProductsByBranch: (
    branch_id: string,
    filter?: string,
    page?: number,
    itensPerPage?: number
  ) => Promise<IOfferProducts>;
  getProductsByLocation: (
    itensPerPage?: number,
    page?: number,
    filter?: string,
    category_ids?: string,
    branch_ids?: string,
    ratings?: string,
    distance?: string,
    start_price?: string,
    end_price?: string,
    sort_price?: TSortOptions,
    orderBy?: OrderProductsBy,
    shipping?: boolean
  ) => Promise<IOfferSearchedProducts>;
  getStoresByLocation: (
    orderBy?: TOrderOptions,
    sort?: TSortOptions,
    filter?: string,
    page?: number,
    itensPerPage?: number
  ) => Promise<IBranches>;
  getStoreIsAvailable: (
    branch_id: string,
    latitude?: number,
    longitude?: number
  ) => Promise<boolean>;
  getFilterByLocation: (
    filter?: string,
    latitude?: number,
    longitude?: number
  ) => Promise<ISearchFilters>;
  getPartnersByCategory: (
    categoryType: string
  ) => Promise<IBranch[]>;
}

type TOrderOptions = "Ratings" | "OrdersNumbers";

const OfferContext = createContext({} as OfferContextValues);

const OfferProvider = ({ children }: OfferProviderProps) => {
  const { openAlert } = useGlobal();
  const { defaultAddress } = useUser();
  const { currentLocation } = useLocation();

  // Usar localização do GPS se usuário não estiver logado, senão usar endereço padrão
  const activeLocation = defaultAddress || currentLocation;

  const getProductsByBranch = useCallback(
    async (
      branch_id: string,
      filter?: string,
      page?: number,
      itensPerPage: number = 12
    ): Promise<IOfferProducts> => {
      const queries = {
        branch_id,
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

      try {
        const response = await api.get(
          `${REACT_APP_URL_MS_OFFER}/offer/productOffersByBranch${queriesData}`
        );

        const { message, data } = response?.data;

        return data;
      } catch (error) {
        logError("OfferContext.getProductsByBranch", error);

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

  const getProductsByLocation = useCallback(
    async (
      itensPerPage: number = 12,
      page?: number,
      filter?: string,
      category_ids?: string,
      branch_ids?: string,
      ratings?: string,
      distance?: string,
      start_price?: string,
      end_price?: string,
      sort_price?: TSortOptions,
      orderBy: OrderProductsBy = 'Ratings',
      shipping?: boolean,
    ): Promise<IOfferSearchedProducts> => {
      const queries = {
        latitude: activeLocation?.latitude,
        longitude: activeLocation?.longitude,
        filter,
        category_ids,
        branch_ids,
        ratings,
        distance,
        start_price,
        end_price,
        page,
        itensPerPage,
        sort_price,
        orderBy
      };

      const queriesData = Object.entries(queries)
        .filter(([key, value]) => !!value)
        .map(([key, value], index) => {
          if (value)
            return index === 0 ? `?${key}=${value}` : `${key}=${value}`;
        })
        .join("&");
      
      try {
        const response = await api.get(
          `${REACT_APP_URL_MS_OFFER}/offer/productOffersByLocationPoint${queriesData}${shipping ? `&shipping_free=${shipping}` : ''}`
        );

        const { message, data } = response?.data;

        return data;
      } catch (error) {
        logError("OfferContext.getProductOffersByLocationPoint", error);

        // Não mostrar alerta de erro 401 (já está sendo tratado pelo interceptor)
        if (shouldShowError(error) && error?.response?.status !== 401) {
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

        // Retornar objeto vazio para evitar erros de "Cannot read property 'products' of undefined"
        return { products: [], pagination: { currentPage: 1, totalPages: 0, totalRows: 0, itensPerPage: 0 } };
      }
    },
    [activeLocation]
  );

  const getStoresByLocation = useCallback(
    async (
      orderBy?: TOrderOptions,
      sort?: TSortOptions,
      filter?: string,
      page?: number,
      itensPerPage?: number
    ): Promise<IBranches> => {
      const queries = {
        latitude: activeLocation?.latitude,
        longitude: activeLocation?.longitude,
        filter,
        page,
        itensPerPage,
        orderBy,
        sort,
      };

      // DEBUG: Log para verificar coordenadas
      if (__DEV__) {
        console.log('🔍 [OfferContext.getStoresByLocation] Buscando revendas...');
        console.log('📍 Coordenadas:', {
          latitude: activeLocation?.latitude,
          longitude: activeLocation?.longitude,
          activeLocation: activeLocation,
          defaultAddress: defaultAddress,
          currentLocation: currentLocation
        });
      }

      const queriesData = Object.entries(queries)
        .filter(([key, value]) => !!value)
        .map(([key, value], index) => {
          if (value)
            return index === 0 ? `?${key}=${value}` : `${key}=${value}`;
        })
        .join("&");

      const url = `${REACT_APP_URL_MS_OFFER}/offer/branchOffersByLocationPoint${queriesData}`;

      // DEBUG: Log da URL completa
      if (__DEV__) {
        console.log('🌐 URL:', url);
      }

      try {
        const response = await api.get(url);
        const { message, data } = response?.data;

        // DEBUG: Log da resposta
        if (__DEV__) {
          console.log('✅ Resposta:', {
            message,
            totalBranches: data?.branches?.length || 0,
            data
          });
        }

        return data;
      } catch (error) {
        logError("OfferContext.getProductsByLocation", error);

        if (shouldShowError(error)) {
          const errorMsg = getErrorMessage(error);
          openAlert({
            title: errorMsg.title,
            description: errorMsg.description || "Não foi possível carregar as revendas próximas",
            type: errorMsg.type,
            buttons: {
              confirmButtonTitle: "Ok",
              cancelButton: false,
            },
          });
        }

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
    [activeLocation, defaultAddress, currentLocation]
  );

  const getStoreIsAvailable = useCallback(
    async (
      branch_id: string,
      latitude?: number,
      longitude?: number
    ): Promise<boolean> => {
      const coords = {
        latitude: latitude || activeLocation?.latitude,
        longitude: longitude || activeLocation?.longitude,
      };
      try {
        const response = await api.get(
          `${REACT_APP_URL_MS_OFFER}/offer/branchByLocationPoint?latitude=${coords.latitude}&longitude=${coords.longitude}&branch_id=${branch_id}`
        );
        const { message, data } = response?.data;

        return data;
      } catch (error) {
        logError("OfferContext.getProductOffersByLocationPointSearch", error);

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
    [activeLocation]
  );

  const getFilterByLocation = useCallback(
    async (
      filter?: string,
      latitude?: number,
      longitude?: number
    ): Promise<ISearchFilters> => {
      const coords = {
        latitude: latitude || activeLocation?.latitude,
        longitude: longitude || activeLocation?.longitude,
      };

      try {
        const response = await api.get(
          `${REACT_APP_URL_MS_OFFER}/offer/filtersByLocationPoint?latitude=${
            coords.latitude
          }&longitude=${coords.longitude}${filter ? `&filter=${filter}` : ""}`
        );
        const { message, data } = response?.data;

        return data;
      } catch (error) {
        logError("OfferContext.getFilterByLocation", error);

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
    [activeLocation]
  );

  const getPartnersByCategory = useCallback(
    async (categoryType: string): Promise<IBranch[]> => {
      try {
        // Buscar todas as revendas próximas
        const branches = await getStoresByLocation();

        // Filtrar por categoria (gás ou água)
        // Aqui você pode adicionar lógica adicional para filtrar por categoria
        // Por enquanto, retorna todas as revendas únicas
        const uniqueBranches = branches?.branches || [];

        // Remover duplicatas baseado no partner_id
        const uniquePartners = uniqueBranches.reduce((acc, branch) => {
          if (!acc.find(b => b.partner_id === branch.partner_id)) {
            acc.push(branch);
          }
          return acc;
        }, [] as IBranch[]);

        return uniquePartners;
      } catch (error) {
        logError(error, 'OfferContext.getPartnersByCategory');
        openAlert({
          title: "Erro ao buscar marcas",
          description: getErrorMessage(error),
          type: "error",
          buttons: {
            confirmButtonTitle: "Ok",
            cancelButton: false,
          },
        });
        return [];
      }
    },
    [getStoresByLocation]
  );

  const contextValues = {
    getProductsByBranch,
    getProductsByLocation,
    getStoresByLocation,
    getStoreIsAvailable,
    getFilterByLocation,
    getPartnersByCategory,
  };

  return (
    <OfferContext.Provider value={contextValues}>
      {children}
    </OfferContext.Provider>
  );
};

const useOffer = () => {
  const context = useContext(OfferContext);

  return context;
};

export { useOffer, OfferProvider };
