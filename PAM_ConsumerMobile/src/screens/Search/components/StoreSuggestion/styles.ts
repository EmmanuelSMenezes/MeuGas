import { theme } from './../../../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  suggestionContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 8,
  },

  suggestionName: {
    color: theme.colors.text
  },
});
