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
import { Octicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useThemeContext } from "../../hooks/themeContext";

interface CardProps extends TouchableOpacityProps {
  item: IStoreProduct;
  branchName?: string;
  favorited?: boolean;
}

const Card = ({ item, branchName, favorited = false, ...props }: CardProps) => {
  const categories = item?.categories
    ? item?.categories.map(({ description }) => description).join(", ")
    : "Produto";

  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();

  return (
    <TouchableOpacity {...props}>
      <View style={themeController(styles.imageContainer)}>
        {/* <TouchableOpacity style={themeController(styles.favoriteButton)}>
          <FontAwesome name={favorited ? "heart" : "heart-o"} size={16} color={theme.colors.primary} />
        </TouchableOpacity> */}
        {item?.ratings >= 0 ? (
          <View style={themeController(styles.storeRating)}>
            <Text style={[themeController(styles.storeRatingText)]}>
              {item?.ordersnumbers > 99 ? "+99" : item?.ordersnumbers} vendidos
            </Text>
          </View>
        ) : (
          <></>
        )}
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
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;
