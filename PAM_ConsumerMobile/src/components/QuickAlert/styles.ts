
import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({

  container: {
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.shadow,
    zIndex: 99,
  },

  content: {
    backgroundColor: theme.colors.background,
    paddingTop: 16,
    paddingBottom: 42,
    paddingHorizontal: 42,
    borderRadius: 24,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  animationContainer: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },

  title: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.black,
    fontSize: 18,
    textAlign: 'center',
    // lineHeight: 21,
  },

  description: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    width: 250,
    textAlign: 'center',
  },

  sucessSize: {
    width: 250,
    height: 250,
    alignSelf: 'center',
  },

  errorSize: {
    width: 110,
    height: 110,
    alignSelf: 'center'
  },

  warningSize: {
    width: 130,
    height: 130,
    alignSelf: 'center'
  },

  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
    flexWrap: 'wrap',
  },

  cancelButton: {
    backgroundColor: theme.colors.danger,
    borderRadius: 12,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },

  cancelButtonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    lineHeight: 20
  },

  confirmButton: {
    backgroundColor: theme.colors.success,
    borderRadius: 12,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },

  confirmButtonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    lineHeight: 20
  },

  extraButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    minWidth: 120,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12
  },

  extraButtonText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    lineHeight: 20
  },

});
