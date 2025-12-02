import { StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  blueHeader: {
    backgroundColor: '#2563EB',
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    marginLeft: 8,
  },

  logo: {
    width: 180,
    height: 60,
    alignSelf: 'center',
    tintColor: '#FFFFFF',
  },

  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: 'center',
  },

  formTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },

  formSubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },

  phoneNumber: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: '#2563EB',
    textAlign: 'center',
    marginBottom: 24,
  },

  otpContainer: {
    marginBottom: 24,
  },

  resendCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  resendCodeTitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: theme.fonts.regular,
    marginBottom: 8,
  },

  resendCodeButtonText: {
    fontFamily: theme.fonts.medium,
    textDecorationLine: 'underline',
    fontSize: 14,
    color: '#2563EB',
  },

  submitButton: {
    backgroundColor: '#F97316',
    borderRadius: 8,
    height: 50,
    width: '100%',
  },

  disabledButton: {
    opacity: 0.5,
  },
});
