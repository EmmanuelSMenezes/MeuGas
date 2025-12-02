import { theme } from "./../../styles/theme";
import { Platform, StyleSheet } from "react-native";

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
    flex: 1,
  },
  profileOptions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#fff",
  },
  image: {
    height: 45,
    width: 45,
    borderRadius: 32.5,
  },
  viewHeader: {
    flexDirection: "column",
    justifyContent: "flex-start",
    flex: 1,
    paddingHorizontal: 10,
  },
  username: {
    color: theme.colors.black,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
  },
  onlineStatus: {
    color: theme.colors.primary,
    fontSize: 13,
  },
  options: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  input: {
    borderRadius: 30,
    backgroundColor: theme.colors.lightgray,
    fontFamily: theme.fonts.light,
    // marginLeft: 5,
    // marginRight: 5,
    paddingLeft: 5,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 0,
    flex: 1,
    marginBottom: 15,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  sendButtons: {
    borderRadius: 30,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  inputAndMicrophone: {
    flexDirection: "row",
    backgroundColor: theme.colors.lightgray,
    flex: 3,
    marginRight: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightIconButtonStyle: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 15,
    paddingLeft: 10,
  },
  header: {
    backgroundColor: theme.colors.lightgray,
    padding: 5,
    margin: 5,
  },
  text: {
    color: theme.colors.danger,
    fontFamily: theme.fonts.light,
    fontSize: 14,
    marginBottom: 8,
  },
  emptyImageContainer: {
    backgroundColor: theme.colors.shadowPrimary,
    width: 120,
    height: 120,
    borderRadius: 120,
    justifyContent: "center",
    alignItems: "center",
  },
});
