import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export const styles = StyleSheet.create({

  title: {
    color: theme.colors.black,
    fontSize: 20,
    fontFamily: theme.fonts.medium,
    marginBottom: 4
  },

  noteInput: {
    minHeight: 120,
    height: 'auto',
    textAlign: 'left',
    alignItems: 'flex-start',
    verticalAlign: 'top',
    paddingVertical: 12
  },
});
