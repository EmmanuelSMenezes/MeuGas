import React, { useState, useCallback, useEffect } from "react";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { RootStackParams } from "../../interfaces/RouteTypes";
import { globalStyles } from "../../styles/globalStyles";
import { BlueHeader } from "../../components/BlueHeader";
import ChatHeader from "./components/ChatHeader";
import { styles } from "./styles";
import { Feather } from "@expo/vector-icons";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { theme } from "../../styles/theme";
import { navigate } from "../../routes/rootNavigation";
import { useCommunication } from "../../hooks/CommunicationContext";
import { useChatContext } from "../../hooks/ChatContext";
import { useAuth } from "../../hooks/AuthContext";
import uuidv4 from "../../utils/uuidv4";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/Loading";
import { IChat, IMessage } from "../../interfaces/Chat";
import { formatDistanceToNowStrictDate } from "../../utils/formatTimeZone";
import { usePartner } from "../../hooks/PartnerContext";
import { IStoreDetails } from "../../interfaces/Store";

interface IChatMessage {
  content: string;
  read_at: string;
  created_at: string;
  sender_id: string;
  message_id: string;
  messageType: string;
  token?: string;
}

const Chat: React.FC<RootStackParams<"Chat">> = ({ route }) => {
  const { order_id, description, partner } = route?.params;

  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pictureUri, setPictureUri] = useState<string>("");

  const [statusMember, setStatusMember] = useState("");
  const { user } = useAuth();
  const { getStore } = usePartner();
  const [store, setStore] = useState<IStoreDetails>()
  const [loading, setLoading] = useState<boolean>(true)
  const {
    createChatComm,
    getConversations,
    updateChat,
    updateMessage,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
  } = useCommunication();

  const { signalRChatConnection, targetStatus, setTargetStatus } =
    useChatContext();
  const membersSelectedChat = selectedChat?.membersProfile?.filter(
    (member) => member.user_id !== user.user_id
  );

  // Mudar status do parceiro
  useEffect(() => {
    if (!!selectedChat && !!selectedChat?.members) {
      const selectedMember = selectedChat?.members?.filter(
        (member) => member !== user?.user_id
      );
      if (selectedMember.length === 1) {
        setStatusMember(targetStatus?.filter((stat) => stat.User_id === selectedMember[0])[0]?.Status);
      }
    }
  }, [selectedChat, targetStatus]);

  const getAllConversations = useCallback(async () => {
    try {
      const response = await getConversations(user.user_id);
      setChats(response);

      const newSelectedChat = response.filter(
        (chat: IChat) => chat.order_id === order_id
      );
      setLoading(true)
      if (newSelectedChat.length) {
        // // console.log(
        //   "chat encontrado e selecionado",
        //   JSON.stringify(newSelectedChat[0])
        // );
        newSelectedChat[0]?.messages?.map((message) => {
          showChatMessage(message);
        });
        setLoading(false)
        setSelectedChat(newSelectedChat[0]);
      }
      //  else {
      //   const chatCreated = await createChatComm(
      //     user?.user_id,
      //     partner?.user_id,
      //     description,
      //     order_id
      //   );
      //   // // console.log("novo chat criado", chatCreated);
      //   setSelectedChat(chatCreated);
      // }
    } catch (error) {
      // console.error(error);
    }
  }, []);

  const storeDetails = async () => {
    const products = await getStore(partner.branch_id);
    setStore(products)
  }

  useEffect(() => {
    getAllConversations();
    if (partner) storeDetails();
  }, []);

  const showChatMessage = (message: IChatMessage) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [
        {
          _id: message?.message_id,
          text: message?.content,
          image: "",
          video: undefined,
          createdAt: formatDistanceToNowStrictDate(new Date(message?.created_at)),
          user: {
            _id: message?.sender_id,
            name: route.params.fantasy_name,
            avatar: partner?.avatar,
          },
        },
      ])
    );
  };
  // Conectar no chat e marcar mensagens lidas
  useEffect(() => {
    if (
      signalRChatConnection &&
      chats?.length &&
      signalRChatConnection.state === "Connected" &&
      selectedChat
    ) {
      chats?.forEach((chat) => {
        if (!chat.closed && !chat.closed_by) {
          signalRChatConnection.invoke("JoinChat", chat?.chat_id);
        }
      });
      if (
        selectedChat &&
        selectedChat?.unReadCountMessages &&
        selectedChat?.unReadCountMessages > 0
      ) {
        selectedChat.messages
          .filter(
            (message) =>
              !message?.read_at && message?.sender_id !== user.user_id
          )
          .forEach((message) => {
            message.read_at = new Date();
            message.chat_id = selectedChat?.chat_id;

            updateMessage(message);
          });
        // getAllConversations();
      }
    }
  }, [selectedChat]);

  const handleSendMessage = async (message: IMessage[]) => {
    try {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          {
            ...message[0],
            createdAt: (new Date(message[0]?.createdAt)).toISOString(),
          },
        ])
      );
      const token = await AsyncStorage.getItem("@PAM:token");

      signalRChatConnection?.invoke(
        "SendMessageToEspecificChat",
        selectedChat?.chat_id,
        user?.user_id,
        JSON.stringify({
          content: message[0].text,
          chat_id: selectedChat?.chat_id,
          read_at: null,
          created_at: new Date(),
          sender_id: user?.user_id,
          message_id: uuidv4(),
          messageTypeTag: "TEXT",
        }),
        `Bearer ${token}`
      );
    } catch (error) {
      // console.error("Erro ao enviar Msg", error);
    }
  };

  useEffect(() => {
    // console.info(`[WS - ON]:Chat`);
  }, [signalRChatConnection]);

  useEffect(() => {
    if (signalRChatConnection && signalRChatConnection.state === "Connected") {

      signalRChatConnection.on("RefreshStatus", (statuses) => {
        // console.info(`[WS - ON]:User Refresh Status`);
        JSON.parse(statuses).forEach((status) => {
          if (status.User_id !== user.user_id) {
            setTargetStatus(JSON.parse(statuses));
          }
        });
      });

      signalRChatConnection.on("ReceiveMessage", (user_id, newMessage) => {
        if (user_id !== user?.user_id) {
          // // console.info(`[WS - ON]: MSG Received.`);
          // // console.log("Array de msgs", messages);
          const receivedMessage = JSON.parse(newMessage);
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [
              {
                _id: receivedMessage?.message_id,
                text: receivedMessage?.content,
                image: "",
                video: undefined,
                createdAt: new Date(receivedMessage?.created_at).toISOString(),
                user: {
                  _id: receivedMessage?.sender_id,
                  name: route.params.fantasy_name,
                  avatar: partner?.avatar,
                },
              },
            ])
          );

          // showChatMessage(receivedMessage);
        }
      });

      signalRChatConnection.on('RefreshChatList', async (chat) => {
        // console.info('[WS - ON]: Status Received.');
        // console.log('JSON LISTA', JSON.parse(chat));
        setChats((old) => ([...old, JSON.parse(chat)]));
      });
    }
  }, [signalRChatConnection]);

  const onSend = useCallback(
    (messages = []) => {
      handleSendMessage(messages);
    },
    [selectedChat]
  );

  const renderSend = (props) => {
    if (pictureUri) {
      props.onSend({ image: pictureUri });
      setPictureUri("");
    }

    return (
      <>
        {/* <TouchableOpacity
          style={styles.sendButtons}
          onPress={() => {
            uploadImage();
          }}
        >
          <Feather name="camera" size={23} color={theme.colors.primary} />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.sendButton}
          disabled={!props.text && !pictureUri}
          onPress={() => {
            if (props.text) props.onSend({ text: props.text.trim() }, true);
            if (pictureUri) {
              props.onSend({ image: pictureUri });
              setPictureUri("");
            }
          }}
        >
          <Icon name={"send"} size={20} color={theme.colors.white} />
        </TouchableOpacity>
      </>
    );
  };

  const customtInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.input}
        renderSend={() => renderSend(props)}
      />
    );
  };

  const chatHeaderComponent = (
    <ChatHeader
      setModalVisible={setShowModal}
      modalVisible={showModal}
      route={store}
      onPress={() => navigate("StoreDetails", { branch_id: partner.branch_id })}
      activeChatId={statusMember || "offline"}
    />
  );

  if (loading) return <Loading />;
  return (
    <View style={styles.mainContainer}>
      <BlueHeader title={description || "Chat"} centerComponent={chatHeaderComponent} />
      <View style={[globalStyles.container, { paddingTop: 20 }]}>
        {showModal && (
          <TouchableOpacity
            style={{ alignSelf: "flex-end", flexDirection: "row" }}
            onPress={() => { }}
          >
            <Text style={styles.text}>Encerrar sessão</Text>
            <Feather name="x" size={20} color={theme.colors.danger} />
          </TouchableOpacity>
        )}
        <GiftedChat
          messages={messages}
          placeholder="Mensagem"
          dateFormat="DD/MM/YYYY"
          onSend={(messages) => onSend(messages)}
          user={{
            _id: user?.user_id,
            avatar: user?.profile?.avatar,
          }}
          messagesContainerStyle={{
            bottom: 20,
          }}
          renderAvatar={() => null}
          showAvatarForEveryMessage={true}
          renderBubble={(props) => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    color: "white",
                    fontFamily: theme.fonts.light,
                  },
                  left: {
                    color: theme.colors.black,
                    fontFamily: theme.fonts.light,
                  },
                }}
                wrapperStyle={{
                  left: {
                    backgroundColor: theme.colors.lightgray,
                  },
                  right: {
                    backgroundColor: theme.colors.primary,
                  },
                }}
              />
            );
          }}
          renderInputToolbar={(props) => customtInputToolbar(props)}
        />
      </View>
    </View>
  );
};

export default Chat;
