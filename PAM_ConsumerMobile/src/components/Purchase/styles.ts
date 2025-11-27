import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  purchaseContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  purchaseItem: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    flex: 1,
  },

  purchaseInformations: {
    flex: 1,
    paddingRight: 8,
  },

  productImage: {
    width: 80,
    height: 80,
    aspectRatio: 1 / 1,
    borderRadius: 6,
  },

  productType: {
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },

  productName: {
    fontSize: 16,
    color: theme.colors.black,
    fontFamily: theme.fonts.regular,
  },

  productPrice: {
    marginTop: 6,
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
  },

  quantityText: {
    color: theme.colors.black,
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    marginHorizontal: 4,
    verticalAlign: "middle",
    lineHeight: 22,
  },

  actionsContainer: {
    alignItems: "center",
  },

  operationsContainer: {
    borderColor: theme.colors.shadow,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    width: 105,
    // paddingHorizontal: 8,
    // paddingVertical: 8,
    justifyContent: "space-between",
  },

  operationButton: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 24,
  },

  operationButtonDisabled: {
    opacity: 0.5,
  },

  withoutImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.shadowPrimary,
  },

  removeButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 14
  },

  removeButtonText: {
    color: theme.colors.danger,
    fontFamily: theme.fonts.medium,
    lineHeight: 17,
    fontSize: 12
  },
});
