import React, { useEffect } from "react";
import { ScrollView, Text, View, StatusBar } from "react-native";
import { styles } from "./styles";
import Option from "./components/Option";
import { Avatar } from "../../components/Shared";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useGlobal } from "../../hooks/GlobalContext";
import { useUser } from "../../hooks/UserContext";
import { useThemeContext } from "../../hooks/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Profile: React.FC = () => {
  const { openAlert } = useGlobal();
  const { getAllAddresses, consumer } = useUser();
  const { logout, user } = useAuth();
  const { dynamicTheme, themeController } = useThemeContext();
  const { navigate, replace } = useNavigation<NativeStackNavigationProp<any>>();

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

  // Obter inicial do nome do usuário
  const getUserInitial = () => {
    const name = consumer?.name || user?.name || user?.profile?.fullname || '';
    return name.charAt(0).toUpperCase() || 'U';
  };

  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (!user?.user_id) {
      console.log("❌ Profile - Usuário não autenticado, redirecionando para login");
      replace("PhoneAuth");
      return;
    }
    console.log("✅ Profile - Usuário autenticado:", user.user_id);
  }, []);

  // Se não estiver autenticado, não renderiza nada
  if (!user?.user_id) {
    return null;
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* Header Azul */}
      <View style={styles.blueHeader}>
        {/* Avatar pequeno no canto */}
        <View style={styles.headerRow}>
          <View style={styles.smallAvatar}>
            <Text style={styles.smallAvatarText}>{getUserInitial()}</Text>
          </View>
        </View>

        {/* Título */}
        <Text style={styles.headerTitle}>Meu perfil</Text>

        {/* Foto do usuário */}
        <View style={styles.largeIconContainer}>
          <Avatar
            uri={user?.profile?.avatar}
            size={80}
            editable={false}
            indicatorColor="#2563EB"
          />
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsContainer}>
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
      </ScrollView>
    </View>
  );
};

export default Profile;
