import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { IBrands } from '../../../../interfaces/User';
import { ICategoryProps } from '../../../../interfaces/ModalFilter';
import CategorySuggestion from '../../../../screens/Search/components/CategorySuggestion';
import styles from '../../styles';
import Suggestion from '../Suggestions';

interface IProps {
  productsBrand?: IBrands[],
  selectedBrand: (name: string) => void,
  disableCategory: IBrands[],
  disableBrand: IBrands[]
}

const RenderBrand = ({productsBrand, selectedBrand, disableCategory, disableBrand}: IProps) => {
  return (
    <FlatList
      data={disableCategory?.length > 0 ? productsBrand.filter(type => type?.idCategory === Number(disableCategory)) : productsBrand}
      renderItem={({ item }: ICategoryProps) =>
      <Suggestion
      id={item.id.toString()}
      text={item.name}
      active={item.id === Number(disableBrand)}
      onPress={() => selectedBrand(item.name)}
    />
      }
      keyExtractor={item => item?.id?.toString()}
      horizontal
      ListEmptyComponent={<Text style={styles.span}>Nenhum item cadastrado nesta categoria</Text>}
      showsHorizontalScrollIndicator={false}
      style={{ flexShrink: 0 }}
      contentContainerStyle={styles.categoriesContainer}
    />
  );
}

export default RenderBrand;
