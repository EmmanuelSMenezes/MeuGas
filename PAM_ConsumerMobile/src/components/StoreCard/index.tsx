import React from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import EmptyImage from "../EmptyImage";
import styles from "./styles";
import { Octicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { IBranch } from "../../interfaces/Offer";
import { formatDistance } from "../../utils/formatDistance";
import { useThemeContext } from "../../hooks/themeContext";

interface CardProps extends TouchableOpacityProps {
  item: IBranch;
}

const StoreCard = ({
  item: { branch_name, avatar, ratings, distance },
  ...props
}: CardProps) => {
  const { dynamicTheme, themeController } = useThemeContext();

  return (
    <TouchableOpacity
      {...props}
      style={[themeController(styles.cardContainer), props.style]}
    >
      <View style={themeController(styles.imageContainer)}>
        <View style={themeController(styles.storeRating)}>
          <Octicons
            name="star-fill"
            size={16}
            color={dynamicTheme.colors.gold}
          />
          <Text style={themeController(styles.storeRatingText)}>{ratings}</Text>
        </View>
        {avatar ? (
          <Image
            style={styles.cardImage}
            source={{ uri: avatar }}
            resizeMode="contain"
          />
        ) : (
          <EmptyImage style={themeController(styles.cardImage)} small />
        )}
      </View>
      <View style={themeController(styles.content)}>
        <Text numberOfLines={1} style={[themeController(styles.title)]}>
          {branch_name}
        </Text>
        <View style={themeController(styles.descriptionContainer)}>
          <Text style={[themeController(styles.storeDistance)]}>
            {formatDistance(distance)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoreCard;
