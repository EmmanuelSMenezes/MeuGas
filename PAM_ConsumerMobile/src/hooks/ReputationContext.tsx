import { createContext, useCallback, useContext } from "react";
import { REACT_APP_URL_MS_REPUTATION } from "@env";
import api from "../services/api";
import { useGlobal } from "./GlobalContext";
import {
  EvaluatePartnerProps,
  PartnerRating,
  Rating,
} from "../interfaces/Reputation";
import { useUser } from "./UserContext";
import { useAuth } from "./AuthContext";
import { getErrorMessage, logError, shouldShowError } from "../utils/errorHandler";

interface ReputationProviderProps {
  children: React.ReactNode;
}

interface ReputationContextValues {
  evaluatePartner: (rating: EvaluatePartnerProps) => Promise<PartnerRating>;
  getBranchWasEvaluated: (branch_id: string) => Promise<PartnerRating>;
}

const ReputationContext = createContext({} as ReputationContextValues);

const ReputationProvider = ({ children }: ReputationProviderProps) => {
  const { openAlert } = useGlobal();
  const { user } = useAuth();

  const evaluatePartner = useCallback(
    async (rating: EvaluatePartnerProps): Promise<PartnerRating> => {
      try {
        const response = await api.post(
          `${REACT_APP_URL_MS_REPUTATION}/rating/create`,
          rating
        );

        const { message, data } = response?.data;

        return data;
      } catch (error) {
        logError("ReputationContext.evaluatePartner", error);

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

        throw error;
      }
    },
    []
  );

  const getBranchWasEvaluated = useCallback(
    async (branch_id: string): Promise<PartnerRating> => {
      try {
        const response = await api.get(
          `${REACT_APP_URL_MS_REPUTATION}/rating/byconsumer?branch_id=${branch_id}&user_id=${user.user_id}`
        );

        const { message, data } = response?.data;

        return data;
      } catch (error) {
        logError("ReputationContext.getBranchWasEvaluated", error);

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

        throw error;
      }
    },
    [user]
  );

  const contextValues = {
    evaluatePartner,
    getBranchWasEvaluated,
  };

  return (
    <ReputationContext.Provider value={contextValues}>
      {children}
    </ReputationContext.Provider>
  );
};

const useReputation = () => {
  const context = useContext(ReputationContext);

  return context;
};

export { useReputation, ReputationProvider };
