import { theme } from './../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    color: theme.colors.primary,
    fontSize: 21,
    width: '100%',
    fontFamily: theme.fonts.medium,
  },
  inputSpacing: {
    marginTop: 8,
  },

  registerButton: {
    marginVertical: 24,
  },

});
