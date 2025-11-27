import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import { theme } from '../../styles/theme';
import { useCart } from '../../hooks/CartContext';
import styles from './styles';
import { useThemeContext } from '../../hooks/themeContext';

const CartButton: React.FC = () => {

  const { navigate } = useNavigation();
  const { totalQuantity } = useCart();
  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();

  return (
    <View>
      <View style={themeController(styles.cartCountContainer)}>
        <Text style={[themeController(styles.cartCount)]}>{totalQuantity}</Text>
      </View>
      <TouchableOpacity onPress={() => navigate('Cart')}>
        <MaterialIcons name="shopping-cart" size={24} color={dynamicTheme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

export default CartButton;
