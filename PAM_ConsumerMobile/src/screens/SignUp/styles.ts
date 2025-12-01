import { theme } from './../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: {
    color: theme.colors.textDark,
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    marginBottom: theme.spacing.md,
    width: '100%',
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    marginBottom: theme.spacing.sm,
  },
});
