import { theme } from './../../styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  
    logo: {
      width: 300, // Obrigatório para imagens remotas
      height: 150, // Obrigatório para imagens remotas
      alignSelf: 'center',
      marginVertical: 20,
    },

  title: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
    fontSize: 24,
    marginBottom: 12,
    width: '100%',
  },

  forgetPassword: {
    marginTop: 4,
    width: '100%',
  },

  forgetPasswordText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.light,
    width: '100%',
  },

  inputSpacing: {
    marginTop: 8,
  },

  signInButton: {
    marginTop: 32,
  },

  signUpButton: {
    marginTop: 24,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    verticalAlign: 'middle',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
});
