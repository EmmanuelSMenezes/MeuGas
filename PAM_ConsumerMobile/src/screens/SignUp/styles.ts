import { theme } from './../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
    fontSize: 24,
    marginBottom: -4,
    width: '100%',
  },

  subtitle: {
    fontSize: 16,
    color: theme.colors.primary
  },
});
