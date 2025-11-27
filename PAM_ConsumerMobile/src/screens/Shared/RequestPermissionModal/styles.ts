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
});
