import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeContext } from '../../hooks/themeContext';
import { styles } from './styles';

export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'delivery_time';

interface ProductFiltersProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedSort,
  onSortChange,
}) => {
  const { dynamicTheme, themeController } = useThemeContext();

  const filters: { id: SortOption; label: string; icon: string }[] = [
    { id: 'relevance', label: 'Relevância', icon: 'star-outline' },
    { id: 'delivery_time', label: 'Entrega', icon: 'clock-fast' },
    { id: 'price_asc', label: 'Menor preço', icon: 'arrow-down' },
    { id: 'price_desc', label: 'Maior preço', icon: 'arrow-up' },
    { id: 'rating', label: 'Avaliação', icon: 'star' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => {
          const isSelected = selectedSort === filter.id;

          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                themeController(styles.filterChip),
                isSelected && {
                  backgroundColor: dynamicTheme.colors.primary,
                  borderColor: dynamicTheme.colors.primary,
                },
              ]}
              onPress={() => onSortChange(filter.id)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={filter.icon as any}
                size={16}
                color={isSelected ? '#FFFFFF' : dynamicTheme.colors.textDark}
              />
              <Text
                style={[
                  themeController(styles.filterText),
                  isSelected && styles.filterTextSelected,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

