import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  headerTitle: {
    color: theme.colors.white,
    fontSize: 20,
    fontFamily: theme.fonts.medium,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  subtitle: {
    color: theme.colors.black,
    fontSize: 24,
    fontFamily: theme.fonts.medium,
    marginTop: 32,
    marginBottom: 24,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  brandsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 32,
  },

  brandCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '47%',
    minHeight: 140,
  },

  brandLogo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },

  brandName: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    textAlign: 'center',
  },
});

