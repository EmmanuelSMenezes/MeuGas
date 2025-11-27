import { Platform, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderStyle: "dashed",
  },

  text: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    fontSize: 12,
    lineHeight: 18,
    width: '92%'
  },

  copiedTextIcon: {
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    padding: 2,
  },
});
