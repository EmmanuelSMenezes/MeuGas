import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    position: "relative",
    gap: 16,
  },
  paymentCard: {
    backgroundColor: theme.colors.lightgray,
    padding: 20,
    borderRadius: 16,
    gap: 8,
  },
  paymentCardSelected: {},
  checkFilledContainer: {},
  checkOutlineContainer: {},
  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentTitle: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.black,
    fontSize: 18,
  },
  moreOptionsContainer: {
    width: 140,
    right: 0,
    top: 24,
    position: "absolute",
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    zIndex: 99,
    elevation: 2,
    overflow: "visible",
  },

  moreOptionsButton: {
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 16,
    zIndex: 99,
  },

  moreOptionsButtonText: {
    fontSize: 12,
    color: theme.colors.gray,
    fontFamily: theme.fonts.regular,
  },
  paymentCardHolder: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.gray,
    fontSize: 14,
    marginTop: 12,
  },
  paymentCardCVV: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    fontSize: 14,
    marginTop: 2,
  },
  paymentComplement: {},
  newPaymentButton: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.lightgray,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    gap: 8,
  },
  newPaymentButtonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    verticalAlign: "middle",
    lineHeight: 20,
  },
  logo: {
    height: 35,
    width: 57,
    position: 'absolute',
    top: 0,
    right: 20
  },
});
