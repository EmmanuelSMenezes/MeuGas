import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  blueHeader: {
    backgroundColor: '#2563EB',
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },

  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  smallAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: theme.fonts.semiBold,
    marginBottom: 16,
  },

  largeIconContainer: {
    position: 'absolute',
    bottom: -40,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 50,
  },

  optionsContainer: {
    paddingHorizontal: 16,
  },

  logoutSpacing: {
    marginTop: 16,
  },

  profileHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16
  },

  userName: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
    fontSize: 18,
    marginTop: 8
  },

  userPhone: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    marginTop: -2
  },
});
