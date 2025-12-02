import { theme } from "./../../styles/theme";
import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  searchInputContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    gap: 8,
  },

  cardSize: {
    width: Dimensions.get("screen").width / 2.3,
  },

  storeCardSize: {
    width: Dimensions.get("screen").width / 2.4,
  },

  listContainer: {
    paddingBottom: 32,
  },

  listColumnStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: 12,
    marginBottom: 16,
  },

  filterButton: {
    // backgroundColor: theme.colors.danger
    padding: 8,
  },

  loadingContainer: {
    paddingTop: 16,
    paddingBottom: 36,
    justifyContent: "center",
    width: "100%",
  },

  resultsFound: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    marginBottom: 8,
  },

  footer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  showMoreStoresButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.shadowPrimary,
    width: 110,
    height: 32,
    borderRadius: 16,
    marginBottom: 12,
    gap: 2,
  },

  showMoreStoresButtonText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
    fontSize: 12,
    lineHeight: 18,
    marginHorizontal: 2,
  },

  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 12,
  },

  showFiltersButton: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
    maxWidth: 150
  },

  showFiltersButtonText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.regular,
    lineHeight: 26
  }
});
