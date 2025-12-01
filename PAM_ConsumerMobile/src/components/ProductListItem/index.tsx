import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useThemeContext } from '../../hooks/themeContext';
import { useCart } from '../../hooks/CartContext';
import { formatPrice } from '../../utils/formatPrice';
import { IProductSearched } from '../../interfaces/Offer';
import { styles } from './styles';
import EmptyImage from '../EmptyImage';

interface ProductListItemProps {
  item: IProductSearched;
  onPress: () => void;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({ item, onPress }) => {
  const { dynamicTheme, themeController } = useThemeContext();
  const { addItem } = useCart();

  // Verificação de segurança
  if (!item || !item.product_id) {
    console.error('❌ ProductListItem - Item inválido:', item);
    return null;
  }

  // Calcular tempo de entrega baseado na distância (IProductSearched tem estrutura plana)
  const distance = item?.distance || 0;
  const deliveryTime = distance < 5 ? '20-30 min' : distance < 10 ? '30-40 min' : '40-60 min';

  // Avaliação da revenda
  const rating = item?.ratings || 0;

  // Nome da revenda
  const branchName = item?.branch_name || 'Revenda';

  // Número de pedidos
  const ordersnumbers = item?.ordersnumbers || 0;

  // Função para adicionar ao carrinho
  const handleAddToCart = (e: any) => {
    e.stopPropagation();

    console.log('➕ Adicionando ao carrinho:', item.name);

    // Criar um ID único para a imagem
    const imageId = `img_${item.product_id}`;

    addItem({
      branch_id: item.branch_id || '',
      branch_name: item.branch_name || '',
      product: {
        product_id: item.product_id,
        partner_id: '', // IProductSearched não tem partner_id
        image_default: imageId, // Usar o ID da imagem que vamos criar
        identifier: 0, // IProductSearched não tem identifier
        type: 'p', // IProductSearched não tem type
        name: item.name || '',
        description: item.description || '',
        price: item.price || 0,
        minimum_price: item.price || 0,
        images: item.url ? [{
          product_image_id: imageId,
          url: item.url,
        }] : [], // Criar array com a imagem do produto
        categories: (item.categories || []).map(cat => ({
          category_id: cat.category_id || '',
          identifier: 0,
          description: cat.description || '',
          category_parent_name: cat.category_parent_name || '',
          category_parent_id: cat.category_parent_id || '',
          created_by: '',
          updated_by: '',
          created_at: '',
          updated_at: '',
          active: true,
        })),
        active: true,
        created_by: '',
        created_at: '',
        updated_by: '',
        updated_at: '',
      },
      quantity: 1,
    });
  };

  return (
    <TouchableOpacity
      style={themeController(styles.container)}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Imagem do produto */}
      <View style={styles.imageContainer}>
        {item?.url ? (
          <Image
            style={styles.image}
            source={{ uri: item.url }}
            resizeMode="cover"
          />
        ) : (
          <EmptyImage style={styles.image} small />
        )}

        {/* Badge de vendidos OU Revenda Nova */}
        {ordersnumbers > 0 ? (
          <View style={themeController(styles.badge)}>
            <MaterialIcons name="local-fire-department" size={12} color="#FF6B35" />
            <Text style={themeController(styles.badgeText)}>
              {ordersnumbers > 99 ? '+99' : ordersnumbers}
            </Text>
          </View>
        ) : rating === 0 ? (
          <View style={[themeController(styles.badge), styles.newBadge]}>
            <MaterialCommunityIcons name="new-box" size={12} color="#4CAF50" />
            <Text style={[themeController(styles.badgeText), styles.newBadgeText]}>
              Nova
            </Text>
          </View>
        ) : null}
      </View>

      {/* Informações do produto */}
      <View style={styles.content}>
        {/* Nome do produto */}
        <Text numberOfLines={1} style={themeController(styles.productName)}>
          {item.name}
        </Text>

        {/* Nome da revenda */}
        <Text numberOfLines={1} style={themeController(styles.branchName)}>
          {branchName}
        </Text>

        {/* Informações adicionais */}
        <View style={styles.infoRow}>
          {/* Avaliação - Só mostra se rating > 0 */}
          {rating > 0 && (
            <>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="star" size={14} color="#FFB800" />
                <Text style={themeController(styles.infoText)}>
                  {rating.toFixed(1)}
                </Text>
              </View>
              <Text style={themeController(styles.separator)}>•</Text>
            </>
          )}

          {/* Tempo de entrega */}
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="clock-outline" size={14} color={dynamicTheme.colors.textLight} />
            <Text style={themeController(styles.infoText)}>
              {deliveryTime}
            </Text>
          </View>

          {/* Separador */}
          <Text style={themeController(styles.separator)}>•</Text>

          {/* Distância */}
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="map-marker" size={14} color={dynamicTheme.colors.textLight} />
            <Text style={themeController(styles.infoText)}>
              {distance.toFixed(1)} km
            </Text>
          </View>
        </View>

        {/* Preço */}
        <View style={styles.priceRow}>
          <Text style={themeController(styles.price)}>
            <Text style={themeController(styles.priceSymbol)}>R$ </Text>
            {formatPrice(item.price, '')}
          </Text>

          {/* Botão de adicionar */}
          <TouchableOpacity
            style={[themeController(styles.addButton), { backgroundColor: dynamicTheme.colors.primary }]}
            onPress={handleAddToCart}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

