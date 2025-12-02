import { StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  profileHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingStart: 20,
    gap: 12,
    backgroundColor: theme.colors.lightgray,
    height: 58,
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 8
  },

  text: {
    color: theme.colors.danger,
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    lineHeight: 20,
    verticalAlign: 'middle'
  },

  textAbout: {
    color: theme.colors.black,
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    lineHeight: 20,
    verticalAlign: 'middle'
  },

});
