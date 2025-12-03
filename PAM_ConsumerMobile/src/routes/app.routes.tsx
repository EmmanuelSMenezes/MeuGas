import React, { Children, ReactElement, useCallback } from "react";
import Home from "../screens/Home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { TouchableOpacity, View, Text, Pressable } from "react-native";
import { theme } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Search from "../screens/Search";
import WishList from "../screens/WishList";
import { globalStyles } from "../styles/globalStyles";
import Cart from "../screens/Cart";
import ItemDetails from "../screens/ItemDetails";
import { RootStackParamList } from "../interfaces/RouteTypes";
import StoreDetails from "../screens/StoreDetails";
import Profile from "../screens/Profile";
import OTPVerification from "../screens/Shared/OTPVerification";
import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";
import PhoneAuth from "../screens/PhoneAuth";
import SearchResults from "../screens/SearchResults";
import Checkout from "../screens/Checkout";
import AddAddress from "../screens/Shared/AddAddress";
import Addresses from "../screens/Addresses";
import OTPVerificationForgotPassword from "../screens/Shared/OTPVerificationForgotPassword";
import NewPassword from "../screens/Shared/NewPassword";
import RecoverPassword from "../screens/RecoverPassword";
import MyAccount from "../screens/Profile/MyAccount";
import Support from "../screens/Profile/Support";
import About from "../screens/Profile/Support/About";
import Chat from "../screens/Chat";
import Cam from "../components/Cam";
import Orders from "../screens/Orders";
import { StatusBar } from "expo-status-bar";
import OrderDetails from "../screens/OrderDetails";
import { useCart } from "../hooks/CartContext";
import CustomTabBar from "../components/CustomTabBar";
import { useGlobal } from "../hooks/GlobalContext";
import PaymentCard from "../screens/Payment";
import AddPayment from "../screens/Shared/AddPayment";
import { useThemeContext } from "../hooks/themeContext";
import PixPayment from "../screens/PixPayment";
import RedoPayment from "../screens/RedoPayment";
import CategorySelection from "../screens/CategorySelection";
import CategoryHierarchy from "../screens/CategoryHierarchy";
import SubcategorySelection from "../screens/SubcategorySelection";
import BrandSelection from "../screens/BrandSelection";

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

interface PropsM {
  name: keyof typeof AntDesign.glyphMap;
  size?: number;
  color?: string;
  focused?: boolean;
  tintColor?: string;
}
interface Props {
  name: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color?: string;
  focused?: boolean;
  tintColor?: string;
}

const TabBarIcon = ({ name, size, color, focused }: Props): ReactElement => {
  return <MaterialIcons name={name} size={size ? size : 24} color={color} />;
};
const TabBarIconAnt = ({
  name,
  size,
  color,
  focused,
}: PropsM): ReactElement => {
  return <AntDesign name={name} size={size ? size : 24} color={color} />;
};

const TabNavigation = () => {
  const { navigate } = useNavigation();
  const { totalQuantity } = useCart();
  const { setCurrentAppTab } = useGlobal();
  const { dynamicTheme, themeController } = useThemeContext();

  const DynamicCustomTabBar = useCallback(
    (props: any) => (
      <CustomTabBar {...props} onSwitchTab={(tab) => setCurrentAppTab(tab)} />
    ),
    [dynamicTheme]
  );

  return (
    <Tab.Navigator
      screenOptions={{
        title: "",
        headerShown: false,
        tabBarActiveTintColor: dynamicTheme.colors.primary,
        tabBarInactiveTintColor: dynamicTheme.colors.gray,
        tabBarStyle: themeController(globalStyles.tabsContainer),
        tabBarItemStyle: themeController(globalStyles.tabsItemStyle),
        tabBarShowLabel: false,
        tabBarLabelPosition: "beside-icon",
      }}
      tabBar={(props) => <DynamicCustomTabBar {...props} />}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: "",
          lazy: true,
          headerShown: false,
          tabBarLabel: "Início",
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} name="home" size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              size={28}
              name={"shopping-cart"}
            />
          ),
          tabBarBadge: totalQuantity,
          tabBarLabel: "Carrinho",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              focused={focused}
              name="person"
              size={30}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Tabs"
    >
      <Stack.Screen name="CategorySelection" component={CategorySelection} />
      <Stack.Screen name="CategoryHierarchy" component={CategoryHierarchy} />
      <Stack.Screen name="SubcategorySelection" component={SubcategorySelection} />
      <Stack.Screen name="BrandSelection" component={BrandSelection} />
      <Stack.Screen name="Tabs" component={TabNavigation} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="SearchResults" component={SearchResults} />
      <Stack.Screen name="ItemDetails" component={ItemDetails} />
      <Stack.Screen name="StoreDetails" component={StoreDetails} />

      {/* Auth Screens - disponíveis quando necessário */}
      <Stack.Screen name="PhoneAuth" component={PhoneAuth} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="RecoverPassword" component={RecoverPassword} />
      <Stack.Screen name="OTPVerification" component={OTPVerification} />
      <Stack.Screen name="OTPVerificationForgotPassword" component={OTPVerificationForgotPassword} />
      <Stack.Screen name="NewPassword" component={NewPassword} />

      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="Addresses" component={Addresses} />
      <Stack.Screen name="AddAddress" component={AddAddress} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MyAccount" component={MyAccount} />
      <Stack.Screen name="Cam" component={Cam} />
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen name="Payments" component={PaymentCard} />
      <Stack.Screen name="AddPayment" component={AddPayment} />
      <Stack.Screen name="PixPayment" component={PixPayment} />
      <Stack.Screen name="RedoPayment" component={RedoPayment} />
    </Stack.Navigator>
  );
};

export default AppRoutes;
