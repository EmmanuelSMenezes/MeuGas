import Constants from 'expo-constants';
import { theme } from './theme';
import { StyleSheet, Platform } from 'react-native';

export const orderStyles = StyleSheet.create({

  informationContainer: {
    backgroundColor: theme.colors.lightgray,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 24
  },

  orderCreatedAt: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    marginBottom: 16,
    marginTop: -16
  },

  informationContainerWithoutBackground: {
    marginBottom: 24
  },

  paymentTitle: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
  },

  paymentMethod: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
  },

  purchaseContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },

  purchaseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1
  },

  purchaseItem: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center'
  },

  purchaseImage: {
    width: 70,
    height: 70,
    aspectRatio: 1 / 1,
    borderRadius: 6
  },

  purchaseItemInformations: {
    flex: 1
  },

  purchaseName: {
    fontSize: 16,
    color: theme.colors.black,
    fontFamily: theme.fonts.medium,
    lineHeight: 20,
    paddingRight: 16
  },

  purchasePrice: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },

  purchaseQuantity: {
    color: theme.colors.black,
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    marginHorizontal: 4,
    verticalAlign: 'middle',
    lineHeight: 22,
  },

  purchaseInformationBeetween: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  purchaseTotal: {
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
  },

  transshipmentText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.success,
    marginTop: 12
  },

  transshipmentTextWarn: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: 12
  },

  freightFree: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.success
  },

  recipientText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text
  },

  addressText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular
  },

  purchaseTotalLabel: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.text
  },

  freightText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text
  },

  ratingColor: {
    backgroundColor: theme.colors.orange
  },

  statusColor1: {
    backgroundColor: theme.colors.warning
  },

  statusColorPending: {
    backgroundColor: theme.colors.warning
  },

  statusColorCanceled: {
    backgroundColor: theme.colors.danger
  },

  statusColorFinishedOrAccepted: {
    backgroundColor: theme.colors.success
  },

  observationsContent: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    
  }
})
