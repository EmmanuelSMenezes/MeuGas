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
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 24,
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  title: {
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    textAlign: "center",
    fontSize: 16,
    marginTop: 18,
    marginBottom: 4,
  },

  description: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    textAlign: "center",
    marginBottom: 16,
  },

  pixLogo: {
    width: 1280 / 6,
    height: 455 / 6,
  },

  buttonContainer: {
    backgroundColor: theme.colors.white,
  },

  buttonText: {
    color: theme.colors.primary,
  },

  copyCodeContainer: {
    marginBottom: 32,
  },

  footer: {
    width: "100%",
    gap: 12,
  },
});
