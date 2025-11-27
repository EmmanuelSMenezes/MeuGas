import { StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export const styles = StyleSheet.create({

  container: {
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.shadow,
    zIndex: 99,
  },

  content: {
    backgroundColor: theme.colors.background,
    paddingTop: 12,
    paddingBottom: 24,
    width: '90%',
    paddingHorizontal: 32,
    borderRadius: 24,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noteInput: {
    minHeight: 120,
    height: 'auto',
    textAlign: 'left',
    alignItems: 'flex-start',
    verticalAlign: 'top',
    paddingVertical: 12
  },

  evaluatePartnerContainer: {
    alignItems: 'center',
    marginTop: 16,
    width: '100%'
  },

  evaluatePartnerTitle: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    fontSize: 18,
  },

  evaluatePartnerSubtitle: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
  },

  starsContainer: {
    marginBottom: 18,
  },

  buttonsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    marginTop: 20,
  },

  cancelButton: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },

  cancelButtonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    lineHeight: 20
  },

  confirmButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },

  confirmButtonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    lineHeight: 20
  },


});
