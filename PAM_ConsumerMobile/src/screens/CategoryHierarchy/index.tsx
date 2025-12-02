import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { useThemeContext } from '../../hooks/themeContext';
import { BlueHeader } from '../../components/BlueHeader';
import { useProducts } from '../../hooks/ProductContext';

const CategoryHierarchy: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const { 
    parentCategoryId, 
    parentCategoryName,
    categoryPath = [] // Array com o caminho de categorias selecionadas
  } = route.params as { 
    parentCategoryId?: string;
    parentCategoryName?: string;
    categoryPath?: Array<{ id: string; name: string }>;
  };
  
  const { dynamicTheme, themeController } = useThemeContext();
  const { 
    getParentCategories, 
    getSubcategories, 
    hasSubcategories,
    isLoadingProducts 
  } = useProducts();

  // Se não tem parentCategoryId, buscar categorias raiz
  const categories = parentCategoryId 
    ? getSubcategories(parentCategoryId)
    : getParentCategories();

  // Cor baseada na primeira categoria do caminho (Gás ou Água)
  const getCategoryColor = (categoryName: string): string => {
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('gás') || lowerName.includes('gas')) return dynamicTheme.colors.primary;
    if (lowerName.includes('água') || lowerName.includes('agua')) return dynamicTheme.colors.blue;
    return dynamicTheme.colors.secondary;
  };

  const firstCategoryName = categoryPath.length > 0 ? categoryPath[0].name : parentCategoryName || '';
  const categoryColor = getCategoryColor(firstCategoryName);

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    // Adicionar categoria ao caminho
    const newPath = [...categoryPath, { id: categoryId, name: categoryName }];

    // Verificar se esta categoria tem filhas
    if (hasSubcategories(categoryId)) {
      // Navegar para próximo nível de categorias
      navigate('CategoryHierarchy', {
        parentCategoryId: categoryId,
        parentCategoryName: categoryName,
        categoryPath: newPath
      });
    } else {
      // Não tem mais filhas, ir para marcas
      navigate('BrandSelection', {
        parentCategoryId: newPath[0]?.id || categoryId,
        parentCategoryName: newPath[0]?.name || categoryName,
        subcategoryId: categoryId,
        subcategoryName: categoryName,
        categoryPath: newPath
      });
    }
  };

  const getIcon = (categoryName: string): string => {
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('gás') || lowerName.includes('gas')) return 'fire';
    if (lowerName.includes('água') || lowerName.includes('agua')) return 'water';
    if (lowerName.includes('botijão') || lowerName.includes('botijao')) return 'gas-cylinder';
    if (lowerName.includes('galão') || lowerName.includes('galao')) return 'cup-water';
    return 'package-variant';
  };

  const title = parentCategoryName || 'Categorias';

  return (
    <View style={styles.mainContainer}>
      <BlueHeader title={title} />

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={themeController(styles.subtitle)}>
          {parentCategoryId ? 'Escolha uma opção' : 'Escolha uma categoria'}
        </Text>

        {isLoadingProducts ? (
          <View style={themeController(styles.loadingContainer)}>
            <ActivityIndicator size="large" color={categoryColor || dynamicTheme.colors.primary} />
            <Text style={themeController(styles.loadingText)}>
              Carregando categorias...
            </Text>
          </View>
        ) : categories.length === 0 ? (
          <View style={themeController(styles.emptyContainer)}>
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={64}
              color={dynamicTheme.colors.textLight}
            />
            <Text style={themeController(styles.emptyText)}>
              Nenhuma categoria disponível
            </Text>
          </View>
        ) : (
          <View style={themeController(styles.categoriesContainer)}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.category_id}
                style={[
                  themeController(styles.categoryCard),
                  { borderColor: categoryColor || dynamicTheme.colors.primary }
                ]}
                onPress={() => handleCategorySelect(category.category_id, category.description)}
                activeOpacity={0.7}
              >
                <View style={[
                  themeController(styles.iconContainer),
                  { backgroundColor: (categoryColor || dynamicTheme.colors.primary) + '15' }
                ]}>
                  <MaterialCommunityIcons
                    name={getIcon(category.description) as any}
                    size={48}
                    color={categoryColor || dynamicTheme.colors.primary}
                  />
                </View>
                
                <Text style={[
                  themeController(styles.categoryName),
                  { color: categoryColor || dynamicTheme.colors.primary }
                ]}>
                  {category.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CategoryHierarchy;

