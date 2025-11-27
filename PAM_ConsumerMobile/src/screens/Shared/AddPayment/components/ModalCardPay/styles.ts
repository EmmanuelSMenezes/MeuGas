import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../../../styles/theme";

const styles = StyleSheet.create({
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.shadow,
    zIndex: 1,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: 'flex-start',
    width:'100%',
    backgroundColor: theme.colors.lightgray,
    marginBottom: 10,
    borderRadius: 20
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
