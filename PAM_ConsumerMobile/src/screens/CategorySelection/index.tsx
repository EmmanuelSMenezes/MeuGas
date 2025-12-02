import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { useThemeContext } from '../../hooks/themeContext';
import { BlueHeader } from '../../components/BlueHeader';
import { useLocation } from '../../hooks/LocationContext';
import { useProducts } from '../../hooks/ProductContext';
import Logo from './../../assets/img/logo.png';

const CategorySelection: React.FC = () => {
  const { navigate } = useNavigation();
  const { dynamicTheme, themeController } = useThemeContext();
  const { requestLocationPermission, hasLocationPermission, currentLocation } = useLocation();
  const { getParentCategories, hasSubcategories, isLoadingProducts } = useProducts();

  // Solicitar permissão de localização ao abrir o app
  useEffect(() => {
    if (!hasLocationPermission && !currentLocation) {
      requestLocationPermission();
    }
  }, []);

  // Buscar categorias pai dos produtos
  const parentCategories = getParentCategories();

  // Mapear ícones e cores para categorias conhecidas
  const getCategoryIcon = (description: string): string => {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('gás') || lowerDesc.includes('gas')) return 'fire';
    if (lowerDesc.includes('água') || lowerDesc.includes('agua')) return 'water';
    return 'package-variant';
  };

  const getCategoryColor = (description: string): string => {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('gás') || lowerDesc.includes('gas')) return dynamicTheme.colors.primary;
    if (lowerDesc.includes('água') || lowerDesc.includes('agua')) return dynamicTheme.colors.blue;
    return dynamicTheme.colors.secondary;
  };

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    console.log('🔍 CategorySelection - Verificando se categoria tem filhas:', categoryId);

    // Verificar se esta categoria tem filhas
    if (hasSubcategories(categoryId)) {
      console.log('✅ Tem filhas! Indo para CategoryHierarchy');
      // Tem filhas, ir para CategoryHierarchy
      navigate('CategoryHierarchy', {
        parentCategoryId: categoryId,
        parentCategoryName: categoryName,
        categoryPath: [{ id: categoryId, name: categoryName }]
      });
    } else {
      console.log('❌ NÃO tem filhas! Indo para BrandSelection');
      // Não tem filhas, ir direto para marcas
      navigate('BrandSelection', {
        parentCategoryId: categoryId,
        parentCategoryName: categoryName,
        subcategoryId: categoryId,
        subcategoryName: categoryName
      });
    }
  };

  const logoComponent = (
    <Image
      source={Logo}
      style={styles.logo}
      resizeMode="contain"
    />
  );

  return (
    <View style={styles.mainContainer}>
      <BlueHeader title="Categorias" centerComponent={logoComponent} />

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={themeController(styles.subtitle)}>
          O que você precisa hoje?
        </Text>

        {isLoadingProducts ? (
          <View style={themeController(styles.loadingContainer)}>
            <ActivityIndicator size="large" color={dynamicTheme.colors.primary} />
            <Text style={themeController(styles.loadingText)}>
              Carregando categorias...
            </Text>
          </View>
        ) : parentCategories.length === 0 ? (
          <View style={themeController(styles.emptyContainer)}>
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={64}
              color={dynamicTheme.colors.textLight}
            />
            <Text style={themeController(styles.emptyText)}>
              Nenhuma categoria disponível no momento
            </Text>
          </View>
        ) : (
          <View style={themeController(styles.categoriesContainer)}>
            {parentCategories.map((category) => {
              const icon = getCategoryIcon(category.description);
              const color = getCategoryColor(category.description);

              return (
                <TouchableOpacity
                  key={category.category_id}
                  style={[
                    themeController(styles.categoryCard),
                    { borderColor: color }
                  ]}
                  onPress={() => handleCategorySelect(category.category_id, category.description)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    themeController(styles.iconContainer),
                    { backgroundColor: color + '15' }
                  ]}>
                    <MaterialCommunityIcons
                      name={icon as any}
                      size={64}
                      color={color}
                    />
                  </View>

                  <Text style={[
                    themeController(styles.categoryName),
                    { color: color }
                  ]}>
                    {category.description}
                  </Text>

                  <Text style={themeController(styles.categoryDescription)}>
                    Produtos disponíveis perto de você
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CategorySelection;

