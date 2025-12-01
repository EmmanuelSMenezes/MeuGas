import { theme } from './../../styles/theme';
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },

  subtitleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },

  subtitle: {
    color: theme.colors.textDark,
    fontSize: 20,
    fontFamily: theme.fonts.semibold,
    lineHeight: 28,
  },

  seeMoreButton: {
    color: theme.colors.primary,
    fontSize: 14,
    fontFamily: theme.fonts.medium,
  },

  itemsList: {
    marginBottom: theme.spacing.lg,
    paddingLeft: theme.spacing.lg,
  },

  itemsListContent: {
    paddingRight: theme.spacing.lg,
  },

  cardSize: {
    width: (width - theme.spacing.lg * 3) / 2,
    marginRight: theme.spacing.md,
  },

  // Tabs nativas
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },

  tabsContent: {
    paddingHorizontal: theme.spacing.md,
  },

  tabButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginRight: theme.spacing.sm,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },

  tabText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textLight,
  },

  // Novas seções para tabs
  subcategoriesSection: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  productsSection: {
    flex: 1,
    padding: theme.spacing.lg,
  },

  productRow: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },

  storeCardSize: {
    width: width * 0.7,
    marginRight: theme.spacing.md,
  },

  headerAddressContainer: {
    backgroundColor: theme.colors.darker,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.shadows.sm,
    minHeight: 70,
  },

  headerAddressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
    maxWidth: '85%',
  },

  headerAddressText: {
    fontSize: 13,
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    lineHeight: 18,
  },

  categoryButton: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.shadows.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },

  categoryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  categoryButtonTextContainer: {
    gap: theme.spacing.xs,
  },

  categoryButtonTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semibold,
    color: theme.colors.textDark,
  },

  categoryButtonSubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
  },

  // Grid styles
  gridContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },

  gridRow: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },

  gridItem: {
    width: (width - theme.spacing.lg * 3) / 2,
  },

  // Novos estilos para seções
  section: {
    marginBottom: theme.spacing.lg,
  },

  sectionTitle: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },

  sectionSubtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.semibold,
    color: theme.colors.textDark,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },

  // Categorias PAI
  parentCategoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },

  parentCategoryButton: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    minHeight: 100,
  },

  parentCategoryText: {
    fontSize: 16,
    fontFamily: theme.fonts.semibold,
    color: theme.colors.textDark,
  },

  parentCategoryTextSelected: {
    color: theme.colors.white,
  },

  // Subcategorias
  subcategoriesContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },

  subcategoryChip: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundCard,
    ...theme.shadows.sm,
  },

  subcategoryText: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.textDark,
  },

  subcategoryTextSelected: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
  },

  // Produtos
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  sortLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textLight,
  },

  productList: {
    gap: 0,
  },

  // Loading e Empty states
  loadingContainer: {
    paddingVertical: theme.spacing.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textLight,
  },

  emptyContainer: {
    flex: 1,
    paddingVertical: theme.spacing.xl * 2,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textLight,
    textAlign: 'center',
  },

  emptyTitle: {
    marginTop: theme.spacing.lg,
    fontSize: 22,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
    textAlign: 'center',
  },

  emptyDescription: {
    marginTop: theme.spacing.md,
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },

  emptyButton: {
    marginTop: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    ...theme.shadows.md,
  },

  emptyButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.semibold,
    color: theme.colors.white,
  },

  headerAddressTextContainer: {
    flex: 1,
  },

  headerAddressLabel: {
    fontSize: 11,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
  },
});
