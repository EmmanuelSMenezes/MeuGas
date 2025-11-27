import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  profileHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16
  },

  userName: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
    fontSize: 18,
    marginTop: 8
  },

  userPhone: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    marginTop: -2
  },

  logoutSpacing: {
    marginTop: 16
  },

  optionsContainer: {
    marginTop: 16
  },
});
