import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export const styles = StyleSheet.create({
  searchNotFoundContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },

  searchMessage: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    verticalAlign: 'middle',
    lineHeight: 20,
  }
});
