import { Platform, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'hsl(0, 0%, 94.9%)',
    color: theme.colors.text,
    width: '100%',
    height: 58,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 6,
    shadowColor: '#52006A',
    paddingHorizontal: 16,
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'ios' ? 0 : 25,
    },
    shadowOpacity: 0.58,
    shadowRadius: Platform.OS === 'ios' ? 0 : 25,
    elevation: Platform.OS === 'ios' ? 0 : 0,
    fontSize: 16,
  },

  inputContent: {
    flex: 1,
    fontFamily: theme.fonts.light
  },
});
