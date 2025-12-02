import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
    paddingBottom: 32,
  },

  title: {
    color: theme.colors.black,
    fontSize: 20,
    fontFamily: theme.fonts.medium,
    marginBottom: 16,
  },

  paymentTitle: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.gray,
    lineHeight: 20,
  },

  paymentsContainer: {
    // gap: 8,
    marginBottom: 24,
  },

  paymentCard: {
    backgroundColor: theme.colors.lightgray,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    gap: 8,
  },

  paymentsContent: {
    flex: 1,
  },

  paymentCardSelected: {
    backgroundColor: theme.colors.shadowPrimary,
  },

  inputSpacing: {
    marginTop: 8,
  },

  rowInputFields: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 8,
  },

  expirationDateInput: {
    width: "65%",
  },

  cvvInput: {
    width: "30%",
  },
  newPaymentButton: {
    marginTop: 8,
    marginBottom: 24,
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

  cardTitle: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.gray,
    lineHeight: 20,
  },

  cardDescription: {
    fontFamily: theme.fonts.light,
    color: theme.colors.text,
    lineHeight: 20,
  },

  cardsContainer: {
    gap: 12,
    marginBottom: 32,
  },

  cardContainer: {
    backgroundColor: theme.colors.lightgray,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    gap: 8,
  },

  cardContent: {
    flex: 1,
  },

  selectedCard: {
    backgroundColor: theme.colors.shadowPrimary,
  },

  logo: {
    height: 35,
    width: 57,
    position: "absolute",
    top: 0,
    right: 20,
  },

  submitButton: {
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

  submitButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.medium,
    lineHeight: 21,
    fontSize: 16,
    verticalAlign: "middle",
  },
});
