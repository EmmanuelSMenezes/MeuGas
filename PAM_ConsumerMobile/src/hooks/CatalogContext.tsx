import { createContext, useCallback, useContext, useState } from "react";
import { useGlobal } from "./GlobalContext";
import { REACT_APP_URL_MS_CATALOG } from "@env";
import api from "../services/api";
import { Categories } from "../interfaces/Category";
import { Branch } from "../interfaces/Partner";
import { ICatalog, IProduct } from "../interfaces/Catalog";

interface CatalogProviderProps {
  children: React.ReactNode;
}

interface CatalogProviderValues {
  getPartnerProducts: (
    branch_id: string,
    filter?: string,
    page?: number,
    itensPerPage?: number
  ) => Promise<ICatalog>;
  getCategory: (
    filter?: string,
    page?: number,
    itensPerPage?: number
  ) => Promise<Categories>;
  getProduct: (product_id: string) => Promise<IProduct>;
}

const CatologContext = createContext({} as CatalogProviderValues);

const CatalogProvider = ({ children }: CatalogProviderProps) => {
  const { openAlert } = useGlobal();

  const getPartnerProducts = useCallback(
    async (
      branch_id: string,
      filter?: string,
      page?: number,
      itensPerPage: number = 12
    ): Promise<ICatalog> => {
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

      try {
        const response = await api.get(
          `${REACT_APP_URL_MS_CATALOG}/partner/product/${branch_id}${queriesData}`
        );

        const { data } = response?.data;

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

  const getCategory = useCallback(
    async (
      filter?: string,
      page?: number,
      itensPerPage?: number
    ): Promise<Categories> => {
      const queries = {
        page,
        itensPerPage,
      };

      const queriesData = Object.entries(queries)
        .map(([key, value], index) => {
          if (value)
            return index === 0 ? `?${key}=${value}` : `${key}=${value}`;
        })
        .filter((element) => element)
        .join("&");

      try {
        const response = await api.get(
          `${REACT_APP_URL_MS_CATALOG}/category/get${queriesData}`
        );

        const { data } = response?.data;

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

  const getProduct = useCallback(
    async (product_id: string): Promise<IProduct> => {
      try {
        const response = await api.get(
          `${REACT_APP_URL_MS_CATALOG}/partner/product/id/${product_id}`
        );

        const { data } = response?.data;

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

  const contextValues = {
    getPartnerProducts,
    getCategory,
    getProduct,
  };

  return (
    <CatologContext.Provider value={contextValues}>
      {children}
    </CatologContext.Provider>
  );
};

const useCatalog = () => {
  const context = useContext(CatologContext);

  return context;
};

export { useCatalog, CatalogProvider };
