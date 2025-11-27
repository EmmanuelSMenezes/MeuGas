import React from 'react';
import { FlatList, View } from 'react-native';
import { ICategory, ICategoryProps } from '../../../../interfaces/ModalFilter';
import { IBrands } from '../../../../interfaces/User';
import CategorySuggestion from '../../../../screens/Search/components/CategorySuggestion';
import styles from '../../styles';
import { Button } from '../../../Shared';
import { theme } from '../../../../styles/theme';
import Suggestion from '../Suggestions';
import { Category } from '../../../../interfaces/Category';

interface IProps {
  suggestionsData?: ICategory[],
  selectedCategory: (id: number) => void,
  disableCategory: IBrands[]
}

const RenderCategory = ({ suggestionsData, selectedCategory, disableCategory }: IProps) => {
  return (
    <FlatList
      data={suggestionsData}
      renderItem={({ item }: ICategoryProps) =>
        <Suggestion
          id={item.id.toString()}
          text={item.text}
          active={item.id === Number(disableCategory)}
          onPress={() => selectedCategory(item.id)}
        />
      }
      keyExtractor={item => item?.id?.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexShrink: 0 }}
      contentContainerStyle={styles.categoriesContainer}
    />
  )
}

export default RenderCategory;
