import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./styles";
import { theme } from "../../styles/theme";
import Option from "./components/Option";
import { Avatar, Header } from "../../components/Shared";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { MaskedText } from "react-native-mask-text";
import { useGlobal } from "../../hooks/GlobalContext";
import { useUser } from "../../hooks/UserContext";
import { useThemeContext } from "../../hooks/themeContext";

const Profile: React.FC = () => {
  const { openAlert } = useGlobal();
  const { getAllAddresses } = useUser();
  const { logout, user, updateUser, photoProfile } = useAuth();
  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();
  const { navigate } = useNavigation();

  const handleUserLogout = () => {
    openAlert({
      title: "Deseja sair?",
      description: `Tem certeza que deseja sair da sua conta?`,
      type: "warning",
      buttons: {
        onConfirm: () => logout(),
      },
    });
  };

  return (
    <View style={globalStyles.container}>
      <Header />
      <View style={themeController(styles.profileHeader)}>
        <Avatar
          uri={user?.profile?.avatar}
          size={120}
          editable={false}
          indicatorColor={dynamicTheme.colors.primary}
        />
        <Text style={[themeController(styles.userName)]}>
          {user?.profile?.fullname}
        </Text>
        <MaskedText
          style={[themeController(styles.userPhone)]}
          mask="(99) 99999-9999"
          children={user.phone}
        />
      </View>

      <View style={themeController(styles.optionsContainer)}>
        <Option
          title="Meus dados"
          icon={
            <MaterialIcons
              name="account-circle"
              size={20}
              color={dynamicTheme.colors.primary}
            />
          }
          onPress={() => navigate("MyAccount")}
        />
        <Option
          title="Pedidos"
          icon={
            <MaterialIcons
              name="local-shipping"
              size={20}
              color={dynamicTheme.colors.primary}
            />
          }
          onPress={() => navigate("Orders")}
        />
        <Option
          title="Endereços"
          icon={
            <MaterialIcons
              name="home"
              size={20}
              color={dynamicTheme.colors.primary}
            />
          }
          onPress={() => {
            getAllAddresses();
            navigate("Addresses");
          }}
        />
        <Option
          title="Alterar senha"
          icon={
            <MaterialIcons
              name="lock"
              size={20}
              color={dynamicTheme.colors.primary}
            />
          }
          onPress={() => navigate("NewPassword")}
        />
        <Option
          title="Pagamentos"
          icon={
            <MaterialIcons
              name="credit-card"
              size={20}
              color={dynamicTheme.colors.primary}
            />
          }
          onPress={() => navigate("Payments")}
        />
        <Option
          title="Suporte"
          icon={
            <MaterialIcons
              name="contact-support"
              size={20}
              color={dynamicTheme.colors.primary}
            />
          }
          onPress={() => navigate("Support")}
        />

        <Option
          title="Sair"
          color={dynamicTheme.colors.danger}
          icon={
            <MaterialIcons
              name="logout"
              size={20}
              color={dynamicTheme.colors.danger}
            />
          }
          style={themeController(styles.logoutSpacing)}
          onPress={() => handleUserLogout()}
        />
      </View>
    </View>
  );
};

export default Profile;
