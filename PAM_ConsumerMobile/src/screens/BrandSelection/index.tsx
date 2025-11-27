import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import { useThemeContext } from '../../hooks/themeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { useOffer } from '../../hooks/OfferContext';

interface Brand {
  partner_id: string;
  fantasy_name: string;
  logo_url?: string;
}

const BrandSelection: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const { categoryType } = route.params as { categoryType: string };
  const { dynamicTheme, themeController } = useThemeContext();
  const { getPartnersByCategory } = useOffer();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryInfo = {
    gas: {
      name: 'Gás',
      color: dynamicTheme.colors.primary,
    },
    water: {
      name: 'Água',
      color: dynamicTheme.colors.blue,
    }
  };

  const currentCategory = categoryInfo[categoryType as keyof typeof categoryInfo];

  useEffect(() => {
    loadBrands();
  }, [categoryType]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      // Aqui você vai buscar as marcas do backend filtradas por categoria
      // Por enquanto, vou usar dados mockados
      const mockBrands: Brand[] = [
        { partner_id: '1', fantasy_name: 'Ultragaz', logo_url: 'https://meugas.app/images/logo.png' },
        { partner_id: '2', fantasy_name: 'Liquigás', logo_url: 'https://meugas.app/images/logo.png' },
        { partner_id: '3', fantasy_name: 'Supergasbras', logo_url: 'https://meugas.app/images/logo.png' },
        { partner_id: '4', fantasy_name: 'Consigaz', logo_url: 'https://meugas.app/images/logo.png' },
      ];
      setBrands(mockBrands);
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandSelect = (brand: Brand) => {
    navigate('SearchResults', { 
      categoryType,
      partnerId: brand.partner_id,
      brandName: brand.fantasy_name
    });
  };

  return (
    <SafeAreaView style={themeController(styles.container)} edges={['top']}>
      <View style={[
        themeController(styles.headerContainer),
        { backgroundColor: currentCategory.color }
      ]}>
        <Header backButton onPressBackButton={goBack}>
          <Text style={themeController(styles.headerTitle)}>
            {currentCategory.name}
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

        {loading ? (
          <View style={themeController(styles.loadingContainer)}>
            <ActivityIndicator size="large" color={currentCategory.color} />
          </View>
        ) : (
          <View style={themeController(styles.brandsContainer)}>
            {brands.map((brand) => (
              <TouchableOpacity
                key={brand.partner_id}
                style={[
                  themeController(styles.brandCard),
                  { borderColor: currentCategory.color }
                ]}
                onPress={() => handleBrandSelect(brand)}
                activeOpacity={0.7}
              >
                {brand.logo_url && (
                  <Image
                    source={{ uri: brand.logo_url }}
                    style={themeController(styles.brandLogo)}
                    resizeMode="contain"
                  />
                )}
                <Text style={[
                  themeController(styles.brandName),
                  { color: currentCategory.color }
                ]}>
                  {brand.fantasy_name}
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

