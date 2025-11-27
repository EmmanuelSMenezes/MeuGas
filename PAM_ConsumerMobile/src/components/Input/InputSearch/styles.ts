import { StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  title: {
    color: theme.colors.primary,
    fontSize: 24,
    marginBottom: 4,
    textAlign: 'center'
  },
  setflexviewdata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginRight: 70,
  },
  searchtextlist: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    marginTop: 20
  },
  textflexview: {

  },
  setflextext: {

  },
  textboldstyle: {
    fontWeight: '400',
    // fontFamily:Fonts.Metropolis_Medium,
    color: theme.colors.black,
    fontSize: 15,
  },
  textSpan: {
    fontWeight: '300',
    // fontFamily:Fonts.Metropolis_Medium,
    color: theme.colors.gray,
    fontSize: 15,
  },
  textboldstyletwo: {
    color: theme.colors.primary,
    fontWeight: '500',
    // fontFamily:Fonts.Metropolis_Medium,
    fontSize: 15,
  },

  minflexview: {
    width: '100%',
    height: '100%',
  },
  setbgcolorred: {
    height: 200,
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  flexinputstyle: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 100,
  },
  flextextinput: {
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
  },
  setinputtext: {
    fontSize: 16,
    height: 49,
    textAlign: 'justify',
    flexDirection: 'row',
    flex: 1,
    fontFamily: theme.fonts.light,
  },
  seticonborder: {
    borderWidth: 1,
    padding: 12,
    borderColor: theme.colors.white,
    backgroundColor: theme.colors.lightgray,
    borderRadius: 13
  },
  setspacecomeview: {
    marginTop: -80,
  },
  setflex: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  bgcolorwhiteset: {
    backgroundColor: 'white',
    position: 'relative',
    paddingLeft: 15,
    paddingTop: 30,
  },
  setbgborderview: {
    borderWidth: 1,
    paddingLeft: 8,
    borderColor: theme.colors.white,
    backgroundColor: theme.colors.white,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 18,
    marginRight: 10,
    marginBottom: 20,
  },
  imagsetstylefredrice: {
    height: 50,
    width: 50,
    borderRadius: 100,
    marginRight: 20,
  },

  inputSearchContainer: {
    backgroundColor: theme.colors.lightgray,
    flex: 1,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  inputContent: {
    verticalAlign: 'middle',
    lineHeight: 21,
    flex: 1,
    fontFamily: theme.fonts.light,
  },

  iconSpacing: {
    paddingVertical: 8,
    paddingLeft: 16,
  },
});
