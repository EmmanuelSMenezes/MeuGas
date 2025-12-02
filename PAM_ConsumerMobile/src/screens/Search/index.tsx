import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Text, View, FlatList } from "react-native";
import { styles } from "./styles";
import { BlueHeader } from "../../components/BlueHeader";
import { InputSearch } from "../../components/Shared";
import CategorySuggestion from "./components/CategorySuggestion";
import { useNavigation } from "@react-navigation/native";
import { useCatalog } from "../../hooks/CatalogContext";
import { Category } from "../../interfaces/Category";
import { Partner } from "../../interfaces/Partner";
import { useOffer } from "../../hooks/OfferContext";
import { useSearchFilter } from "../../hooks/SearchFilterContext";
import { useThemeContext } from "../../hooks/themeContext";

const Search: React.FC = () => {
  const [categoryId, setCategoryId] = useState<string>();
  const [category, setCategory] = useState<Category[]>({} as Category[]);
  const [subCategory, setSubCategory] = useState<Category[] | Partner[]>(
    {} as Category[] | Partner[]
  );
  const { navigate } = useNavigation();
  const { getCategory } = useCatalog();
  const { getStoresByLocation, getProductsByLocation } = useOffer();
  const { searchText, setSearchText } = useSearchFilter();
  const { dynamicTheme, themeController } = useThemeContext();

  const onGetCategories = async () => {
    const { categories, pagination } = await getCategory(undefined, 1, 10);

    const data = await getStoresByLocation();
    const reduced = [];

    categories?.forEach((item) => {
      const duplicated =
        reduced.findIndex((redItem) => {
          return (
            item.category_parent_id == redItem.category_parent_id ||
            item.category_parent_id == null
          );
        }) > -1;

      if (!duplicated) {
        reduced.push(item);
      }
    });
    setCategory(reduced);
    if (data?.branches.length > 0)
      setSubCategory([...categories, ...data.branches] as
        | Category[]
        | Partner[]);
    else setSubCategory(categories);
  };

  useEffect(() => {
    onGetCategories();
  }, []);

  const categoryMemo = useMemo(() => category, [category]);
  const subCategoryMemo = useMemo(() => subCategory, [subCategory]);

  // const productsCategory = categoryId
  //   ? subCategoryMemo?.filter(
  //       ({ category_parent_id }) => category_parent_id === categoryId
  //     )
  //   : subCategoryMemo;

  // const searchFilter = searchData
  //   ? productsCategory?.filter(({ description, fantasy_name }) =>
  //       (description || fantasy_name)
  //         ?.toLowerCase()
  //         ?.includes(searchData.toLowerCase())
  //     )
  //   : productsCategory;

  const searchInputComponent = (
    <View style={themeController(styles.searchInputContainer)}>
      <InputSearch
        placeholder="Pesquisar itens"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        onPress={() => navigate("SearchResults")}
        onSubmitEditing={() =>
          navigate("SearchResults")
        }
      />
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <BlueHeader title="Pesquisar" centerComponent={searchInputComponent} />

      <View style={styles.contentContainer}>
        {!searchText && categoryMemo && (
          <>
          <Text style={themeController(styles.title)}>Categorias</Text>
          <FlatList
            data={categoryMemo}
            keyExtractor={(item) => item?.category_id}
            // horizontal
            numColumns={2}
            columnWrapperStyle={themeController(styles.listColumnsContainer)}
            showsHorizontalScrollIndicator={false}
            style={{ flexShrink: 0 }}
            contentContainerStyle={themeController(styles.categoriesContainer)}
            onEndReached={({ distanceFromEnd }) => {
              if (distanceFromEnd === 0) return;
            }}
            renderItem={({ item, index }) =>{
              const lastItem = index === categoryMemo.length - 1;

              return(
              <>
                {!!item?.category_parent_id && (
                  <View style={{maxWidth: lastItem ? '50%' : '100%'}}>
                    <CategorySuggestion
                      id={item?.category_id}
                      text={item?.category_parent_name}
                      // active={item?.category_parent_id === categoryId}
                      onPress={() => {
                        setCategoryId((id) =>
                          id === item?.category_parent_id
                            ? undefined
                            : item?.category_parent_id
                        )
                        setSearchText(item.category_parent_name)
                        navigate("SearchResults")
                      }
                      }
                    />
                  </View>
                )}
              </>
            )}}
          />
          </>
        )}
      </View>

      {/* <FlatList
        data={searchFilter}
        keyExtractor={(item) => item?.category_id || item?.branch_id}
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ height: '100%', paddingBottom: 64 }}
        renderItem={({ item, index }) =>
          item?.branch_id ? (
            <StoreSuggestion
              onPress={() => handleSearchSuggestion(item?.branch_name)}
              item={item}
            />
          ) : (
            <ItemSuggestion
              onPress={() => handleSearchSuggestion(item?.description)}
              item={item}
            />
          )
        }
        ListEmptyComponent={<SearchNotFound search={searchData} />}
      /> */}
    </View>
  );
};

export default Search;
