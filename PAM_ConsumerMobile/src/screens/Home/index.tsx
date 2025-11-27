import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import { Card, StoreCard } from "../../components/Shared";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { Entypo, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useUser } from "../../hooks/UserContext";
import { useAuth } from "../../hooks/AuthContext";
import SelectLocationModal from "../Shared/SelectLocationModal";
import { useOffer } from "../../hooks/OfferContext";
import {
  IBranches,
  IOfferSearchedProducts,
  IProductSearched,
} from "../../interfaces/Offer";
import { useGlobal } from "../../hooks/GlobalContext";
import { mask } from "react-native-mask-text";
import { formatCityName } from "../../utils/formatCityName";
import { useCart } from "../../hooks/CartContext";
import { useThemeContext } from "../../hooks/themeContext";

const Home: React.FC = () => {
  
  const { notifPush } = useAuth();
  const { dynamicTheme, setDynamicTheme, themeController } = useThemeContext();
  const navigation = useNavigation();
  const { navigate } = navigation;
  const { consumer, addresses, getAllAddresses, defaultAddress } = useUser();
  const { getStoresByLocation, getProductsByLocation } = useOffer();
  const { currentAppTab } = useGlobal();
  const { loadSavedCart } = useCart();

  const [popularStores, setPopularStores] = useState<IBranches>();
  const [switchTab, setSwitchBar] = useState<IBranches>();
  const [isSelectLocationModalVisible, setIsSelectLocationModalVisible] =
    useState(false);
  const [mostPopularItems, setMostPopularItems] = useState<IProductSearched[]>(
    []
  );

  // const onGetNotifications = async () => {
  //   const data = await getAllNotifications(consumer.user_id);

  //   data?.map((item) => {
  //     if (item?.notification_id) notifPush(item?.title, item?.description, 5);
  //   });
  // };

  const onGetPopularPartners = async () => {
    const data = await getStoresByLocation();

    setPopularStores(data);
  };

  const onGetProdutcsRating = async () => {
    const { products } = await getProductsByLocation();

    products.sort((a, b) => b.ordersnumbers - a.ordersnumbers);
    setMostPopularItems(
      products.sort((a, b) => b.ordersnumbers - a.ordersnumbers)
    );
  };

  useEffect(() => {
    if (defaultAddress) {
      onGetPopularPartners();
      onGetProdutcsRating();
    }
  }, [defaultAddress, currentAppTab]);

  useEffect(() => {
    getAllAddresses();
    loadSavedCart();
    // onGetNotifications();
  }, []);

  return (
    <View style={themeController(styles.container)}>
      <SelectLocationModal
        isVisible={isSelectLocationModalVisible}
        setIsVisible={setIsSelectLocationModalVisible}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => setIsSelectLocationModalVisible(true)}
          style={themeController(
            themeController(styles.headerAddressContainer)
          )}
        >
          <View style={themeController(styles.headerAddressContent)}>
            <Fontisto
              name="map-marker-alt"
              size={18}
              color={dynamicTheme.colors.white}
            />
            <Text
              numberOfLines={1}
              style={[themeController(styles.headerAddressText)]}
            >
              {defaultAddress
                ? `${
                    defaultAddress.district && defaultAddress.district + " - "
                  }${formatCityName(defaultAddress.city)}, ${mask(
                    defaultAddress.zip_code,
                    "99999-999"
                  )}`
                : "Selecione um endereço"}
            </Text>
          </View>

          <Entypo
            name="chevron-small-down"
            size={20}
            color={theme.colors.white}
          />
        </TouchableOpacity>

        <View style={themeController(styles.content)}>
          {/* Botão para escolher categoria */}
          <TouchableOpacity
            style={themeController(styles.categoryButton)}
            onPress={() => navigate("CategorySelection")}
            activeOpacity={0.8}
          >
            <View style={themeController(styles.categoryButtonContent)}>
              <MaterialCommunityIcons
                name="fire"
                size={32}
                color={dynamicTheme.colors.primary}
              />
              <View style={themeController(styles.categoryButtonTextContainer)}>
                <Text style={themeController(styles.categoryButtonTitle)}>
                  Fazer Pedido
                </Text>
                <Text style={themeController(styles.categoryButtonSubtitle)}>
                  Gás ou Água
                </Text>
              </View>
            </View>
            <Entypo
              name="chevron-right"
              size={24}
              color={dynamicTheme.colors.primary}
            />
          </TouchableOpacity>

          <View>
            <Pressable style={themeController(styles.subtitleHeader)}>
              <Text style={themeController(styles.subtitle)}>Em destaque</Text>
              {/* <Text style={themeController(styles.seeMoreButton)}>Ver mais</Text> */}
            </Pressable>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={mostPopularItems}
              style={themeController(styles.itemsList)}
              contentContainerStyle={themeController(styles.itemsListContent)}
              renderItem={({ item }) => (
                <Card
                  item={item}
                  branchName={item?.branch_name}
                  onPress={() =>
                    navigate("ItemDetails", { product_id: item.product_id })
                  }
                  favorited={false}
                  style={themeController(styles.cardSize)}
                />
              )}
            />
          </View>

          <View>
            <Pressable style={themeController(styles.subtitleHeader)}>
              <Text style={themeController(styles.subtitle)}>
                Lojas mais populares
              </Text>
              {/* <Text style={themeController(styles.seeMoreButton)}>Ver mais</Text> */}
            </Pressable>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={popularStores?.branches.sort(
                (a, b) => b.ratings - a.ratings
              )}
              style={themeController(styles.itemsList)}
              contentContainerStyle={themeController(styles.itemsListContent)}
              renderItem={({ item }) => (
                <StoreCard
                  item={item}
                  onPress={() => navigate("StoreDetails", item)}
                  style={themeController(styles.storeCardSize)}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
