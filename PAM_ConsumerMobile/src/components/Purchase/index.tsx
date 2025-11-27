import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { AntDesign, MaterialIcons, Feather } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { Purchase as PurchaseItem } from "../../interfaces/Order";
import { formatPrice } from "../../utils/formatPrice";
import { useThemeContext } from "../../hooks/themeContext";

interface PurchaseProps {
  item: PurchaseItem;
  limit: number;
  onChangeQuantity: (quantity: number) => void;
}

const Purchase = (props: PurchaseProps) => {
  const { onChangeQuantity } = props;
  const { quantity, product } = props.item;
  const { product_id, name, price, images, image_default, type } =
    props.item.product;

  const { dynamicTheme, themeController } = useThemeContext();

  const { navigate } = useNavigation();

  const defaultImage = images?.find(
    ({ product_image_id }) => image_default === product_image_id
  );
  const product_type = {
    s: "Serviço",
    p: "Produto",
  };

  const handleChangeQuantity = (operation: number) =>
    onChangeQuantity(quantity + operation);

  const showItemProfile = () => navigate("ItemDetails", product);

  return (
    <View style={themeController(styles.purchaseContainer)}>
      <View style={themeController(styles.purchaseItem)}>
        {defaultImage?.url ? (
          <TouchableOpacity onPress={() => showItemProfile()}>
            <Image
              style={styles.productImage}
              source={{ uri: defaultImage.url }}
            />
          </TouchableOpacity>
        ) : (
          <View
            style={[
              themeController(styles.productImage),
              themeController(styles.withoutImage),
            ]}
          >
            <Feather
              name="image"
              size={32}
              color={dynamicTheme.colors.primary}
            />
          </View>
        )}
        <View style={themeController(styles.purchaseInformations)}>
          <Text numberOfLines={1} style={themeController(styles.productName)}>
            {name}
          </Text>
          <Text style={themeController(styles.productType)}>
            {product_type[type]}
          </Text>
          <Text style={themeController(styles.productPrice)}>
            {formatPrice(price * quantity)}
          </Text>
        </View>
      </View>

      <View style={themeController(styles.actionsContainer)}>
        <View style={themeController(styles.operationsContainer)}>
          <TouchableOpacity
            style={themeController(styles.operationButton)}
            onPress={() => handleChangeQuantity(-1)}
          >
            <AntDesign
              name="minus"
              size={18}
              color={dynamicTheme.colors.primary}
            />
          </TouchableOpacity>
          <Text style={themeController(styles.quantityText)}>{quantity}</Text>
          <TouchableOpacity
            style={themeController(styles.operationButton)}
            disabled={type === "s"}
            onPress={() => handleChangeQuantity(1)}
          >
            <MaterialIcons
              name="add"
              size={20}
              color={
                type === "s"
                  ? dynamicTheme.colors.shadow
                  : dynamicTheme.colors.primary
              }
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => handleChangeQuantity(-quantity)}
          style={themeController(styles.removeButton)}
        >
          <Feather name="trash" size={16} color={dynamicTheme.colors.danger} />
          <Text style={themeController(styles.removeButtonText)}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Purchase;
