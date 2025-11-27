import { theme } from './../../styles/theme';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
    alignItems: 'center',
    marginTop: Constants.statusBarHeight,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
});
