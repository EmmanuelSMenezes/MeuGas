import { theme } from "./../../styles/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  cartPartnerTitle: {
    color: theme.colors.primary,
    fontSize: 16,
    fontFamily: theme.fonts.semibold,
    lineHeight: 22,
  },

  storeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.xs,
    backgroundColor: theme.colors.backgroundCard,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  storeContent: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "center",
  },

  emptyCartText: {
    color: theme.colors.textLight,
    textAlign: "center",
    marginTop: theme.spacing.xl,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
  },

  purchaseTotalContainer: {
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.backgroundCard,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  purchaseFinishButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flex: 1,
    height: 54,
    paddingHorizontal: theme.spacing.lg,
    marginLeft: theme.spacing.xl,
    ...theme.shadows.md,
  },

  purchaseFinishButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.semibold,
  },

  cartPricesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },

  totalAmountLabel: {
    fontSize: 20,
    color: theme.colors.textDark,
    fontFamily: theme.fonts.bold,
  },

  totalAmountText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    fontSize: 20,
  },

  freightLabel: {
    fontSize: 15,
    color: theme.colors.textLight,
    fontFamily: theme.fonts.medium,
  },

  freightAmount: {
    fontSize: 15,
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
  },

  subtotalLabel: {
    fontSize: 15,
    color: theme.colors.textLight,
    fontFamily: theme.fonts.medium,
  },

  subtotalAmount: {
    fontSize: 15,
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
  },

  startPurchaseButton: {
    marginTop: theme.spacing.md,
  },

  footer: {
    flexDirection: "row",
    marginTop: theme.spacing.md,
    justifyContent: "space-between",
    alignItems: "center",
  },

  nextButton: {
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.lg,
    flexDirection: "row",
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.sm,
    borderRadius: theme.borderRadius.xxl,
    ...theme.shadows.md,
  },

  nextButtonDisabled: {
    backgroundColor: theme.colors.grayLight,
    opacity: 0.6,
  },

  nextButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.semibold,
    lineHeight: 21,
    fontSize: 16,
    verticalAlign: "middle",
  },

  selectShippignWayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },

  selectShippingWay: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 22,
  },

  freightFree: {
    color: theme.colors.success,
    fontFamily: theme.fonts.semibold,
  },
});
