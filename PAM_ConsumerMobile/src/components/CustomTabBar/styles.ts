import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../styles/theme';

const { width } = Dimensions.get('window')

export const styles = StyleSheet.create({

  mainContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 70,
    bottom: 0,
    backgroundColor: theme.colors.lightgray,
    // marginHorizontal: width * 0.1
  },

  tabBarButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    marginVertical: 12
  },

  tabBarButtonContainerFocused: {
    borderTopWidth: 3,
    borderColor: theme.colors.primary
  },

  tabBarButton: {
    flex: 1,
    // marginVertical: 12
    paddingHorizontal: 12,
  },

  tabBarButtonFocused: {
    backgroundColor: theme.colors.primary,
    borderRadius: 32
  },

  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    flexDirection: 'row',
    gap: 8,
    width: 'auto'
  },

  buttonTitle: {
    fontFamily: theme.fonts.regular,
    lineHeight: 20,
    color: theme.colors.gray,

  },

  buttonTitleFocused: {
    color: theme.colors.white
  },

  badgeFocusedPosition: {
    top: -3,
    right: -6,
  },

  badgePosition: {
    position: 'absolute',
    zIndex: 99,
    top: -1,
    right: width / 11,
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: theme.colors.secondary,
    fontFamily: theme.fonts.regular,
    borderRadius: 12,
    lineHeight: 14,
    fontSize: 12,
    minWidth: 18,
    paddingHorizontal: 3,
    height: 18,
    paddingVertical: 3,
    color: theme.colors.white
  }
})
