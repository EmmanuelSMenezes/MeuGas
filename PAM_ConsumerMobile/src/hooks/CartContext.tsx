import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Cart } from "../interfaces/Cart";
import { useGlobal } from "./GlobalContext";
import { navigate } from "../routes/rootNavigation";
import { IShipping, Purchase } from "../interfaces/Order";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IBranch, IProductBranch } from "../interfaces/Offer";
import { useOrder } from "./OrderContext";
import { usePartner } from "./PartnerContext";
import { IStoreDetails } from "../interfaces/Store";
import { useUser } from "./UserContext";

interface CartProviderProps {
  children: React.ReactNode;
}

interface CartProviderValues {
  cart: Cart[];
  setCart: React.Dispatch<React.SetStateAction<Cart[]>>;
  clearCart: () => Promise<void>;
  loadSavedCart: () => Promise<void>;
  addItem: (item: Purchase) => void;
  removeItem: (product_id: string) => void;
  changePurchaseQuantity: (newQuantity: number, product_id: string) => void;
  totalAmount: number;
  totalQuantity: number;
  subtotalAmount: number;
  freight: IShipping | undefined;
  setFreight: React.Dispatch<React.SetStateAction<IShipping>>;
  cartBranch: IStoreDetails | undefined;
  setCartBranch: React.Dispatch<React.SetStateAction<IStoreDetails>>;
}

const CartContext = createContext<CartProviderValues>({} as CartProviderValues);

const CartProvider = ({ children }: CartProviderProps) => {
  const { openAlert, closeAlert } = useGlobal();
  const { defaultAddress } = useUser();
  const { setBranchOrderSettings } = useOrder();
  const { getStore } = usePartner();

  const [cart, setCart] = useState<Cart[]>([]);
  const [cartBranch, setCartBranch] = useState<IStoreDetails | undefined>(
    {} as IStoreDetails
  );
  const [freight, setFreight] = useState<IShipping | undefined>();

  const subtotalAmount = cart.reduce((accumulator, currentValue) => {
    const product_value = Number(currentValue.product.price);
    const product_quantity = Number(currentValue.quantity);

    return accumulator + product_value * product_quantity;
  }, 0);

  const totalAmount = cart.reduce((accumulator, currentValue) => {
    const product_price = Number(currentValue.product.price);
    const product_quantity = Number(currentValue.quantity);

    return accumulator + product_price * product_quantity;
  }, freight?.value || 0);

  const totalQuantity = cart.reduce((accumulator, currentValue) => {
    const product_quantity = Number(currentValue.quantity);

    return accumulator + product_quantity;
  }, 0);

  const addItem = async (item: Purchase) => {
    if (cartBranch?.branch_id !== item?.branch_id) {
      const store = await getStore(item.branch_id);
      setCartBranch(store);
    }

    const newCart = cartBranch?.branch_id !== item.branch_id ? [] : [...cart];

    const alreadyInCart = newCart.findIndex(
      ({ product }) => product?.product_id === item?.product?.product_id
    );

    if (newCart[0] && newCart[0]?.product?.type !== item?.product?.type) {
      openAlert({
        title: "Não foi possível adicionar",
        description:
          "Você só pode montar um carrinho com serviços ou com produtos, não os dois.",
        type: "error",
        buttons: {
          cancelButton: false,
          confirmButtonTitle: "Ok",
        },
      });

      return;
    }

    if (alreadyInCart >= 0 && item.product.type === "s") {
      openAlert({
        title: "Não foi possível adicionar",
        description:
          "Você já adicionou esse serviço ao seu carrinho. Só é possível adquirir 1 serviço por pedido",
        type: "error",
        buttons: {
          cancelButton: false,
          confirmButtonTitle: "Ok",
        },
      });

      return;
    }

    if (alreadyInCart >= 0) {
      const currentItem = cart[alreadyInCart];
      currentItem.quantity += item.quantity;
      newCart[alreadyInCart] = currentItem;
    } else {
      newCart.push(item);
    }

    openAlert({
      title: "Adicionado ao carrinho",
      description: "Deseja continuar comprando ou ver seu carrinho?",
      type: "success",
      buttons: {
        cancelButton: false,
        confirmButton: false,
        orientation: "vertical",
        extraButtons: [
          {
            title: "Ver carrinho",
            onPress: () => {
              navigate("Tabs", { screen: "Cart" });
              closeAlert();
            },
          },
          {
            title: "Continuar comprando",
            onPress: () => {
              closeAlert();
            },
          },
        ],
      },
    });

    await AsyncStorage.setItem("@PAM:cart", JSON.stringify(newCart));

    setCart(newCart);
  };

  const removeItem = async (product_id: string) => {
    const newCart = [...cart];
    const currentItem = cart.findIndex(
      ({ product }) => product.product_id === product_id
    );

    newCart.splice(currentItem, 1);
    setCart(newCart);

    if (newCart.length === 0) {
      setCartBranch({} as IStoreDetails);
      setFreight(undefined);
      setBranchOrderSettings(undefined);

      await AsyncStorage.removeItem("@PAM:cart");
    } else {
      await AsyncStorage.setItem("@PAM:cart", JSON.stringify(newCart));
    }

    openAlert({
      title: "Sucesso",
      description: "Item removido com sucesso",
      type: "success",
      buttons: {
        cancelButton: false,
        confirmButtonTitle: "Ok",
      },
    });
  };

  const changePurchaseQuantity = async (
    newQuantity: number,
    product_id: string
  ) => {
    const newCart = [...cart];
    const currentItem = cart.findIndex(
      ({ product }) => product.product_id === product_id
    );

    if (newQuantity === 0) {
      openAlert({
        title: "Tem certeza?",
        description: "Deseja remover este item do seu carrinho?",
        type: "warning",
        buttons: {
          onConfirm: () => {
            removeItem(product_id);
          },
        },
      });
    } else {
      newCart[currentItem] = {
        ...newCart[currentItem],
        quantity: newQuantity,
      };

      setCart(newCart);
    }

    await AsyncStorage.setItem("@PAM:cart", JSON.stringify(newCart));
  };

  const clearCart = async () => {
    setCart([]);
    setCartBranch({} as IStoreDetails);
    setFreight(undefined);
    setBranchOrderSettings(undefined);

    await AsyncStorage.removeItem("@PAM:cart");
  };

  const loadSavedCart = async () => {
    const storagedCart = await AsyncStorage.getItem("@PAM:cart");
    const cartData = storagedCart ? (JSON.parse(storagedCart) as Cart[]) : null;

    if (!!cartData && cartData.length > 0) {
      const store = await getStore(cartData[0].branch_id);

      setCartBranch(store);
      setCart(cartData);
    } else {
      clearCart();
    }
  };

  useEffect(() => {
    loadSavedCart();
  }, []);

  const contextValues = {
    cart,
    setCart,
    addItem,
    removeItem,
    clearCart,
    changePurchaseQuantity,
    totalAmount,
    totalQuantity,
    subtotalAmount,
    freight,
    setFreight,
    cartBranch,
    loadSavedCart,
    setCartBranch,
  };

  return (
    <CartContext.Provider value={contextValues}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);

  return context;
};

export { useCart, CartProvider };
