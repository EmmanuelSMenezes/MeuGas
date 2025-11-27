import { StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24
  },

  title: {
    color: theme.colors.primary,
    fontSize: 24,
    textAlign: 'center',
    fontFamily: theme.fonts.medium,
  },

  subtitle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    textAlign: 'center'
  },

  resendCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4
  },

  resendCodeTitle: {
    color: theme.colors.gray,
    fontFamily: theme.fonts.medium,
  },

  resendCodeButtonText: {
    fontFamily: theme.fonts.regular,
    textDecorationLine: 'underline',
    textDecorationColor: theme.colors.primary,
    textDecorationStyle: 'solid',
    fontSize: 16,
    color: theme.colors.primary
  },

  confirmButton: {
    marginTop: 24,
  },

  resendCodeTimer: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    textAlign: 'center'
    // marginBottom: 8
  },

  disabledButton: {
    opacity: 0.3,
    color: theme.colors.black
  }

});
