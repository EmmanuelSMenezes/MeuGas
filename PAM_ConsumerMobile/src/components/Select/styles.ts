import { StyleSheet, Platform } from "react-native";
import { theme } from "../../styles/theme";

export default StyleSheet.create({
  container: {
    marginBottom: 6,
    borderRadius: 10,
    backgroundColor: 'hsl(0, 0%, 94.9%)',
    textAlign: 'left',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'ios' ? 0 : 25,
    },
    shadowOpacity: 0.58,
    shadowRadius: Platform.OS === 'ios' ? 0 : 25,
    elevation: Platform.OS === 'ios' ? 0 : 0,
  },

  pickerContent: {
    borderWidth: 0,
    borderColor: null,
    fontFamily: theme.fonts.bold,
  },

  pickerItem: {
    fontFamily: theme.fonts.bold,
    borderRadius: 24
  },


})
