import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Category {
  category_id: string;
  description: string;
}

interface ModernCategoryTabsProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string) => void;
  getCategoryColor?: (description: string) => string;
  getCategoryIcon?: (description: string) => string;
}

// Cor azul principal do segmented control
const TINT_COLOR = '#007AFF';

export const ModernCategoryTabs: React.FC<ModernCategoryTabsProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  if (categories.length === 0) {
    return null;
  }

  return (
    <View style={localStyles.container}>
      <View style={localStyles.segmentedContainer}>
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.category_id;
          const isFirst = index === 0;
          const isLast = index === categories.length - 1;

          return (
            <TouchableOpacity
              key={category.category_id}
              activeOpacity={0.7}
              onPress={() => onCategoryChange(category.category_id)}
              style={[
                localStyles.segment,
                isSelected && localStyles.segmentSelected,
                isFirst && localStyles.segmentFirst,
                isLast && localStyles.segmentLast,
              ]}
            >
              <Text
                style={[
                  localStyles.segmentText,
                  isSelected && localStyles.segmentTextSelected,
                ]}
              >
                {category.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  segmentSelected: {
    backgroundColor: TINT_COLOR,
    shadowColor: TINT_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentFirst: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  segmentLast: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  segmentTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

