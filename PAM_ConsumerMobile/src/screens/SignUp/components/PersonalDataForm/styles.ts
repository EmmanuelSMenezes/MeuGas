import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export const styles = StyleSheet.create({
  inputSpacing: {
    marginTop: 8,
  },

  registerButton: {
    marginVertical: 24,
  },

  passwordStrenghtError: {
    color: theme.colors.danger
  }
});
