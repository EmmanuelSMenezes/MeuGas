import { theme } from "./../../../../styles/theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 4,
  },

  title: {
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    lineHeight: 18,
  },

  label: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
  },

  seeMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  childrenContainer: {
    paddingBottom: 12,
  },
});

export default styles;
