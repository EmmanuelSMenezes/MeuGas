import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../styles/theme";

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.shadow,
    zIndex: 1,
  },

  content: {
    flex: 1,
    width: "100%",
    paddingTop: 36,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.white,
  },

  label: {
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    lineHeight: 18,
  },

  title: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
    fontSize: 20,
    lineHeight: 28,
  },

  subtitle: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: 14,
  },

  clearButtonText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },

  modalHeader: {
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
  },

  slider: {
    // flex: 1,
    width: "100%",
    // width: Dimensions.get("screen").width,
  },

  categoriesContainer: {
    marginTop: 4,
    marginBottom: 16,
    alignItems: "center",
    gap: 8,
    paddingStart: 20,
  },

  rating: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    marginEnd: 20,
  },

  sortButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },

  orderPriceButton: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  orderPriceButtonText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    lineHeight: 19,
  },

  orderPriceButtonSelected: {
    backgroundColor: theme.colors.primary,
  },

  orderPriceButtonTextSelected: {
    color: theme.colors.white,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  clearFieldFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.shadowPrimary,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
  },

  clearFieldFilterButtonText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    fontSize: 12,
    lineHeight: 16,
  },

  rowContainerLabel: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.gray,
    fontSize: 12,
    lineHeight: 16,
  },

  shippingFreeLabel: {
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    lineHeight: 18,
  },

  modalFooter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",

    paddingBottom: 32,
  },

  modalFooterContent: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  button: {
    height: 40,
    width: 140,
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
  },

  buttonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    lineHeight: 20,
  },

  buttonSecondary: {
    backgroundColor: "transparent",
  },

  buttonSecondaryText: {
    color: theme.colors.primary,
  },
});

export default styles;
