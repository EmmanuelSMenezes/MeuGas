import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  headerContainer: {
    backgroundColor: theme.colors.darker,
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

  categoriesContainer: {
    gap: 20,
    paddingBottom: 32,
  },

  categoryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  categoryName: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    marginBottom: 8,
  },

  categoryDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.gray,
    textAlign: 'center',
  },
});

