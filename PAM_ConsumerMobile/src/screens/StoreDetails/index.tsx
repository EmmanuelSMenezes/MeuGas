import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { styles } from "./styles";
import { Card } from "../../components/Shared";
import { BlueHeader } from "../../components/BlueHeader";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { globalStyles } from "../../styles/globalStyles";
import Tabs from "./components/Tabs";
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { usePartner } from "../../hooks/PartnerContext";
import { IStoreDetails } from "../../interfaces/Store";
import Loading from "../../components/Loading";
import { useThemeContext } from "../../hooks/themeContext";

interface RouteParams extends RouteProp<ParamListBase> {
  params: {
    branch_id: string;
  };
}

const StoreDetails: React.FC = () => {
  const [storeDetails, setStoreDetails] = useState<IStoreDetails>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [showFloatButton, setShowFloatButton] = useState<boolean>(false);

  const route = useRoute<RouteParams>();

  const { branch_id } = route.params;
  const { dynamicTheme, themeController } = useThemeContext();

  const { getStore } = usePartner();
  const { navigate } = useNavigation();

  const productListRef = useRef(null);

  const onLoadMoreStoreProducts = async (filter?: string) => {
    setIsLoading(true);
    const {
      product: { products },
    } = await getStore(branch_id, filter, currentPage + 1, 12);

    setStoreDetails((oldProducts) => {
      return {
        ...oldProducts,
        products: oldProducts.product.products.concat(products),
      };
    });
    setCurrentPage((page) => page + 1);
    setIsLoading(false);
  };

  const onGetStoreProducts = async () => {
    const products = await getStore(branch_id);

    setStoreDetails(products);
    setIsLoading(false);
  };

  useEffect(() => {
    onGetStoreProducts();
  }, []);

  if (!storeDetails) return <Loading />;
  return (
    <View style={styles.mainContainer}>
      <BlueHeader title={storeDetails?.branch_name || "Loja"} />
      {showFloatButton && (
        <TouchableOpacity
          style={themeController(styles.floatButton)}
          onPress={() => {
            productListRef.current
              .getScrollResponder()
              .scrollTo({ x: 0, y: 0, animated: true });
          }}
        >
          <Ionicons name="arrow-up" size={32} color={theme.colors.white} />
        </TouchableOpacity>
      )}
      <FlatList
        ref={productListRef}
        data={storeDetails?.product.products}
        onScroll={(scroll) => {
          if (scroll.nativeEvent.contentOffset.y >= 190 && !showFloatButton) {
            setShowFloatButton(true);
          } else if (
            scroll.nativeEvent.contentOffset.y < 190 &&
            showFloatButton
          ) {
            setShowFloatButton(false);
          }
        }}
        ListHeaderComponent={
          <>
            <View style={themeController(styles.storeProfileContainer)}>
              {storeDetails.avatar ? (
                <Image
                  style={styles.itemImage}
                  source={{ uri: storeDetails.avatar }}
                  resizeMode="cover"
                />
              ) : (
                <View style={themeController(styles.emptyImageContainer)}>
                  <Feather
                    name="image"
                    size={42}
                    color={theme.colors.primary}
                  />
                </View>
              )}
              <View style={themeController(styles.storeData)}>
                <Text
                  style={themeController(styles.storeTitle)}
                  numberOfLines={2}
                >
                  {storeDetails.branch_name}
                </Text>
                <View style={themeController(styles.ratingsContainer)}>
                  {/* <Text style={themeController(styles.storeCategory)}>
                    {storeDetails.ordersNumbers === 0
                      ? "Nenhuma venda"
                      : `${storeDetails.ordersNumbers} venda(s)`}{" "}
                    -
                  </Text> */}
                  <View style={themeController(styles.storeRating)}>
                    <Octicons
                      name="star-fill"
                      size={12}
                      color={theme.colors.gold}
                    />
                    <Text style={themeController(styles.storeRatingText)}>
                      {storeDetails.ratings}
                    </Text>
                  </View>
                </View>

                {/* <TouchableOpacity style={styles.storeChatButton} onPress={() => navigate('Chat', partner)}>
                  <Ionicons name="chatbubble-ellipses-outline" size={18} color={theme.colors.primary} />
                  <Text style={styles.storeChatButtonText}>Chat</Text>
                </TouchableOpacity> */}
              </View>
            </View>
            <Tabs />
          </>
        }
        ListEmptyComponent={
          !isLoading && (
            <Text style={themeController(globalStyles.listEmpty)}>
              Esta loja não possui itens
            </Text>
          )
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
        numColumns={2}
        columnWrapperStyle={themeController(styles.listColumnsContainer)}
        contentContainerStyle={themeController(styles.listContainer)}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.4}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd === 0) return;

          if (
            storeDetails?.product.pagination?.totalPages >= currentPage &&
            !isLoading
          ) {
            onLoadMoreStoreProducts();
          }
        }}
        keyExtractor={(item) => item.product_id}
        renderItem={({ item }) => (
          <Card
            item={item}
            favorited={false}
            style={themeController(styles.cardSize)}
            onPress={() =>
              navigate("ItemDetails", { product_id: item.product_id })
            }
          />
        )}
      />
    </View>
  );
};

export default StoreDetails;
