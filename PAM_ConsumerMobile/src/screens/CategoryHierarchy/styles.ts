import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  headerContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },

  headerTitle: {
    color: theme.colors.white,
    fontSize: 24,
    fontFamily: theme.fonts.bold,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  subtitle: {
    color: theme.colors.black,
    fontSize: 20,
    fontFamily: theme.fonts.medium,
    marginTop: 24,
    marginBottom: 20,
  },

  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 32,
  },

  categoryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    width: '47%',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  categoryName: {
    fontSize: 16,
    fontFamily: theme.fonts.semibold,
    textAlign: 'center',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});

