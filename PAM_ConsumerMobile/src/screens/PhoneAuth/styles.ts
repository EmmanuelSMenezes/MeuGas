import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    justifyContent: 'center',
  },

  logo: {
    width: 200,
    height: 80,
    alignSelf: 'center',
    marginBottom: theme.spacing.xl,
  },

  title: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    lineHeight: 20,
  },

  inputSpacing: {
    marginBottom: theme.spacing.md,
  },

  signInButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },

  signUpButton: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});

