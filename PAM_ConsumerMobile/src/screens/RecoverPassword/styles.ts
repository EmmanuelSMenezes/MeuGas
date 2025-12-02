import { theme } from './../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  container: {
    justifyContent: 'center',
    width: '100%',
    paddingTop: 16,
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
