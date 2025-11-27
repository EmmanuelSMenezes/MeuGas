import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.lightgray,
  },

  header: {
    marginHorizontal: 20,
  },

  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 24,
    paddingHorizontal: 20,
    borderTopEndRadius: 32,
    borderTopStartRadius: 32,
    height: '100%'
  },

  title: {
    color: theme.colors.black,
    fontSize: 24,
    fontFamily: theme.fonts.medium,
    marginBottom: 4
  },

  footer: {
    flexDirection: 'row',
    // marginTop: 16,
    justifyContent: 'space-between',
    paddingVertical: 24,
    alignItems: 'center'
  },

  nextButton: {
    paddingLeft: 32,
    paddingRight: 18,
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderRadius: 24,
  },

  nextButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.medium,
    lineHeight: 21,
    fontSize: 16,
    verticalAlign: 'middle'
  },

  previousButton: {
    paddingRight: 32,
    paddingLeft: 18,
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderRadius: 24
  },

  previousButtonText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
    lineHeight: 21,
    fontSize: 16,
    verticalAlign: 'middle'
  },

});
