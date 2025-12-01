import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeContext } from '../../hooks/themeContext';
import { styles } from './styles';

interface Category {
  category_id: string;
  description: string;
}

interface ModernCategoryTabsProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string) => void;
  getCategoryColor: (description: string) => string;
  getCategoryIcon: (description: string) => string;
}

export const ModernCategoryTabs: React.FC<ModernCategoryTabsProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  getCategoryColor,
  getCategoryIcon,
}) => {
  const { dynamicTheme } = useThemeContext();

  const renderTab = (category: Category) => {
    const isSelected = selectedCategory === category.category_id;
    const color = getCategoryColor(category.description);
    const icon = getCategoryIcon(category.description);

    return (
      <TouchableOpacity
        key={category.category_id}
        onPress={() => onCategoryChange(category.category_id)}
        activeOpacity={0.7}
        style={[
          styles.tabCard,
          {
            backgroundColor: isSelected ? color : '#F5F5F5',
            borderColor: isSelected ? color : '#E0E0E0',
            shadowColor: isSelected ? color : '#000',
            shadowOpacity: isSelected ? 0.3 : 0.1,
            shadowRadius: isSelected ? 8 : 4,
            shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
            elevation: isSelected ? 8 : 2,
            transform: [{ scale: isSelected ? 1.02 : 1 }],
          },
        ]}
      >
        <View style={[
          styles.iconContainer,
          { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `${color}15` }
        ]}>
          <MaterialCommunityIcons
            name={icon as any}
            size={28}
            color={isSelected ? '#FFFFFF' : color}
          />
        </View>

        <Text
          style={[
            styles.tabText,
            { color: isSelected ? '#FFFFFF' : '#333333' }
          ]}
          numberOfLines={1}
        >
          {category.description}
        </Text>

        {isSelected && (
          <View style={[styles.selectedIndicator, { backgroundColor: '#FFFFFF' }]} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => renderTab(category))}
      </ScrollView>
    </View>
  );
};

