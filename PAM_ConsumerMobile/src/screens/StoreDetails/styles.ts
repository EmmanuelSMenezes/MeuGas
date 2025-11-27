import Constants from "expo-constants";
import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    position: "relative",
  },

  headerButtonShadow: {
    backgroundColor: theme.colors.shadow,
    padding: 6,
    borderRadius: 50,
  },

  headerContainer: {
    position: "absolute",
    top: Constants.statusBarHeight,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 16,
    zIndex: 99,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  imageShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    opacity: 0.3,
  },

  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 120,
  },

  storeProfileContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: 'center',
    gap: 24,
  },

  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },

  storeData: {
    // gap: 8,
  },

  storeTitle: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.black,
    fontSize: 18,
    lineHeight: 25,
  },

  storeCategory: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    lineHeight: 20
  },

  storeChatButton: {
    backgroundColor: theme.colors.shadowPrimary,
    borderRadius: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingVertical: 6,
    paddingRight: 4,
    width: 85,
    justifyContent: "center",
    marginTop: 12,
  },

  storeChatButtonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    lineHeight: 18,
    fontSize: 12,
  },

  cardSize: {
    width: Dimensions.get("screen").width / 2.3
  },

  listContainer: {
    marginTop: 24,
    rowGap: 12,
    paddingBottom: 32,
  },

  listColumnsContainer: {
    justifyContent: "space-between",
  },

  emptyImageContainer: {
    backgroundColor: theme.colors.shadowPrimary,
    width: 120,
    height: 120,
    borderRadius: 120,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingContainer: {
    paddingTop: 16,
    paddingBottom: 36,
    justifyContent: "center",
    width: "100%",
  },

  floatButton: {
    position: "absolute",
    zIndex: 99,
    bottom: 36,
    right: 36,
    backgroundColor: theme.colors.primary,
    borderRadius: 64,
    padding: 8,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  storeRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  storeRatingText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    fontSize: 12,
    lineHeight: 17,
  },
});
