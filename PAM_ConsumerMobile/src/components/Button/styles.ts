import { Platform, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 54,
    gap: theme.spacing.sm,
    ...theme.shadows.md,
  },

  buttonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.semibold,
    lineHeight: 24,
    verticalAlign: 'middle',
    fontSize: 16,
  },
});
