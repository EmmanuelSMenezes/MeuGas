import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import Purchase from "../../components/Purchase";
import { useCart } from "../../hooks/CartContext";
import { styles } from "./styles";
import { Button, Header } from "../../components/Shared";
import { useNavigation } from "@react-navigation/native";
import { formatPrice } from "../../utils/formatPrice";
import { Feather, MaterialIcons, Entypo } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import SelectOrderShipping from "../Shared/SelectOrderShipping";
import { useOrder } from "../../hooks/OrderContext";
import { useUser } from "../../hooks/UserContext";
import { useThemeContext } from "../../hooks/themeContext";

const Cart: React.FC = () => {
  const { defaultAddress } = useUser();
  const {
    cart,
    totalAmount,
    changePurchaseQuantity,
    subtotalAmount,
    freight,
    setFreight,
    cartBranch,
  } = useCart();
  const { dynamicTheme, themeController } = useThemeContext();
  const { getOrderPayment, setSelected, selected } = useOrder();
  const { navigate } = useNavigation();

  const [showShippingWays, setShowShippingWays] = useState(false);

  const getShippingWays = async () => {
    await getOrderPayment(cartBranch?.branch_id);
  };

  useEffect(() => {
    if (cartBranch?.branch_id) {
      getShippingWays();
    }
    setSelected('')
  }, [cartBranch, defaultAddress]);

  return (
    <View style={themeController(globalStyles.container)}>
      <Header />
      <SelectOrderShipping
        isVisible={showShippingWays}
        setIsVisible={setShowShippingWays}
      />
      <Text style={themeController(globalStyles.title)}>Seu carrinho</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={cart}
        ListHeaderComponent={
          cartBranch?.branch_id && (
            <TouchableOpacity
              style={themeController(styles.storeContainer)}
              onPress={() => navigate("StoreDetails", cartBranch)}
            >
              <View style={themeController(styles.storeContent)}>
                <MaterialIcons
                  name="store"
                  size={24}
                  color={dynamicTheme.colors.primary}
                />
                <Text style={[themeController(styles.cartPartnerTitle)]}>
                  {cartBranch.branch_name}
                </Text>
              </View>

              <Feather
                name="chevron-right"
                size={18}
                color={dynamicTheme.colors.primary}
              />
            </TouchableOpacity>
          )
        }
        ListEmptyComponent={
          <Text style={themeController(styles.emptyCartText)}>
            Seu carrinho está vazio
          </Text>
        }
        renderItem={({ item }) => (
          <Purchase
            item={item}
            limit={100}
            onChangeQuantity={(quantity) =>
              changePurchaseQuantity(quantity, item.product.product_id)
            }
          />
        )}
      />

      <View style={themeController(styles.purchaseTotalContainer)}>
        <View style={themeController(styles.cartPricesContainer)}>
          <Text style={themeController(styles.subtotalLabel)}>Subtotal:</Text>
          <Text style={themeController(styles.subtotalAmount)}>
            {formatPrice(subtotalAmount)}
          </Text>
        </View>
        {cartBranch?.branch_id && (
          <TouchableOpacity
            onPress={() => setShowShippingWays(true)}
            style={themeController(styles.selectShippignWayContainer)}
          >
            {freight ? (
              <>
                <Text style={themeController(styles.freightLabel)}>Frete:</Text>
                <Text
                  style={[
                    themeController(styles.freightAmount),
                    freight?.value === 0 && themeController(styles.freightFree),
                  ]}
                >
                  {freight?.value === 0
                    ? "GRÁTIS"
                    : formatPrice(freight?.value)}
                </Text>
              </>
            ) : (
              <>
                <Text style={themeController(styles.selectShippingWay)}>
                  Selecionar forma de entrega
                </Text>
                <Entypo
                  name="chevron-small-right"
                  size={24}
                  color={dynamicTheme.colors.gray}
                />
              </>
            )}
          </TouchableOpacity>
        )}

        <View style={themeController(styles.footer)}>
          <Text style={[themeController(styles.totalAmountLabel)]}>
            Total:{" "}
            <Text style={[themeController(styles.totalAmountText)]}>
              {formatPrice(totalAmount)}
            </Text>
          </Text>

          <TouchableOpacity
            style={[
              themeController(styles.nextButton),
              cart.length === 0 && themeController(styles.nextButtonDisabled),
            ]}
            disabled={cart.length === 0}
            onPress={() => navigate("Checkout")}
          >
            <Text style={themeController(styles.nextButtonText)}>
              Continuar
            </Text>
            <Feather
              name="chevron-right"
              size={18}
              color={dynamicTheme.colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Cart;
