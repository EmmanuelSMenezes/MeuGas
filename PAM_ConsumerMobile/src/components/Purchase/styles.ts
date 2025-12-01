import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  purchaseContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  purchaseItem: {
    flexDirection: "row",
    gap: theme.spacing.md,
    alignItems: "center",
    flex: 1,
  },

  purchaseInformations: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },

  productImage: {
    width: 90,
    height: 90,
    aspectRatio: 1,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.lightgray,
  },

  productType: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontFamily: theme.fonts.regular,
    marginBottom: theme.spacing.xs,
  },

  productName: {
    fontSize: 15,
    color: theme.colors.textDark,
    fontFamily: theme.fonts.semibold,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },

  productPrice: {
    marginTop: theme.spacing.xs,
    fontSize: 16,
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
  },

  quantityText: {
    color: theme.colors.textDark,
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    marginHorizontal: theme.spacing.xs,
    verticalAlign: "middle",
    lineHeight: 22,
    minWidth: 28,
    textAlign: "center",
  },

  actionsContainer: {
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  operationsContainer: {
    borderColor: theme.colors.border,
    borderWidth: 1.5,
    borderRadius: theme.borderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    width: 100,
    height: 40,
    justifyContent: "space-between",
    backgroundColor: theme.colors.white,
  },

  operationButton: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    fontSize: 24,
    alignItems: "center",
    justifyContent: "center",
    width: 32,
  },

  operationButtonDisabled: {
    opacity: 0.3,
  },

  withoutImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primaryBackground,
  },

  removeButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.xs,
  },

  removeButtonText: {
    color: theme.colors.danger,
    fontFamily: theme.fonts.medium,
    lineHeight: 17,
    fontSize: 13,
  },
});
