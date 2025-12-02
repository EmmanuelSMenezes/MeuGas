import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  subtitle:{
    fontSize: 14,
    color: '#a3a3a3',
    fontFamily: theme.fonts.regular,
    marginBottom: 24,
    textAlign: 'center',
  }

});
