import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../styles/theme';

const { width } = Dimensions.get('window');

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
  },

  inputLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: '#333333',
    marginBottom: 8,
  },

  inputWrapper: {
    marginBottom: 24,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 0,
    flexDirection: 'column',
  },

  submitButton: {
    backgroundColor: '#F97316',
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 8,
    height: 50,
  },

  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    marginTop: 4,
  },
});

