import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({

  orderContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8
  },

  orderListContainer: {
    paddingBottom: 32
  },

  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },

  orderStoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18
  },

  orderStore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },

  storeName: {
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    height: 17
  },

  orderDate: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    height: 17
  },

  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    flex: 1
  },

  orderItemInformations: {
    flex: 1
  },

  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1
  },

  orderId: {
    color: theme.colors.text,
    fontFamily: theme.fonts.light,
    fontSize: 14,
  },

  orderItemName: {
    color: theme.colors.black,
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    lineHeight: 20,
    paddingRight: 18
  },

  orderItemPrice: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2
  },

  orderItemQuantity: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    lineHeight: 18
  },

  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 12,
  },

  orderHelpButton: {
    height: 35,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 18,
  },

  orderHelpButtonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    fontSize: 12,
    lineHeight: 18
  },

  orderDetailsButton: {
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 18,
    backgroundColor: theme.colors.primary,
  },

  orderDetailsButtonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    fontSize: 12,
    lineHeight: 18
  },

  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8
  },

  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4
  },

  orderStatusText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.white,
    lineHeight: 17
  },




});
