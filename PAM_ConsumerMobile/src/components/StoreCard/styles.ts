import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../styles/theme";

const styles = StyleSheet.create({
  content: {
    flex: 0,
    // backgroundColor: theme.colors.white,
    borderBottomEndRadius: 12,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 16,
    width: "100%",
  },

  cardContainer: {
    padding: 8,
    marginRight: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: theme.colors.lightgray,
    backgroundColor: theme.colors.white,
  },

  storeRating: {
    position: "absolute",
    right: 6,
    top: 6,
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 40,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 99,
    elevation: 2,
  },

  storeRatingText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    lineHeight: 20,
  },

  imageContainer: {
    position: "relative",
  },

  cardImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
    borderRadius: 9,
  },

  title: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    lineHeight: 22,
  },

  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },

  storeDistance: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    lineHeight: 18,
  },
});

export default styles;
