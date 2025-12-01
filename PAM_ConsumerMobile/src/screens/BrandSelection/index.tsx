import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { useThemeContext } from '../../hooks/themeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { useProducts } from '../../hooks/ProductContext';

const BrandSelection: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const {
    parentCategoryId,
    parentCategoryName,
    subcategoryId,
    subcategoryName
  } = route.params as {
    parentCategoryId: string;
    parentCategoryName: string;
    subcategoryId: string;
    subcategoryName: string;
  };
  const { dynamicTheme, themeController } = useThemeContext();
  const { getBrandsBySubcategory, isLoadingProducts } = useProducts();

  // Buscar marcas que têm produtos nesta subcategoria
  const brands = getBrandsBySubcategory(subcategoryId);

  // Cor baseada na categoria pai
  const getCategoryColor = (categoryName: string): string => {
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('gás') || lowerName.includes('gas')) return dynamicTheme.colors.primary;
    if (lowerName.includes('água') || lowerName.includes('agua')) return dynamicTheme.colors.blue;
    return dynamicTheme.colors.secondary;
  };

  const categoryColor = getCategoryColor(parentCategoryName);

  const handleBrandSelect = (brand: any) => {
    navigate('SearchResults', {
      parentCategoryId,
      parentCategoryName,
      subcategoryId,
      subcategoryName,
      brandId: brand.partner_id,
      brandName: brand.branch_name
    });
  };

  // Se não houver marcas, ir direto para produtos (sem filtro de marca)
  useEffect(() => {
    if (!isLoadingProducts && brands.length === 0) {
      console.log('⚠️ Nenhuma marca encontrada, indo direto para produtos');
      navigate('SearchResults', {
        parentCategoryId,
        parentCategoryName,
        subcategoryId,
        subcategoryName,
        brandId: undefined, // Sem filtro de marca
        brandName: 'Todas as marcas'
      });
    }
  }, [brands.length, isLoadingProducts]);

  return (
    <SafeAreaView style={themeController(styles.container)} edges={['top']}>
      <View style={[
        themeController(styles.headerContainer),
        { backgroundColor: categoryColor }
      ]}>
        <Header backButton onPressBackButton={goBack}>
          <Text style={themeController(styles.headerTitle)}>
            {subcategoryName}
          </Text>
        </Header>
      </View>

      <ScrollView
        style={themeController(styles.content)}
        showsVerticalScrollIndicator={false}
      >
        <Text style={themeController(styles.subtitle)}>
          Escolha a marca
        </Text>

        {isLoadingProducts ? (
          <View style={themeController(styles.loadingContainer)}>
            <ActivityIndicator size="large" color={categoryColor} />
            <Text style={themeController(styles.loadingText)}>
              Carregando marcas...
            </Text>
          </View>
        ) : brands.length === 0 ? (
          <View style={themeController(styles.emptyContainer)}>
            <MaterialCommunityIcons
              name="store-off"
              size={64}
              color={dynamicTheme.colors.textLight}
            />
            <Text style={themeController(styles.emptyText)}>
              Nenhuma marca disponível para esta categoria
            </Text>
          </View>
        ) : (
          <View style={themeController(styles.brandsContainer)}>
            {brands.map((brand) => (
              <TouchableOpacity
                key={brand.partner_id}
                style={[
                  themeController(styles.brandCard),
                  { borderColor: categoryColor }
                ]}
                onPress={() => handleBrandSelect(brand)}
                activeOpacity={0.7}
              >
                {brand.avatar ? (
                  <Image
                    source={{ uri: brand.avatar }}
                    style={themeController(styles.brandLogo)}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={[
                    themeController(styles.brandLogoPlaceholder),
                    { backgroundColor: categoryColor + '15' }
                  ]}>
                    <MaterialCommunityIcons
                      name="store"
                      size={40}
                      color={categoryColor}
                    />
                  </View>
                )}
                <Text style={[
                  themeController(styles.brandName),
                  { color: categoryColor }
                ]}>
                  {brand.branch_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BrandSelection;

