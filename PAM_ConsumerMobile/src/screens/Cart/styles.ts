import { theme } from "./../../styles/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cartPartnerTitle: {
    color: theme.colors.primary,
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    lineHeight: 22,
  },

  storeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 4,
  },

  storeContent: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  emptyCartText: {
    color: theme.colors.gray,
    textAlign: "center",
    marginTop: 16,
  },

  purchaseTotalContainer: {
    paddingVertical: 16,
  },

  purchaseFinishButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    height: 50,
    paddingHorizontal: 24,
    marginLeft: 32,
  },

  purchaseFinishButtonText: {
    color: theme.colors.white,
    fontSize: 16,
  },

  cartPricesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  totalAmountLabel: {
    fontSize: 18,
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
  },

  totalAmountText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.regular,
  },

  freightLabel: {
    fontSize: 16,
    color: theme.colors.gray,
    fontFamily: theme.fonts.medium,
  },

  freightAmount: {
    fontSize: 16,
    color: theme.colors.gray,
    fontFamily: theme.fonts.regular,
  },

  subtotalLabel: {
    fontSize: 16,
    color: theme.colors.gray,
    fontFamily: theme.fonts.medium,
  },

  subtotalAmount: {
    fontSize: 16,
    color: theme.colors.gray,
    fontFamily: theme.fonts.regular,
  },

  startPurchaseButton: {
    marginTop: 12,
  },

  footer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },

  nextButton: {
    paddingLeft: 32,
    paddingRight: 18,
    flexDirection: "row",
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 24,
  },

  nextButtonDisabled: {
    backgroundColor: theme.colors.shadowPrimary,
  },

  nextButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.medium,
    lineHeight: 21,
    fontSize: 16,
    verticalAlign: "middle",
  },

  selectShippignWayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingVertical: 8,
  },

  selectShippingWay: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.gray,
    fontSize: 16,
    lineHeight: 22,
  },

  freightFree: {
    color: theme.colors.success,
    fontFamily: theme.fonts.medium,
  },
});
