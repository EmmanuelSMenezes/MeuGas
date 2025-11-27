import { Dimensions, StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export const styles = StyleSheet.create({
  suggestionContainer: {
    backgroundColor: theme.colors.lightgray,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
    verticalAlign: 'middle',
    alignItems: 'center',
    width: Dimensions.get("screen").width / 2.3,
    height: Dimensions.get("screen").height / 16.2,
    justifyContent: 'center'
  },

  suggestionContainerActive: {
    backgroundColor: theme.colors.shadowPrimary
  },

  categorySuggestionText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    fontSize: 12
  },

  categorySuggestionTextActive: {
    color: theme.colors.primary
  }
});
