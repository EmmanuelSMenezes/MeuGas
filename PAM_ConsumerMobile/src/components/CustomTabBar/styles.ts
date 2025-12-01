import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../styles/theme';

const { width } = Dimensions.get('window')

export const styles = StyleSheet.create({

  mainContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 70,
    bottom: 0,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: 8,
    ...theme.shadows.lg,
  },

  tabBarButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 8,
  },

  tabBarButtonContainerFocused: {
    borderTopWidth: 0,
  },

  tabBarButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  tabBarButtonFocused: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
  },

  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    flexDirection: 'row',
    gap: 6,
    width: 'auto',
  },

  buttonTitle: {
    fontFamily: theme.fonts.medium,
    lineHeight: 18,
    fontSize: 12,
    color: theme.colors.textLight,
  },

  buttonTitleFocused: {
    color: theme.colors.white,
    fontFamily: theme.fonts.semibold,
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
    backgroundColor: theme.colors.danger,
    fontFamily: theme.fonts.medium,
    borderRadius: theme.borderRadius.round,
    lineHeight: 14,
    fontSize: 11,
    minWidth: 18,
    paddingHorizontal: 4,
    height: 18,
    paddingVertical: 2,
    color: theme.colors.white,
  }
})
