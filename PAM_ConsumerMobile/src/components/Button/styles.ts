import { Platform, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: 96,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 56,
    paddingBottom: 5,
    paddingTop: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'ios' ? 0 : 0,
    },
    shadowOpacity: 0.58,
    shadowRadius: Platform.OS === 'ios' ? 0 : 0,
    elevation: Platform.OS === 'ios' ? 0 : 0,
    gap: 16,
  },

  buttonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.medium,
    lineHeight: 24,
    verticalAlign: 'middle',
    fontSize: 16,
  },
});
