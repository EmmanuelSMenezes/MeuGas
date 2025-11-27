import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },

  title: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    lineHeight: 19,
    verticalAlign: 'middle',
    fontSize: 14,
  },

  badge: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white
  },

  optionsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
});
