import React, { useState } from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import { styles } from "../../styles";
import { theme } from "../../../../styles/theme";
import { Feather } from "@expo/vector-icons";

import { Ionicons } from "@expo/vector-icons";
import { PartnerOrder } from "../../../../interfaces/Partner";
import { IStoreDetails } from "../../../../interfaces/Store";
// import { Partner } from '../../../../interfaces/Partner';

interface IProps {
  route: IStoreDetails;
  setModalVisible: (modaVisible: boolean) => void;
  modalVisible?: boolean;
  activeChatId: string;
  onPress: () => void;
}

const ChatHeader = ({
  route,
  setModalVisible,
  modalVisible,
  activeChatId,
  onPress,
}: IProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileOptions}>
        <TouchableOpacity style={styles.profile} onPress={onPress}>
          {route?.avatar ? (
            <Image style={styles.image} source={{ uri: route?.avatar }} />
          ) : (
            <View
              style={[
                styles.emptyImageContainer,
                {
                  width: 50,
                  height: 50,
                },
              ]}
            >
              <Feather name="image" size={25} color={theme.colors.primary} />
            </View>
          )}

          <View style={styles.viewHeader}>
            <Text style={styles.username}>{route?.branch_name}</Text>
            {/* <Text style={styles.onlineStatus}>{activeChatId}</Text> */}
          </View>
        </TouchableOpacity>
        {/* <View style={styles.options}>
          <TouchableOpacity style={{ paddingEnd: 15 }} onPress={()=> setModalVisible(!modalVisible)}>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

export default ChatHeader;
