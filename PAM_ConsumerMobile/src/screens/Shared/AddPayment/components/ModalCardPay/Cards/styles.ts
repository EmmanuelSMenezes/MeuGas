import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../../../../styles/theme";

const styles = StyleSheet.create({

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignSelf: 'flex-start'
  },
  modalText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.gray,
    verticalAlign: 'middle',
    lineHeight: 20
  },
  containerIcon:{
    padding: 12,
    backgroundColor: theme.colors.lightgray,
    borderRadius: 24
  },
  containerText:{
    paddingLeft: 20,
    justifyContent: 'center'
  }
});

export default styles;
