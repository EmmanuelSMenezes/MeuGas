
import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../styles/theme';
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = 0;
const HEADER_HEIGHT = 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

export default StyleSheet.create({
  bgcolorwhiteset: {
    backgroundColor:'white',
    paddingLeft:15,
    paddingTop:30,
    paddingBottom: 30
  },
  setflexviewdata: {
    flexDirection:'row',
    alignItems:'center',
    marginBottom:30,
    marginRight:70,
  },
  textboldstyle: {
    fontWeight:'400',
    fontFamily:theme.fonts.medium,
    color: theme.colors.black,
    fontSize:15,
  },
  textbold: {
    fontWeight:'400',
    fontFamily: theme.fonts.light,
    color: theme.colors.black,
    fontSize:15,
  },
  textSpan:{
    fontWeight:'300',
    fontFamily:theme.fonts.light,
    color: theme.colors.gray,
    fontSize:15,
  },
  textflexview:{

  },
  textboldstyletwo: {
    color: theme.colors.primary,
    fontWeight:'500',
    fontFamily:theme.fonts.medium,
    fontSize:15,
  },
  searchtextlist: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    marginTop: 20,
    fontFamily: theme.fonts.light,
    backgroundColor: 'white'
  }
});
