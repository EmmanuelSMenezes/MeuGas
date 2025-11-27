import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import EmptyImage from "../../components/EmptyImage";
import { RootStackParams } from "../../interfaces/RouteTypes";
import { styles } from "./styles";
import { Feather } from "@expo/vector-icons";
import {
  ParamListBase,
  RouteProp,
  useIsFocused,
  useNavigation,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import { theme } from "../../styles/theme";
import Button from "../../components/Button";
import { useCart } from "../../hooks/CartContext";
import Carousel from "react-native-reanimated-carousel";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { formatPrice } from "../../utils/formatPrice";
import Loading from "../../components/Loading";
import { useGlobal } from "../../hooks/GlobalContext";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { removeTagsP } from "../../utils/formatRemoveTagsP";
import { IProduct } from "../../interfaces/Catalog";
import { useCatalog } from "../../hooks/CatalogContext";
import { useOffer } from "../../hooks/OfferContext";
import UnavailableStoreModal from "../Shared/UnavailableStoreModal";
import { useThemeContext } from "../../hooks/themeContext";

interface RouteParams extends RouteProp<ParamListBase> {
  params: {
    product_id: string;
  };
}

const ItemDetails: React.FC = () => {
  const route = useRoute<RouteParams>();
  const { product_id } = route.params;

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { goBack, navigate } = useNavigation();
  const { openAlert, closeAlert } = useGlobal();
  const { getStoreIsAvailable } = useOffer();
  const { getProduct } = useCatalog();
  const { addItem, cartBranch, clearCart } = useCart();
  const { dynamicTheme, themeController } = useThemeContext();

  const [productDetails, setProductDetails] = useState<IProduct>();
  const [quantity, setQuantity] = useState<number>(1);

  const [showUnavailableStoreModal, setShowUnavailableStoreModal] =
    useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(
    productDetails?.product?.images?.length > 0
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselRef = useRef(null);

  const handleAddItemToCart = async () => {
    const isAvailable = await getStoreIsAvailable(productDetails?.branch_id);

    if (!isAvailable) {
      setShowUnavailableStoreModal(true);
      return;
    }

    const addItemData = {
      ...productDetails,
      quantity: quantity,
    };

    if (
      cartBranch?.branch_id &&
      cartBranch?.branch_id !== productDetails?.branch_id
    ) {
      openAlert({
        title: "Lojas diferentes",
        description:
          "Você possui itens no carrinho de outra(s) loja(s), deseja descartar-lo(s) para adicionar este item?",
        type: "warning",
        buttons: {
          onConfirm: async () => {
            await clearCart();
            addItem(addItemData);
            setQuantity(1);
          },
        },
      });
    } else {
      addItem(addItemData);
      setQuantity(1);
    }
  };

  const handleChangeQuantity = (operation: number) =>
    setQuantity(quantity + operation);

  const getProductDetails = async () => {
    const product = await getProduct(product_id);

    setProductDetails(product);
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  const carouselWidth = Dimensions.get("window").width;

  if (!productDetails) return <Loading />;
  return (
    <View style={themeController(styles.container)}>
      <UnavailableStoreModal
        title="Loja indisponível"
        description="No momento, esta loja se encontra indisponível."
        isVisible={showUnavailableStoreModal}
        setIsVisible={setShowUnavailableStoreModal}
      />
      <ScrollView>
        <View style={themeController(styles.headerContainer)}>
          <TouchableOpacity
            style={themeController(styles.headerButtonShadow)}
            onPress={() => goBack()}
          >
            <Feather
              name="chevron-left"
              size={26}
              color={dynamicTheme.colors.primary}
            />
          </TouchableOpacity>
        </View>
        <View>
          {productDetails?.product?.images?.length > 0 ? (
            <Carousel
              ref={carouselRef}
              loop
              snapEnabled
              pagingEnabled
              vertical={false}
              width={carouselWidth}
              height={carouselWidth / 1.1}
              autoPlay={false}
              enabled={productDetails?.product?.images?.length > 1}
              data={productDetails?.product?.images}
              onSnapToItem={(index) => setCurrentImageIndex(index)}
              renderItem={({ index }) => {
                const currentImage =
                  productDetails?.product?.images[index]?.url;

                return (
                  <Image
                    onLoad={() => setImageIsLoading(false)}
                    style={styles.itemImage}
                    source={{ uri: currentImage }}
                  />
                );
              }}
            />
          ) : (
            <EmptyImage />
          )}

          {imageIsLoading && (
            <View style={themeController(styles.containerOverImage)}>
              <ActivityIndicator
                color={dynamicTheme.colors.primary}
                size={32}
              />
            </View>
          )}

          <View style={themeController(styles.paginationContainer)}>
            {productDetails?.product?.images?.map((_, index) => (
              <View
                key={index.toString()}
                style={[
                  themeController(styles.paginationDot),
                  currentImageIndex === index && {
                    backgroundColor: dynamicTheme.colors.primary,
                  },
                ]}
              />
            ))}
          </View>
        </View>
        <View style={themeController(styles.itemDetailsContainer)}>
          <Text style={themeController(styles.itemType)}>
            {productDetails?.product?.type === "s" ? "Serviço" : "Produto"}
          </Text>
          <Text style={themeController(styles.itemTitle)}>
            {productDetails?.product?.name}
          </Text>
          {/* <Text>Avaliação</Text> */}
          <View style={themeController(styles.descriptionContainer)}>
            <Text style={themeController(styles.itemSubtitle)}>Descrição</Text>
            <Text style={themeController(styles.itemDescription)}>
              {removeTagsP(productDetails?.product?.description)}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={themeController(styles.footerContainer)}>
        <View>
          <Text style={themeController(styles.itemPriceLabel)}>Preço</Text>
          <Text
            style={[
              themeController(styles.itemPrice),
              { color: dynamicTheme.colors.primary },
            ]}
          >
            {formatPrice(productDetails?.product?.price)}
          </Text>
        </View>

        <View style={themeController(styles.buttonsContainer)}>
          <View style={themeController(styles.operationsContainer)}>
            <TouchableOpacity
              style={themeController(styles.operationButton)}
              disabled={quantity === 1}
              onPress={() => handleChangeQuantity(-1)}
            >
              <AntDesign
                name="minus"
                size={18}
                color={
                  quantity === 1
                    ? dynamicTheme.colors.shadow
                    : dynamicTheme.colors.primary
                }
              />
            </TouchableOpacity>
            <Text style={themeController(styles.quantityText)}>{quantity}</Text>
            <TouchableOpacity
              style={themeController(styles.operationButton)}
              disabled={productDetails?.product?.type === "s"}
              onPress={() => setQuantity((oldQuantity) => oldQuantity + 1)}
            >
              <MaterialIcons
                name="add"
                size={20}
                color={
                  productDetails?.product?.type === "s"
                    ? dynamicTheme.colors.shadow
                    : dynamicTheme.colors.primary
                }
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              themeController(styles.addToCartButton),
              {
                backgroundColor: dynamicTheme.colors.primary,
              },
            ]}
            onPress={() => handleAddItemToCart()}
          >
            <Text style={[themeController(styles.addToCartButtonText)]}>
              Adicionar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ItemDetails;
