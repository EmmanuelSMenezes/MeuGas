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

  inputSpacing: {
    marginTop: 8,
  },

  registerButton: {
    marginVertical: 24,
  },

  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: theme.colors.primary,
    height: 58,
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 8
  },

  locationButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    lineHeight: 20,
    verticalAlign: 'middle'
  },

  rowInputFields: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: 'space-between',
    marginTop: 8
  },

  streetInput: {
    width: '65%'
  },

  numberInput: {
    width: '30%'
  }
});
