import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  contentContainer: {
    flex: 1,
  },

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
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },

  headerContainer: {
    position: 'absolute',
    top: Constants.statusBarHeight,
    left: 0,
    right: 0,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    zIndex: 99,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  containerOverImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center'
  },

  paginationContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xxl,
  },

  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.white,
    opacity: 0.6,
    ...theme.shadows.sm,
  },

  paginationDotActive: {
    backgroundColor: theme.colors.primary,
    opacity: 1,
  },

  itemType: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.textLight,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  itemImage: {
    width: '100%',
    height: 350,
    backgroundColor: theme.colors.lightgray,
  },

  itemDetailsContainer: {
    marginTop: -theme.spacing.lg,
    borderTopStartRadius: theme.borderRadius.xxl,
    borderTopEndRadius: theme.borderRadius.xxl,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    zIndex: 1,
    flex: 1
  },

  itemTitle: {
    color: theme.colors.textDark,
    fontSize: 22,
    fontFamily: theme.fonts.semibold,
    lineHeight: 30,
    marginTop: theme.spacing.sm,
  },

  itemSubtitle: {
    color: theme.colors.textLight,
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    marginTop: theme.spacing.xs,
  },

  itemPriceLabel: {
    color: theme.colors.textLight,
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    marginTop: theme.spacing.md,
  },

  itemPrice: {
    color: theme.colors.primary,
    fontSize: 28,
    lineHeight: 36,
    fontFamily: theme.fonts.bold,
    marginTop: theme.spacing.xs,
  },

  descriptionContainer: {
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },

  itemDescription: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    lineHeight: 22,
  },

  purchaseButton: {
    marginTop: theme.spacing.lg,
  },

  footerContainer: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    zIndex: 99,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.xl,
  },

  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  addToCartButtonText: {
    fontFamily: theme.fonts.semibold,
    color: theme.colors.white,
    fontSize: 16,
    lineHeight: 22,
  },

  addToCartButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: theme.spacing.md,
    ...theme.shadows.md,
  },

  operationsContainer: {
    borderColor: theme.colors.border,
    borderWidth: 1.5,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    height: 54,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
  },

  operationButton: {
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    fontSize: 24,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
  },

  operationButtonDisabled: {
    opacity: 0.3
  },

  quantityText: {
    color: theme.colors.textDark,
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    marginHorizontal: theme.spacing.xs,
    verticalAlign: 'middle',
    lineHeight: 22,
    minWidth: 24,
    textAlign: 'center',
  },

});
