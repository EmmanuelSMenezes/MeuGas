import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { useThemeContext } from '../../hooks/themeContext';
import { BlueHeader } from '../../components/BlueHeader';
import { useProducts } from '../../hooks/ProductContext';

const SubcategorySelection: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const { parentCategoryId, parentCategoryName } = route.params as { 
    parentCategoryId: string;
    parentCategoryName: string;
  };
  const { dynamicTheme, themeController } = useThemeContext();
  const { getSubcategories, isLoadingProducts } = useProducts();

  // Buscar subcategorias da categoria pai
  const subcategories = getSubcategories(parentCategoryId);

  // Cor baseada na categoria pai
  const getCategoryColor = (categoryName: string): string => {
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('gás') || lowerName.includes('gas')) return dynamicTheme.colors.primary;
    if (lowerName.includes('água') || lowerName.includes('agua')) return dynamicTheme.colors.blue;
    return dynamicTheme.colors.secondary;
  };

  const categoryColor = getCategoryColor(parentCategoryName);

  const handleSubcategorySelect = (subcategoryId: string, subcategoryName: string) => {
    navigate('BrandSelection', { 
      parentCategoryId,
      parentCategoryName,
      subcategoryId,
      subcategoryName
    });
  };

  return (
    <View style={styles.mainContainer}>
      <BlueHeader title={parentCategoryName} />

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={themeController(styles.subtitle)}>
          Escolha o tipo de produto
        </Text>

        {isLoadingProducts ? (
          <View style={themeController(styles.loadingContainer)}>
            <ActivityIndicator size="large" color={categoryColor} />
            <Text style={themeController(styles.loadingText)}>
              Carregando subcategorias...
            </Text>
          </View>
        ) : subcategories.length === 0 ? (
          <View style={themeController(styles.emptyContainer)}>
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={64}
              color={dynamicTheme.colors.textLight}
            />
            <Text style={themeController(styles.emptyText)}>
              Nenhuma subcategoria disponível
            </Text>
          </View>
        ) : (
          <View style={themeController(styles.subcategoriesContainer)}>
            {subcategories.map((subcategory) => (
              <TouchableOpacity
                key={subcategory.category_id}
                style={[
                  themeController(styles.subcategoryCard),
                  { borderColor: categoryColor }
                ]}
                onPress={() => handleSubcategorySelect(subcategory.category_id, subcategory.description)}
                activeOpacity={0.7}
              >
                <View style={[
                  themeController(styles.iconContainer),
                  { backgroundColor: categoryColor + '15' }
                ]}>
                  <MaterialCommunityIcons
                    name="package-variant"
                    size={48}
                    color={categoryColor}
                  />
                </View>
                
                <Text style={[
                  themeController(styles.subcategoryName),
                  { color: categoryColor }
                ]}>
                  {subcategory.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SubcategorySelection;

