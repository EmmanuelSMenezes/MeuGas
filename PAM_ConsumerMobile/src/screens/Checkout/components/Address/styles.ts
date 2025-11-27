import { StyleSheet } from "react-native";
import { theme } from "../../../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: theme.colors.black,
    fontSize: 20,
    fontFamily: theme.fonts.medium,
    marginBottom: 4,
  },

  subtitle: {
    color: theme.colors.black,
    fontSize: 18,
    fontFamily: theme.fonts.medium,
    lineHeight: 20,
  },

  description: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    marginBottom: 12,
  },

  addressTitle: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.gray,
    lineHeight: 20,
  },

  addressDescription: {
    fontFamily: theme.fonts.light,
    color: theme.colors.text,
    lineHeight: 20,
  },

  addressesContainer: {
    gap: 12,
    marginBottom: 32,
  },

  addressCard: {
    backgroundColor: theme.colors.lightgray,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    gap: 8,
  },

  addressContent: {
    flex: 1,
  },

  addressCardSelected: {
    backgroundColor: theme.colors.shadowPrimary,
  },

  partnerAddressCard: {
    backgroundColor: theme.colors.lightgray,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    gap: 8,
  },

  newAddressButton: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.lightgray,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    gap: 8,
  },

  newAddressButtonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    verticalAlign: "middle",
    lineHeight: 20,
  },

  errorText: {
    textAlign: "center",
    marginTop: 16,
  },

  shippingWayText: {
    fontFamily: theme.fonts.regular,
    lineHeight: 20,
    color: theme.colors.primary,
    fontSize: 15,
    paddingVertical: 4,
  },

  shippingWayTitle: {
    marginTop: 32,
  },
});
