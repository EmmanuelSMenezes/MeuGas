import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    position: 'relative',
    paddingBottom: 85
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  headerButtonShadow: {
    backgroundColor: theme.colors.white,
    padding: 6,
    borderRadius: 12
  },

  headerContainer: {
    position: 'absolute',
    top: Constants.statusBarHeight,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 16,
    zIndex: 99,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  containerOverImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center'
  },

  paginationContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 48,
  },

  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 64,
    backgroundColor: theme.colors.lightgray,
    elevation: 10
  },

  paginationDotActive: {
    backgroundColor: theme.colors.primary
  },

  itemType: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.text,
    lineHeight: 16
  },

  itemImage: {
    width: '100%',
    height: 350,
  },

  itemDetailsContainer: {
    marginTop: -24,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
    paddingVertical: 28,
    zIndex: 1,
    flex: 1
  },

  itemTitle: {
    color: theme.colors.black,
    fontSize: 18,
    fontFamily: theme.fonts.medium
  },

  itemSubtitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontFamily: theme.fonts.medium
  },

  itemPriceLabel: {
    color: theme.colors.text,
    fontSize: 14,
    fontFamily: theme.fonts.regular
  },

  itemPrice: {
    color: theme.colors.primary,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: theme.fonts.medium
  },

  descriptionContainer: {
    paddingVertical: 8,
    marginBottom: 4
  },

  itemDescription: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 14
  },

  purchaseButton: {
    marginTop: 24,
  },

  footerContainer: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    zIndex: 99,
    width: '100%'
  },

  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  addToCartButtonText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.white,
    lineHeight: 22,
    margin: 10
  },

  addToCartButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20
  },

  operationsContainer: {
    borderColor: theme.colors.shadow,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: 75,
    // paddingHorizontal: 8,
    // paddingVertical: 8,
    justifyContent: 'space-between'
  },

  operationButton: {
    borderRadius: 8,
    paddingHorizontal: 4,
    fontSize: 24,
    height: 50,
    justifyContent: 'center'
  },

  operationButtonDisabled: {
    opacity: 0.4
  },

  quantityText: {
    color: theme.colors.black,
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    marginHorizontal: 4,
    verticalAlign: 'middle',
    lineHeight: 22
  },

});
