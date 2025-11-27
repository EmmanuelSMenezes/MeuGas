import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export const styles = StyleSheet.create({
  suggestionContainer: {
    backgroundColor: theme.colors.lightgray,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 24,
    verticalAlign: 'middle',
    alignItems: 'center',
    justifyContent: 'center'
  },

  suggestionContainerActive: {
    backgroundColor: theme.colors.shadowPrimary
  },

  suggestionText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    fontSize: 16
  },

  suggestionTextActive: {
    color: theme.colors.primary
  }
});
