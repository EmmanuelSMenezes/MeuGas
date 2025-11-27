import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useAuth } from "./AuthContext";
import { REACT_APP_URL_MS_COMM } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IStatus {
  User_id: string;
  Status: string;
}
interface IChatContext {
  signalRChatConnection?: HubConnection;
  setSignalRChatConnection: (connection: HubConnection) => void;
  status: string;
  setStatus: (setStatus: string) => void;
  targetStatus: IStatus[];
  setTargetStatus: (targetStatus: IStatus[]) => void;
}

const ChatContext = createContext<IChatContext>({} as IChatContext);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [signalRChatConnection, setSignalRChatConnection] = useState<
    HubConnection | undefined
  >();
  const [status, setStatus] = useState<string>();
  const [targetStatus, setTargetStatus] = useState<IStatus[]>([] as IStatus[]);

  const createHubConnectionSignalR = useCallback(async () => {
    const token = await AsyncStorage.getItem("@PAM:token");

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${REACT_APP_URL_MS_COMM}/chat-hub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();
    await newConnection.start();
    setSignalRChatConnection(newConnection);
  }, []);

  useEffect(() => {
    // if (user.user_id) {
    createHubConnectionSignalR();
    // }
  }, []);

  useEffect(() => {
    if (signalRChatConnection && user.user_id) {
      // console.info(`[WS - ON]`);
      signalRChatConnection.invoke("RefreshStatus", user?.user_id, "online");
      signalRChatConnection.invoke("JoinCommunicationChannel", user?.user_id);
    }
  }, [signalRChatConnection && user.user_id]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const contextValue = {
    signalRChatConnection,
    setSignalRChatConnection,
    status,
    setStatus,
    targetStatus,
    setTargetStatus,
  };
  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

const useChatContext = () => {
  const context = useContext(ChatContext);

  return context;
};

export { ChatContext, ChatProvider, useChatContext };
