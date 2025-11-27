import { Dimensions, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 20
  },

  title: {
    color: theme.colors.black,
    fontFamily: theme.fonts.medium,
    fontSize: 20,
    paddingTop: 15
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
    marginTop: 20,
    fontFamily: theme.fonts.light,
  },
  textflexview: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    alignContent: 'center'
  },
  setflextext: {

  },
  textboldstyle: {
    fontWeight: '400',
    fontFamily: theme.fonts.light,
    color: theme.colors.black,
    fontSize: 15,
  },
  textSpan: {
    fontWeight: '300',
    fontFamily: theme.fonts.light,
    color: theme.colors.gray,
    fontSize: 15,
  },
  textboldstyletwo: {
    color: theme.colors.primary,
    fontWeight: '500',
    fontFamily: theme.fonts.light,
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

  searchInputContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  flextextinput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '3%',
    backgroundColor: theme.colors.lightgray,
    borderRadius: 22,
    marginHorizontal: '5%',
    flex: 1,
  },
  setinputtext: {
    fontSize: 16,
    height: 49,
    fontFamily: theme.fonts.medium,
  },
  filter: {
    borderWidth: 1,
    padding: 12,
    borderColor: theme.colors.white,
    backgroundColor: theme.colors.lightgray,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 13,
    marginEnd: '3%'
  },

  imagsetstylefredrice: {
    height: 50,
    width: 50,
    borderRadius: 100,
    marginRight: 20,
  },

  categoriesContainer: {
      marginTop: 14,
      rowGap: 12,
      paddingBottom: 32,
  },
  listColumnsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
});
