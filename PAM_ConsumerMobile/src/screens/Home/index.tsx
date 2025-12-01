import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Fontisto } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { useThemeContext } from '../../hooks/themeContext';
import { useProducts } from '../../hooks/ProductContext';
import { useUser } from '../../hooks/UserContext';
import { useAuth } from '../../hooks/AuthContext';
import { useGlobal } from '../../hooks/GlobalContext';
import { Card } from '../../components/Shared';
import SelectLocationModal from '../Shared/SelectLocationModal';
import { ModernCategoryTabs } from '../../components/ModernCategoryTabs';
import { ProductListItem } from '../../components/ProductListItem';
import { ProductFilters, SortOption } from '../../components/ProductFilters';

const Home: React.FC = () => {
  const { navigate, replace } = useNavigation();
  const { dynamicTheme, themeController } = useThemeContext();
  const { defaultAddress, consumer } = useUser();
  const { user } = useAuth();
  const { openAlert, closeAlert } = useGlobal();
  const {
    getParentCategories,
    getSubcategories,
    getFilteredProducts,
    isLoadingProducts
  } = useProducts();

  const [selectedParentCategory, setSelectedParentCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isSelectLocationModalVisible, setIsSelectLocationModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('relevance');

  // Verificar autenticação
  useEffect(() => {
    if (!user?.user_id) {
      console.log("❌ Home - Usuário não autenticado, redirecionando para login");
      replace("PhoneAuth");
      return;
    }
    console.log("✅ Home - Usuário autenticado:", user.user_id);
  }, []);

  // Buscar categorias pai SEMPRE (antes de qualquer return condicional)
  const parentCategories = getParentCategories();

  // Buscar subcategorias da categoria pai selecionada
  const subcategories = selectedParentCategory
    ? getSubcategories(selectedParentCategory)
    : [];

  // Buscar produtos filtrados
  const rawProducts = selectedSubcategory
    ? getFilteredProducts({ subcategoryId: selectedSubcategory })
    : selectedParentCategory
    ? getFilteredProducts({ subcategoryId: selectedParentCategory })
    : [];

  // Log para debug
  console.log('🔍 Home - rawProducts:', rawProducts.length);
  if (rawProducts.length > 0) {
    console.log('🔍 Home - Primeiro produto:', JSON.stringify(rawProducts[0], null, 2));
  }

  // Ordenar produtos baseado no filtro selecionado
  const products = useMemo(() => {
    const sorted = [...rawProducts].filter(p => p && p.product_id); // Filtrar produtos válidos

    switch (selectedSort) {
      case 'price_asc':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));

      case 'price_desc':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));

      case 'rating':
        // IProductSearched tem estrutura plana
        return sorted.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));

      case 'delivery_time':
        // Ordenar por distância (menor distância = entrega mais rápida)
        // IProductSearched tem estrutura plana
        return sorted.sort((a, b) => (a.distance || 999) - (b.distance || 999));

      case 'relevance':
      default:
        // Ordenar por número de pedidos (mais vendidos primeiro)
        // IProductSearched tem estrutura plana
        return sorted.sort((a, b) => (b.ordersnumbers || 0) - (a.ordersnumbers || 0));
    }
  }, [rawProducts, selectedSort]);

  // Selecionar primeira categoria automaticamente
  useEffect(() => {
    if (parentCategories.length > 0 && !selectedParentCategory) {
      setSelectedParentCategory(parentCategories[0].category_id);
    }
  }, [parentCategories.length]);

  // Log para debug
  useEffect(() => {
    console.log("🔐 Home - user:", user);
    console.log("🔐 Home - consumer:", consumer);
    console.log("🔐 Home - user?.user_id:", user?.user_id);
    console.log("🔐 Home - consumer?.consumer_id:", consumer?.consumer_id);
    console.log("📍 Home - defaultAddress:", defaultAddress);
    console.log("📍 Home - defaultAddress?.street:", defaultAddress?.street);
    console.log("📦 Home - parentCategories.length:", parentCategories.length);
    console.log("📦 Home - isLoadingProducts:", isLoadingProducts);
  }, [user, consumer, defaultAddress, parentCategories.length, isLoadingProducts]);

  // Se não estiver autenticado, não renderiza nada
  // Verificamos apenas se o user existe, pois usuários novos podem não ter consumer ainda
  if (!user?.user_id) {
    console.log("❌ Home - Usuário não autenticado, mostrando tela de login");
    return (
      <SafeAreaView style={themeController(styles.container)} edges={['top']}>
        <View style={themeController(styles.loadingContainer)}>
          <MaterialCommunityIcons
            name="account-alert"
            size={64}
            color={dynamicTheme.colors.textLight}
          />
          <Text style={themeController(styles.loadingText)}>
            Faça login para continuar
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Cor baseada na categoria selecionada
  const getCategoryColor = (categoryName: string): string => {
    const lowerName = categoryName?.toLowerCase() || '';
    if (lowerName.includes('gás') || lowerName.includes('gas')) return '#FF6B35';
    if (lowerName.includes('água') || lowerName.includes('agua')) return '#4ECDC4';
    if (lowerName.includes('utensílio') || lowerName.includes('utensilio')) return '#95E1D3';
    if (lowerName.includes('serviço') || lowerName.includes('servico')) return '#F38181';
    return dynamicTheme.colors.primary;
  };

  // Ícone baseado na categoria
  const getCategoryIcon = (categoryName: string): string => {
    const lowerName = categoryName?.toLowerCase() || '';
    if (lowerName.includes('gás') || lowerName.includes('gas')) return 'fire';
    if (lowerName.includes('água') || lowerName.includes('agua')) return 'water';
    if (lowerName.includes('utensílio') || lowerName.includes('utensilio')) return 'silverware-fork-knife';
    if (lowerName.includes('serviço') || lowerName.includes('servico')) return 'tools';
    return 'package-variant';
  };

  const selectedParentCategoryData = parentCategories.find(c => c.category_id === selectedParentCategory);
  const categoryColor = selectedParentCategoryData
    ? getCategoryColor(selectedParentCategoryData.description)
    : dynamicTheme.colors.primary;

  // Verificar se não há produtos disponíveis
  const hasNoProducts = !isLoadingProducts && parentCategories.length === 0;

  // Renderizar tela de "Sem produtos disponíveis na região"
  if (hasNoProducts) {
    return (
      <SafeAreaView style={themeController(styles.container)} edges={['top']}>
        <SelectLocationModal
          isVisible={isSelectLocationModalVisible}
          setIsVisible={setIsSelectLocationModalVisible}
        />

        {/* Header com localização */}
        <TouchableOpacity
          onPress={() => setIsSelectLocationModalVisible(true)}
          style={themeController(styles.headerAddressContainer)}
        >
          <View style={themeController(styles.headerAddressContent)}>
            <Fontisto name="map-marker-alt" size={20} color={dynamicTheme.colors.primary} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={themeController(styles.headerAddressLabel)}>Entregar em</Text>
              <Text style={themeController(styles.headerAddressText)} numberOfLines={1}>
                {defaultAddress?.street || 'Selecione um endereço'}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color={dynamicTheme.colors.textDark}
            />
          </View>
        </TouchableOpacity>

        {/* Mensagem de região não atendida */}
        <View style={themeController(styles.emptyContainer)}>
          <MaterialCommunityIcons
            name="map-marker-off"
            size={80}
            color={dynamicTheme.colors.textLight}
          />
          <Text style={themeController(styles.emptyTitle)}>
            Ainda não atendemos sua região
          </Text>
          <Text style={themeController(styles.emptyDescription)}>
            Infelizmente ainda não temos parceiros disponíveis na sua localização.
          </Text>
          <Text style={themeController(styles.emptyDescription)}>
            Mas não se preocupe! Estamos trabalhando para encontrar os melhores parceiros e atendê-lo da melhor forma possível.
          </Text>
          <TouchableOpacity
            style={[themeController(styles.emptyButton), { backgroundColor: dynamicTheme.colors.primary }]}
            onPress={() => setIsSelectLocationModalVisible(true)}
          >
            <MaterialCommunityIcons name="map-marker-plus" size={20} color="#FFFFFF" />
            <Text style={themeController(styles.emptyButtonText)}>
              Alterar Endereço
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={themeController(styles.container)} edges={['top']}>
      <SelectLocationModal
        isVisible={isSelectLocationModalVisible}
        setIsVisible={setIsSelectLocationModalVisible}
      />

      {/* Header com localização */}
      <TouchableOpacity
        onPress={() => setIsSelectLocationModalVisible(true)}
        style={themeController(styles.headerAddressContainer)}
      >
        <View style={themeController(styles.headerAddressContent)}>
          <Fontisto name="map-marker-alt" size={16} color={dynamicTheme.colors.primary} />
          <View style={themeController(styles.headerAddressTextContainer)}>
            <Text style={themeController(styles.headerAddressLabel)}>Entregar em</Text>
            <Text style={themeController(styles.headerAddressText)} numberOfLines={1}>
              {defaultAddress?.street || 'Selecione um endereço'}
            </Text>
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-down" size={24} color={dynamicTheme.colors.textDark} />
      </TouchableOpacity>

      {/* Tabs de categorias */}
      {parentCategories.length > 0 ? (
        <View style={{ flex: 1 }}>
          {/* Modern Category Tabs */}
          <ModernCategoryTabs
            categories={parentCategories}
            selectedCategory={selectedParentCategory}
            onCategoryChange={(categoryId) => {
              setSelectedParentCategory(categoryId);
              setSelectedSubcategory(null);
            }}
            getCategoryColor={getCategoryColor}
            getCategoryIcon={getCategoryIcon}
          />

          {/* Tab Content */}
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {/* Subcategorias (se existirem) */}
            {subcategories.length > 0 && (
              <View style={themeController(styles.subcategoriesSection)}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={themeController(styles.subcategoriesContainer)}
                >
                  {subcategories.map((subcategory) => {
                    const isSelected = selectedSubcategory === subcategory.category_id;

                    return (
                      <TouchableOpacity
                        key={subcategory.category_id}
                        style={[
                          themeController(styles.subcategoryChip),
                          isSelected && { backgroundColor: categoryColor, borderColor: categoryColor }
                        ]}
                        onPress={() => setSelectedSubcategory(subcategory.category_id)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          themeController(styles.subcategoryText),
                          isSelected && themeController(styles.subcategoryTextSelected)
                        ]}>
                          {subcategory.description}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Filtros */}
            <ProductFilters
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />

            {/* Produtos */}
            <View style={themeController(styles.productsSection)}>
              <View style={styles.productHeader}>
                <Text style={themeController(styles.sectionSubtitle)}>
                  {products.length} {products.length === 1 ? 'produto' : 'produtos'}
                </Text>
                <Text style={themeController(styles.sortLabel)}>
                  {selectedSort === 'relevance' && 'Mais relevantes'}
                  {selectedSort === 'price_asc' && 'Menor preço'}
                  {selectedSort === 'price_desc' && 'Maior preço'}
                  {selectedSort === 'rating' && 'Melhor avaliados'}
                  {selectedSort === 'delivery_time' && 'Entrega mais rápida'}
                </Text>
              </View>

              {isLoadingProducts ? (
                <View style={themeController(styles.loadingContainer)}>
                  <ActivityIndicator size="large" color={categoryColor} />
                  <Text style={themeController(styles.loadingText)}>Carregando produtos...</Text>
                </View>
              ) : products.length === 0 ? (
                <View style={themeController(styles.emptyContainer)}>
                  <MaterialCommunityIcons
                    name="package-variant-closed"
                    size={64}
                    color={dynamicTheme.colors.textLight}
                  />
                  <Text style={themeController(styles.emptyText)}>
                    Nenhum produto disponível
                  </Text>
                </View>
              ) : (
                <View style={styles.productList}>
                  {products.map((item) => (
                    <ProductListItem
                      key={item.product_id}
                      item={item}
                      onPress={() => navigate('ItemDetails', { product_id: item.product_id })}
                    />
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={themeController(styles.loadingContainer)}>
          <ActivityIndicator size="large" color={dynamicTheme.colors.primary} />
          <Text style={themeController(styles.loadingText)}>Carregando categorias...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;
