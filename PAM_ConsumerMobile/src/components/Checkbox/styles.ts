import { Platform, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  checkboxStyle: {
    borderRadius: 4
  },

  checkboxError: {
    borderColor: theme.colors.danger
  },

  checkedBorder: {
    borderWidth: 3,
  },
});
