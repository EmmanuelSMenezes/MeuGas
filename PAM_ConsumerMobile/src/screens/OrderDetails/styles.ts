import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  noteInput: {
    minHeight: 120,
    height: "auto",
    textAlign: "left",
    alignItems: "flex-start",
    verticalAlign: "top",
    paddingVertical: 12,
  },

  evaluatePartnerContainer: {
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: theme.colors.lightgray,
    borderRadius: 12,
    paddingVertical: 16,
  },

  evaluatePartnerTitle: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    fontSize: 16,
    textAlign: "center",
  },

  starsContainer: {
    marginBottom: 12,
  },

  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },

  redoPaymentButton: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    gap: 6,
  },

  cancelOrderButton: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.danger,
    borderRadius: 12,
    paddingHorizontal: 24,
    gap: 8,
  },

  cancelOrderButtonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    fontSize: 12,
    lineHeight: 18,
  },

  orderChatButton: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    gap: 8,
  },

  orderChatButtonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    fontSize: 12,
    lineHeight: 18,
  },

  rateButton: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    marginTop: 8,
  },

  rateButtonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    fontSize: 12,
    lineHeight: 18,
  },

  orderResumeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 12,
  },

  orderResume: {
    justifyContent: "center",
    alignItems: "center",
    width: "34%",
  },

  orderResumeLabel: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    lineHeight: 16,
    fontSize: 12,
  },

  orderResumeValue: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
  },

  orderNumberText: {
    fontSize: 16,
  },

  statusColorFinishedOrAccepted: {
    color: theme.colors.success,
  },

  statusColorPending: {
    color: theme.colors.warning,
  },

  statusColorCanceled: {
    color: theme.colors.danger,
  },
});
