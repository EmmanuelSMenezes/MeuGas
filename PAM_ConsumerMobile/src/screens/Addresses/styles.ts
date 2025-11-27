import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  newAddressButton: {
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

  newAddressButtonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    verticalAlign: "middle",
    lineHeight: 20,
  },

  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  addressTitle: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.gray,
    lineHeight: 20,
    fontSize: 14,
  },

  addressDescription: {
    marginTop: 2,
    fontFamily: theme.fonts.light,
    color: theme.colors.text,
    lineHeight: 16,
    fontSize: 12,
    paddingRight: 16,
  },

  addressComplement: {
    marginTop: 4,
    fontFamily: theme.fonts.light,
    color: theme.colors.text,
    lineHeight: 16,
    fontSize: 10,
    paddingRight: 20,
  },

  addressesContainer: {
    position: "relative",
    gap: 16,
  },

  addressCard: {
    gap: 12,
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: theme.colors.lightgray,
  },

  addressCardSelected: {
    backgroundColor: theme.colors.shadowPrimary,
  },

  moreButton: {},

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

  checkOutlineContainer: {
    padding: 4,
    width: 20,
    height: 20,
    borderRadius: 80,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },

  checkFilledContainer: {
    backgroundColor: theme.colors.primary,
    borderRadius: 80,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
