import React, { useEffect } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import EmptyImage from "../EmptyImage";
import styles from "./styles";
import { formatPrice } from "../../utils/formatPrice";
import { IStoreProduct } from "../../interfaces/Store";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useThemeContext } from "../../hooks/themeContext";

interface CardProps extends TouchableOpacityProps {
  item: IStoreProduct;
  branchName?: string;
  favorited?: boolean;
  onAddToCart?: () => void;
}

const Card = ({ item, branchName, favorited = false, onAddToCart, ...props }: CardProps) => {
  const categories = item?.categories
    ? item?.categories.map(({ description }) => description).join(", ")
    : "Produto";

  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();

  return (
    <TouchableOpacity {...props} activeOpacity={0.8}>
      <View style={themeController(styles.imageContainer)}>
        {/* Botão de favorito */}
        {/* <TouchableOpacity style={themeController(styles.favoriteButton)}>
          <Ionicons
            name={favorited ? "heart" : "heart-outline"}
            size={20}
            color={favorited ? theme.colors.danger : theme.colors.textLight}
          />
        </TouchableOpacity> */}

        {/* Badge de vendidos */}
        {item?.ordersnumbers > 0 && (
          <View style={themeController(styles.storeRating)}>
            <MaterialIcons name="local-fire-department" size={14} color={theme.colors.primary} />
            <Text style={[themeController(styles.storeRatingText)]}>
              {item?.ordersnumbers > 99 ? "+99" : item?.ordersnumbers}
            </Text>
          </View>
        )}

        {/* Imagem do produto */}
        {item?.url ? (
          <Image
            style={styles.cardImage}
            source={{ uri: item?.url }}
            resizeMode="cover"
          />
        ) : (
          <EmptyImage style={themeController(styles.cardImage)} small />
        )}
      </View>

      <View style={themeController(styles.content)}>
        <Text numberOfLines={2} style={themeController(styles.title)}>
          {item.name}
        </Text>

        {branchName ? (
          <Text numberOfLines={1} style={themeController(styles.itemType)}>
            {branchName}
          </Text>
        ) : (
          categories?.length > 0 && (
            <Text numberOfLines={1} style={themeController(styles.itemType)}>
              {categories}
            </Text>
          )
        )}

        <View style={themeController(styles.descriptionContainer)}>
          <Text style={[themeController(styles.price)]}>
            <Text style={[themeController(styles.priceSymbol)]}>R$ </Text>
            {formatPrice(item.price, "")}
          </Text>

          {/* Botão de adicionar ao carrinho */}
          {onAddToCart && (
            <TouchableOpacity
              style={themeController(styles.addButton)}
              onPress={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="add" size={18} color={theme.colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;
