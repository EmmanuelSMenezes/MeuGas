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

  paymentsContainer: {
    // gap: 8,
    marginBottom: 24
  },
  cardContainer:{
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },

  rowInputFields: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: 'space-between',
    marginTop: 8
  },
  expirationDateInput: {
    width: '65%'
  },
  cvvInput: {
    width: '30%'
  },

  inputSpacing: {
    marginTop: 8,
  },

});
