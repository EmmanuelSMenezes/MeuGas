import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../styles/theme";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: theme.colors.backgroundCard,
    borderBottomEndRadius: theme.borderRadius.xl,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    width: "100%",
  },

  imageContainer: {
    position: "relative",
    borderTopRightRadius: theme.borderRadius.xl,
    borderTopLeftRadius: theme.borderRadius.xl,
    overflow: "hidden",
  },

  cardImage: {
    aspectRatio: 1,
    borderTopRightRadius: theme.borderRadius.xl,
    borderTopLeftRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.lightgray,
  },

  title: {
    color: theme.colors.textDark,
    fontFamily: theme.fonts.semibold,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },

  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.xs,
  },

  itemType: {
    color: theme.colors.textLight,
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: theme.spacing.xs,
  },

  price: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    fontSize: 18,
  },

  priceSymbol: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
    fontSize: 13,
  },

  favoriteButton: {
    position: "absolute",
    right: theme.spacing.sm,
    top: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    zIndex: 99,
    ...theme.shadows.sm,
  },

  storeRating: {
    position: "absolute",
    left: theme.spacing.sm,
    bottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    zIndex: 99,
    ...theme.shadows.md,
  },

  storeRatingText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.textDark,
    fontSize: 11,
    lineHeight: 14,
  },

  addButton: {
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.md,
  },

});

export default styles;
