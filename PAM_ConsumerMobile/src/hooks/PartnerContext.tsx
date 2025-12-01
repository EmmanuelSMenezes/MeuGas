import { createContext, useCallback, useContext } from "react";
import { REACT_APP_URL_MS_PARTNER } from "@env";
import api from "../services/api";
import { useGlobal } from "./GlobalContext";
import { IStoreDetails } from "../interfaces/Store";
import { getErrorMessage, logError, shouldShowError } from "../utils/errorHandler";

interface PartnerProviderProps {
  children: React.ReactNode;
}

interface PartnerContextValues {
  getStore: (
    branch_id: string,
    filter?: string,
    page?: number,
    itensPerPage?: number
  ) => Promise<IStoreDetails>;
}

const PartnerContext = createContext({} as PartnerContextValues);

const PartnerProvider = ({ children }: PartnerProviderProps) => {
  const { openAlert } = useGlobal();

  const getStore = useCallback(
    async (
      branch_id: string,
      filter?: string,
      page?: number,
      itensPerPage: number = 12
    ): Promise<IStoreDetails> => {
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
          `${REACT_APP_URL_MS_PARTNER}/branch/details/${branch_id}${queriesData}`
        );

        const { message, data } = response?.data;

        return data;
      } catch (error) {
        logError("PartnerContext.getStore", error);

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

  const contextValues = {
    getStore,
  };

  return (
    <PartnerContext.Provider value={contextValues}>
      {children}
    </PartnerContext.Provider>
  );
};

const usePartner = () => {
  const context = useContext(PartnerContext);

  return context;
};

export { usePartner, PartnerProvider };
