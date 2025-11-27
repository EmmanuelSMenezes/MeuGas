import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    gap: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32
  },

  tabOptionButton: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabOptionText: {
    color: theme.colors.gray,
    fontFamily: theme.fonts.regular,
    fontSize: 14
  },

  tabOptionTextActive: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold
  },

  tabOptionActive: {
    borderRadius: 8,
    width: 20,
    height: 2,
    backgroundColor: theme.colors.primary,
  },

});
