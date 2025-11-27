import { NavigatorScreenParams } from "@react-navigation/native";
import { ItemDetails } from "./Item";
import { Store } from "./Store";
import { Partner, PartnerOrder } from "./Partner";
import { Product } from "./Catalog";
import { IPixResponse, Order } from "./Order";
import { IBranch, IProduct } from "./Offer";

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      SignIn: undefined;
      SignUp: undefined;
      OTPVerification: { phone: string };
      RecoverPassword: undefined;
      Home: undefined;
      Tabs: NavigatorScreenParams<TabParamList>;
      WhisList: undefined;
      Cart: undefined;
      Checkout: undefined;
      Search: undefined;
      SearchResults: { dataResearched: string };
      ItemDetails: { product_id: string };
      StoreDetails: { branch_id: string };
      Addresses: undefined;
      AddAddress?: { address_id: string };
      MyAccount: undefined;
      NewPassword: undefined;
      Support: undefined;
      About: undefined;
      Chat: { order_id: string; description: string; partner: PartnerOrder };
      Orders: undefined;
      OrderDetails: { id: string };
      Payments: undefined;
      AddPayment: { type: string; cardToEdit?: ICard };
      PixPayment: {
        pix: IPixResponse;
        order: Order;
      };
      RedoPayment: { order: Order };
    }
  }
}
