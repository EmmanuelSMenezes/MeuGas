import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { Card, InputSearch, StoreCard } from "../../components/Shared";
import { BlueHeader } from "../../components/BlueHeader";
import { styles } from "./styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons, Entypo, AntDesign } from "@expo/vector-icons";
import ModalFilter from "../../components/ModalFilter";
import { useProducts } from "../../hooks/ProductContext";
import {
  IBranches,
  IOfferSearchedProducts,
} from "../../interfaces/Offer";
import {
  StoreOrderOptions,
  useSearchFilter,
} from "../../hooks/SearchFilterContext";
import SelectStoresOrderModal from "../Shared/SelectStoresOrderModal";
import { TSortOptions } from "../../interfaces/Utils";
import { goBack } from "../../routes/rootNavigation";
import { useThemeContext } from "../../hooks/themeContext";
import { useUser } from "../../hooks/UserContext";
import { useGlobal } from "../../hooks/GlobalContext";

const SearchResults: React.FC = () => {
  const { navigate } = useNavigation();
  const route = useRoute();
  const {
    parentCategoryId,
    parentCategoryName,
    subcategoryId,
    subcategoryName,
    brandId,
    brandName
  } = route.params as {
    parentCategoryId?: string;
    parentCategoryName?: string;
    subcategoryId?: string;
    subcategoryName?: string;
    brandId?: string;
    brandName?: string;
  };
  const { getFilteredProducts: getProductsFiltered } = useProducts();
  const {
    searchText,
    setSearchText,
    itensPerPage,
    getFilteredProducts,
    getMoreFilteredProducts,
    foundProductsCurrentPage,
    isLoading,
    setIsLoading,
    clearFilters,
    getFilteredStores,
    getMoreFilteredStores,
    foundStoresCurrentPage,
    setFoundProductsCurrentPage,
    setFoundStoresCurrentPage,
    getSearchFilters,
    clearStoreOrders,
    sortStoresBy,
    orderStoresBy,
  } = useSearchFilter();
  const { dynamicTheme, themeController } = useThemeContext();
  const { defaultAddress } = useUser();
  const { openAlert, closeAlert } = useGlobal();

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showStoresOrderModal, setShowStoresOrderModal] = useState(false);

  const [productsFound, setProductsFound] = useState<IOfferSearchedProducts>();
  const [storesFound, setStoresFound] = useState<IBranches>();

  const loadMoreProducts = async () => {
    setFoundProductsCurrentPage((page) => page + 1);
    setIsLoading(true);

    const products = await getMoreFilteredProducts();

    setProductsFound((oldProducts) => {
      return {
        ...oldProducts,
        products: oldProducts.products.concat(products),
      };
    });
  };

  const getProducts = async () => {
    // Usar ProductContext para filtrar produtos
    const filteredProducts = getProductsFiltered({
      parentCategoryId,
      subcategoryId,
      brandId,
    });

    setProductsFound({
      products: filteredProducts,
      pagination: {
        currentPage: 1,
        itensPerPage: filteredProducts.length,
        totalPages: 1,
        totalRows: filteredProducts.length,
      }
    });
  };

  const getStores = async (order?: StoreOrderOptions, sort?: TSortOptions) => {
    try {
      const branches = await getFilteredStores(order, sort);

      // Filtrar por brandId se fornecido
      if (brandId && branches?.branches) {
        const filteredBranches = branches.branches.filter(
          branch => branch.partner_id === brandId || branch.branch_id === brandId
        );
        setStoresFound({
          ...branches,
          branches: filteredBranches,
          pagination: {
            ...branches.pagination,
            totalRows: filteredBranches.length
          }
        });
      } else {
        setStoresFound(branches);
      }
    } catch (error) {
      console.error('Erro ao buscar revendas:', error);
      // Se não conseguir buscar revendas, continua sem elas
      setStoresFound({ branches: [], pagination: { totalRows: 0, currentPage: 1, totalPages: 0 } });
    }
  };

  const loadMoreStores = async () => {
    setIsLoading(true);
    setFoundStoresCurrentPage((page) => page + 1);

    const branches = await getMoreFilteredStores();

    setStoresFound((oldProducts) => {
      return {
        ...oldProducts,
        branches: oldProducts.branches.concat(branches),
      };
    });
  };

  const handleFindSearchResults = () => {
    setIsLoading(true);

    getSearchFilters();
    getStores();
    getProducts();

    setIsLoading(false);
  };

  useEffect(() => {
    handleFindSearchResults();
  }, []);

  useEffect(() => {
    return () => {
      clearFilters();
      clearStoreOrders();
      setSearchText("");
    };
  }, []);

  const searchHeaderComponent = brandName ? null : (
    <View style={themeController(styles.searchInputContainer)}>
      <InputSearch
        placeholder="Pesquisar itens"
        autoFocus={false}
        value={searchText}
        onPress={() => handleFindSearchResults()}
        onSubmitEditing={() => handleFindSearchResults()}
        onChangeText={(text) => setSearchText(text)}
      />
      <TouchableOpacity
        onPress={() => setShowStoresOrderModal(true)}
        style={themeController(styles.filterButton)}
      >
        <MaterialIcons
          name="sort"
          size={24}
          color={dynamicTheme.colors.primary}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={themeController(styles.filterButton)}
        onPress={() => setShowFilterModal((visible) => !visible)}
      >
        <AntDesign
          name="filter"
          size={22}
          color={dynamicTheme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <BlueHeader
        title={brandName || "Resultados"}
        centerComponent={searchHeaderComponent}
      />
      <ModalFilter
        setModalVisible={setShowFilterModal}
        modalVisible={showFilterModal}
        productsFilter={productsFound?.products}
        onGetFilteredProducts={getProducts}
      />
      <SelectStoresOrderModal
        isVisible={showStoresOrderModal}
        setIsVisible={setShowStoresOrderModal}
        onOrderStores={getStores}
      />

      <View style={styles.contentContainer}>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        data={[storesFound?.branches, productsFound?.products]}
        ListHeaderComponent={
          <>
            {!isLoading &&
            storesFound?.branches.length === 0 &&
            productsFound?.products.length === 0 ? (
              <Text style={themeController(globalStyles.listEmpty)}>
                Nenhum resultado encontrado
              </Text>
            ) : (
              storesFound?.branches.length > 0 && (
                <></>
                // <View style={styles.buttonsContainer}>
                //   <TouchableOpacity style={styles.showFiltersButton}>
                //     <MaterialIcons
                //       name="sort"
                //       size={24}
                //       color={theme.colors.primary}
                //     />
                //     <Text style={styles.showFiltersButtonText}>Ordenar</Text>
                //   </TouchableOpacity>

                //   <TouchableOpacity style={styles.showFiltersButton}>
                //     <MaterialIcons
                //       name="filter-list"
                //       size={26}
                //       color={theme.colors.primary}
                //     />
                //     <Text style={styles.showFiltersButtonText}>Filtrar</Text>
                //   </TouchableOpacity>
                // </View>
              )
            )}
          </>
        }
        ListFooterComponent={
          isLoading && (
            <View style={themeController(styles.loadingContainer)}>
              <ActivityIndicator
                size={24}
                color={dynamicTheme.colors.primary}
              />
            </View>
          )
        }
        extraData={[storesFound, productsFound]}
        onEndReachedThreshold={0.4}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd === 0) return;

          if (
            productsFound?.pagination?.totalPages > foundProductsCurrentPage &&
            !isLoading
          ) {
            loadMoreProducts();
          }
        }}
        renderItem={({ item, index }) => {
          if (!item) return;

          return (
            <>
              {index === 0 && storesFound?.branches.length > 0 ? (
                <Text style={themeController(styles.resultsFound)}>
                  {storesFound?.pagination?.totalRows} loja(s) encontrada(s)
                </Text>
              ) : (
                index === 1 &&
                productsFound?.products.length > 0 && (
                  <Text style={themeController(styles.resultsFound)}>
                    {productsFound?.pagination.totalRows} produto(s)
                    encontrado(s)
                  </Text>
                )
              )}
              <View style={themeController(styles.listColumnStyle)}>
                {item?.map((branchOrProduct) => {
                  if (branchOrProduct?.product_id) {
                    return (
                      <Card
                        key={branchOrProduct?.product_id}
                        item={branchOrProduct}
                        branchName={branchOrProduct?.branch_name}
                        favorited={false}
                        onPress={() => navigate("ItemDetails", branchOrProduct)}
                        style={themeController(styles.cardSize)}
                      />
                    );
                  }
                  if (branchOrProduct?.branch_id) {
                    return (
                      <StoreCard
                        key={branchOrProduct.branch_id}
                        item={branchOrProduct}
                        onPress={() =>
                          navigate("StoreDetails", branchOrProduct)
                        }
                        style={themeController(styles.storeCardSize)}
                      />
                    );
                  }
                })}
              </View>

              {index === 0 &&
                storesFound?.pagination.totalPages > foundStoresCurrentPage && (
                  <View style={themeController(styles.footer)}>
                    <TouchableOpacity
                      style={themeController(styles.showMoreStoresButton)}
                      disabled={isLoading}
                      onPress={() => loadMoreStores()}
                    >
                      {isLoading ? (
                        <ActivityIndicator
                          size={16}
                          color={dynamicTheme.colors.primary}
                        />
                      ) : (
                        <Entypo
                          name="chevron-small-down"
                          size={22}
                          color={dynamicTheme.colors.primary}
                        />
                      )}
                      <Text
                        style={themeController(styles.showMoreStoresButtonText)}
                      >
                        Ver mais
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
            </>
          );
        }}
      />
      </View>
    </View>
  );
};

export default SearchResults;
