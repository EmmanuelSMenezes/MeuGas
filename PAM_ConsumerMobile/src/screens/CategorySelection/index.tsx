import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { useThemeContext } from '../../hooks/themeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';

const CategorySelection: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const { dynamicTheme, themeController } = useThemeContext();

  const categories = [
    {
      id: 'gas',
      name: 'Gás',
      icon: 'fire',
      color: dynamicTheme.colors.primary,
      description: 'Botijões de gás para sua casa ou empresa'
    },
    {
      id: 'water',
      name: 'Água',
      icon: 'water',
      color: dynamicTheme.colors.blue,
      description: 'Galões de água mineral'
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    navigate('BrandSelection', { categoryType: categoryId });
  };

  return (
    <SafeAreaView style={themeController(styles.container)} edges={['top']}>
      <View style={themeController(styles.headerContainer)}>
        <Header backButton onPressBackButton={goBack}>
          <Text style={themeController(styles.headerTitle)}>
            Escolha uma categoria
          </Text>
        </Header>
      </View>

      <ScrollView 
        style={themeController(styles.content)}
        showsVerticalScrollIndicator={false}
      >
        <Text style={themeController(styles.subtitle)}>
          O que você precisa hoje?
        </Text>

        <View style={themeController(styles.categoriesContainer)}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                themeController(styles.categoryCard),
                { borderColor: category.color }
              ]}
              onPress={() => handleCategorySelect(category.id)}
              activeOpacity={0.7}
            >
              <View style={[
                themeController(styles.iconContainer),
                { backgroundColor: category.color + '15' }
              ]}>
                <MaterialCommunityIcons
                  name={category.icon as any}
                  size={64}
                  color={category.color}
                />
              </View>
              
              <Text style={[
                themeController(styles.categoryName),
                { color: category.color }
              ]}>
                {category.name}
              </Text>
              
              <Text style={themeController(styles.categoryDescription)}>
                {category.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategorySelection;

