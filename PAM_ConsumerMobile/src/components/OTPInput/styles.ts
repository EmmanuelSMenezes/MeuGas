import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },

  inputField: {
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderStyle: 'solid',
    borderRadius: 4,
    width: 40,
    height: 50,
    textAlign: 'center',
    verticalAlign: 'middle',
    lineHeight: 20,
    fontFamily: theme.fonts.regular,
  },

  inputFocus: {
    borderColor: theme.colors.primary
  }

});
