
import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.shadow,
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
})

export default styles;
