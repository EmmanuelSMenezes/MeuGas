import { StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.shadow,
    zIndex: 1,
  },

  content: {
    width: '100%',
    backgroundColor: theme.colors.background,
    paddingTop: 36,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    elevation: 4,
  },

  buttonsContainer: {
    gap: 12,
    marginTop: 16
  },

  button: {
    height: 50,
    borderRadius: 24,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary
  },

  buttonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    lineHeight: 20,
  },

  buttonSecondary: {
    backgroundColor: 'transparent'
  },

  buttonSecondaryText: {
    color: theme.colors.primary
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
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
    fontSize: 14,
  },

  shippingCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.lightgray,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    gap: 10,
  },

  shippingCardSelected: {
    backgroundColor: theme.colors.shadowPrimary,
  },

  defaultShippingContainer: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 1
  },

  defaultShipping: {
    color: theme.colors.white,
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    verticalAlign: 'middle'
  },

  shippingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },

  shippingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },

  shippingTitle: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.gray,
    lineHeight: 20,
    fontSize: 14
  },

  shippingDescription: {
    marginTop: 2,
    fontFamily: theme.fonts.light,
    color: theme.colors.text,
    lineHeight: 20,
    width: 260
  },
});
