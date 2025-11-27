import React, { SetStateAction, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { Card, Header, InputSearch, StoreCard } from "../../components/Shared";
import { styles } from "./styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParams } from "../../interfaces/RouteTypes";
import { MaterialIcons, Entypo, AntDesign } from "@expo/vector-icons";
import ModalFilter from "../../components/ModalFilter";
import { theme } from "../../styles/theme";
import { useOffer } from "../../hooks/OfferContext";
import {
  IBranch,
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

const SearchResults: React.FC = () => {
  const { navigate } = useNavigation();
  const route = useRoute();
  const { categoryType, partnerId, brandName } = route.params as {
    categoryType?: string;
    partnerId?: string;
    brandName?: string;
  };
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
    const foundProducts = await getFilteredProducts();

    setProductsFound(foundProducts);
  };

  const getStores = async (order?: StoreOrderOptions, sort?: TSortOptions) => {
    const branches = await getFilteredStores(order, sort);

    // Filtrar por partnerId se fornecido
    if (partnerId && branches?.branches) {
      const filteredBranches = branches.branches.filter(
        branch => branch.partner_id === partnerId
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

  return (
    <View style={themeController(globalStyles.container)}>
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

      <Header backButton onPressBackButton={() => goBack()}>
        {brandName ? (
          <Text style={themeController(globalStyles.title)}>{brandName}</Text>
        ) : (
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
        )}
      </Header>

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
  );
};

export default SearchResults;
