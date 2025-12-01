import Constants from "expo-constants";
import { theme } from "./theme";
import { StyleSheet, Platform } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },

  title: {
    color: theme.colors.black,
    fontSize: 20,
    fontFamily: theme.fonts.medium,
    marginBottom: 12,
  },

  subtitle: {
    color: theme.colors.black,
    fontSize: 18,
    fontFamily: theme.fonts.medium,
    lineHeight: 24,
  },

  description: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    marginBottom: 12,
  },

  textHighlight: {
    fontFamily: theme.fonts.medium,
  },

  // Input Styles
  inputContent: {
    backgroundColor: theme.colors.backgroundCard,
    color: theme.colors.textDark,
    width: "100%",
    height: 54,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  inputLabel: {
    fontSize: 14,
    color: theme.colors.textDark,
    fontFamily: theme.fonts.semibold,
    marginBottom: theme.spacing.sm,
  },

  helperTextStyle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    width: "100%",
    marginTop: theme.spacing.xs,
  },

  helperTextErrorStyle: {
    color: theme.colors.danger,
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    width: "100%",
    marginBottom: 8,
  },

  requiredField: {
    color: theme.colors.danger,
  },

  // End of Input Styles

  // Tab styles
  tabHeaderStyle: {
    backgroundColor: theme.colors.background,
  },

  tabsItemStyle: {
    // padding: 20
  },

  tabsContainer: {
    height: 60,
  },

  teste: {
    flexDirection: "row",
  },

  // End of Tab Styles

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingBottom: 14,
    paddingTop: Constants.statusBarHeight + 12,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },

  headerSearchButton: {
    backgroundColor: theme.colors.lightgray,
    flex: 1,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerSearchButtonText: {
    color: theme.colors.gray,
    fontFamily: theme.fonts.light,
    verticalAlign: "middle",
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
  },

  addressesEmpty: {
    textAlign: "center",
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    marginTop: 8,
  },

  listEmpty: {
    textAlign: "center",
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    marginTop: 8,
  },

  cartCountContainer: {
    position: "absolute",
    top: -7,
    left: 15,
    right: 0,
    bottom: 0,
    zIndex: 99,
    backgroundColor: theme.colors.secondary,
    height: 17,
    width: 17,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  cartCount: {
    color: theme.colors.white,
    backgroundColor: theme.colors.secondary,
    fontFamily: theme.fonts.medium,
    verticalAlign: "middle",
    textAlign: "center",
    marginTop: 2,
    lineHeight: 14,
    fontSize: 10,
  },

  disabledButton: {
    opacity: 0.4,
  },
});
