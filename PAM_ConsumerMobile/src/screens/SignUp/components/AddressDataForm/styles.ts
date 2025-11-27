import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export const styles = StyleSheet.create({
  inputSpacing: {
    marginTop: 8,
  },

  registerButton: {
    marginVertical: 24,
  },

  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8
  },

  termsText: {
    color: theme.colors.gray,
    fontFamily: theme.fonts.regular,
    flex: 1,
    lineHeight: 18,
    fontSize: 14
  },

  termsError: {
    color: theme.colors.danger
  },

  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: theme.colors.primary,
    height: 58,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 8
  },

  locationButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    lineHeight: 20,
    verticalAlign: 'middle'
  },

  rowInputFields: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    marginTop: 8
  },

  streetInput: {
    width: '65%'
  },

  numberInput: {
    width: '30%'
  }
});
