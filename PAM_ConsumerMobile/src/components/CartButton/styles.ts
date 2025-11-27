import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";


const styles = StyleSheet.create({

  container: {
    position: 'relative',
  },

  cartCountContainer: {
    position: 'absolute',
    top: -7,
    left: 15,
    right: 0,
    bottom: 0,
    zIndex: 99,
    backgroundColor: theme.colors.danger,
    height: 15,
    width: 15,
    borderRadius: 16
  },

  cartCount: {
    color: theme.colors.white,
    fontFamily: theme.fonts.medium,
    verticalAlign: 'middle',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 10
  }
})

export default styles;
