import { createContext, useCallback, useContext, useState } from 'react';
import { REACT_APP_URL_MS_COMM } from '@env';
import api from '../services/api';
import { useGlobal } from './GlobalContext';
import { IChat, Message } from '../interfaces/Chat';

interface CommunicationProviderProps {
  children: React.ReactNode;
}

interface INotification {
  notification_id: string,
  title: string,
  description: string,
  read_at: string,
  user_id: string,
  type: string,
  aux_content: string,
  created_at: string
}

interface CommunicationContextValues {
  getAllNotifications: (user_id: string) => Promise<INotification[]>,
  createChatComm: (user_id:string, target_id:string, description:string, order_id: string) => Promise<any>,
  getConversations: (user_id: string) => Promise<any>,
  updateMessage: (message: Message) => Promise<any>,
  updateChat: (update: { chat_id?: string, closed_by: string }) => Promise<any>,

  chats: IChat[],
  setChats: React.Dispatch<React.SetStateAction<IChat[]>>,
  selectedChat: IChat,
  setSelectedChat: React.Dispatch<React.SetStateAction<IChat>>
}

const CommunicationContext = createContext({} as CommunicationContextValues);

const CommunicationProvider = ({ children }: CommunicationProviderProps) => {

  const { openAlert } = useGlobal();

  const [chats, setChats] = useState<IChat[]>();
  const [selectedChat, setSelectedChat] = useState<IChat>();

  const getAllNotifications = useCallback(async (user_id: string): Promise<INotification[]> => {
    try {
      const response = await api.get(`${REACT_APP_URL_MS_COMM}/notification/listNotificationsByUserId?user_id=${user_id}`);

      const { message, data } = response?.data;

      return data;
    } catch (error) {
      openAlert({
        title: 'Erro inesperado',
        description: `${error?.response?.data?.message}`,
        type: 'error',
        buttons: {
          confirmButtonTitle: 'Ok',
          cancelButton: false
        }
      })

      if (error.message === 'Network Error') {
        openAlert({
          title: 'Sem conexão',
          description: 'Verifique sua conexão com a rede',
          type: 'error',
          buttons: {
            confirmButtonTitle: 'Ok',
            cancelButton: false
          }
        })
      }
    }
  }, []);

  const createChatComm = useCallback(async (user_id:string, target_id:string, description:string, order_id:string) : Promise<any> =>{

    try {

      const response = await api.post(`${REACT_APP_URL_MS_COMM}/chat/create`,{
        order_id,
        description,
        members: [
          user_id,
          target_id,
        ]
      });

      const { message, data } = response?.data;
      return data;
    } catch (error) {
      openAlert({
        title: 'Erro inesperado',
        description: `${error?.response?.data?.message}`,
        type: 'error',
        buttons: {
          confirmButtonTitle: 'Ok',
          cancelButton: false
        }
      })

      if (error.message === 'Network Error') {
        openAlert({
          title: 'Sem conexão',
          description: 'Verifique sua conexão com a rede',
          type: 'error',
          buttons: {
            confirmButtonTitle: 'Ok',
            cancelButton: false
          }
        })
      }
    }

  },[])

async function getConversations(user_id: string) {
    const response = await api.get(`${REACT_APP_URL_MS_COMM}/chat/list`, {
      params: { member_id: user_id },
    });
    return response.data.data;
}

async function updateMessage(message: Message) {
  const response = await api.put(`${REACT_APP_URL_MS_COMM}/message/update`, message);
  return response.data.data;
}

async function updateChat(update: { chat_id?: string, closed_by: string }) {
const response = await api.put(`${REACT_APP_URL_MS_COMM}/chat/update`, update);
// console.log(response.data.data, 'UPDATE')
return response.data.data;
}
  const contextValues = {
    getAllNotifications,
    createChatComm,
    getConversations,
    updateMessage,
    updateChat,

    chats,
    setChats,
    selectedChat,
    setSelectedChat
  };

  return (
    <CommunicationContext.Provider value={contextValues}>
      {children}
    </CommunicationContext.Provider>
  );
};

const useCommunication = () => {
  const context = useContext(CommunicationContext);

  return context;
};

export { useCommunication, CommunicationProvider };
