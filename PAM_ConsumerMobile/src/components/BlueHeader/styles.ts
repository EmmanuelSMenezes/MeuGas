import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  blueHeader: {
    backgroundColor: "#2563EB",
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    marginLeft: 4,
  },

  spacer: {
    width: 80,
  },

  rightContainer: {
    position: "absolute",
    right: 0,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: theme.fonts.semiBold,
    textAlign: "center",
  },

  centerContainer: {
    position: "absolute",
    bottom: -40,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});

