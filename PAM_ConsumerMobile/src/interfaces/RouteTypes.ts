import { ParamListBase } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ICard } from "./User";
import { IPixResponse, Order } from "./Order";

export interface RootStackParamList extends ParamListBase {
  SignIn: undefined;
  SignUp: undefined;
  OTPVerification?: { phone: string };
  OTPVerificationForgotPassword: { phone: string };
  RecoverPassword: undefined;
  Tabs: undefined;
  Cart: undefined;
  Checkout: undefined;
  Home: undefined;
  WhisList: undefined;
  Search: undefined;
  SearchResults: {
    dataResearched?: string;
    categoryType?: string;
    partnerId?: string;
    brandName?: string;
  };
  CategorySelection: undefined;
  BrandSelection: { categoryType: string };
  ItemDetails: { product_id: string };
  StoreDetails: { branch_id: string };
  Addresses: undefined;
  AddAddress?: { address_id: string };
  MyAccount: undefined;
  Support: undefined;
  About: undefined;
  Chat: any;
  Orders: undefined;
  Payments: undefined;
  RedoPayment: { order: Order };
  AddPayment: { type: string; cardToEdit?: ICard };
  PixPayment: {
    pix: IPixResponse;
    order_id: string;
  };
}

export interface RootStackParams<
  NavigatorID extends keyof RootStackParamList = string
> extends NativeStackScreenProps<RootStackParamList, NavigatorID> {}
