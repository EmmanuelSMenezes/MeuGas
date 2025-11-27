import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../styles/theme";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderBottomEndRadius: 16,
    borderBottomLeftRadius: 16,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: theme.colors.lightgray,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 16,
    width: "100%",
  },

  imageContainer: {
    position: "relative",
  },

  cardImage: {
    aspectRatio: 16 / 10,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },

  title: {
    color: theme.colors.black,
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 2
  },

  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  itemType: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
  },

  price: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    marginTop: 6,
  },

  priceSymbol: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
    fontSize: 14,
  },

  favoriteButton: {
    position: "absolute",
    right: 6,
    top: 6,
    backgroundColor: theme.colors.shadowPrimary,
    padding: 6,
    borderRadius: 100,
    zIndex: 99,
  },

  storeRating: {
    position: "absolute",
    right: 6,
    bottom: 6,
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 40,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 99,
    elevation: 2,
  },

  storeRatingText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    fontSize: 12,
    lineHeight: 16,
  },

});

export default styles;
