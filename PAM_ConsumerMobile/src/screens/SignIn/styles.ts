import { theme } from './../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
  },

  logo: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.xxl,
  },

  title: {
    color: theme.colors.textDark,
    fontFamily: theme.fonts.bold,
    fontSize: 32,
    marginBottom: theme.spacing.lg,
    width: '100%',
    letterSpacing: -0.5,
  },

  forgetPassword: {
    marginTop: theme.spacing.sm,
    width: '100%',
    alignItems: 'flex-end',
  },

  forgetPasswordText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
    fontSize: 14,
  },

  inputSpacing: {
    marginTop: theme.spacing.md,
  },

  signInButton: {
    marginTop: theme.spacing.xl,
    height: 54,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },

  signUpButton: {
    marginTop: theme.spacing.lg,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    verticalAlign: 'middle',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
});
