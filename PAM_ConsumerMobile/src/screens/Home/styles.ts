import { theme } from './../../styles/theme';
import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    paddingTop: 24,
  },

  subtitleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },

  subtitle: {
    color: theme.colors.black,
    fontSize: 18,
    fontFamily: theme.fonts.medium,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 12,
  },

  seeMoreButton: {
    color: theme.colors.primary,
    fontSize: 14,
    fontFamily: theme.fonts.regular,
  },

  itemsList: {
    marginBottom: 16,
    paddingLeft: 20,
  },

  itemsListContent: {
    paddingRight: 32
  },

  cardSize: {
    width: Dimensions.get('screen').width / 1.9,
    marginRight: 8
  },

  storeCardSize: {
    width: Dimensions.get("screen").width / 1.8,
    marginRight: 8
  },

  headerAddressContainer: {
    backgroundColor: theme.colors.darker,
    paddingVertical: 10,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerAddressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  headerAddressText: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    lineHeight: 17
  },

  categoryButton: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },

  categoryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  categoryButtonTextContainer: {
    gap: 2,
  },

  categoryButtonTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.medium,
    color: theme.colors.black,
  },

  categoryButtonSubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
  }

});
