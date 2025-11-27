import React from "react";
import {
  View,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "./styles";
import { theme } from "../../styles/theme";
import { Rating } from "../Shared";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";

import Select from "../Select";

import { IModal } from "../../interfaces/ModalFilter";
import { useOffer } from "../../hooks/OfferContext";
import { formatDistance } from "../../utils/formatDistance";
import { useSearchFilter } from "../../hooks/SearchFilterContext";
import Accordion from "./components/Accordion";
import { Ionicons } from "@expo/vector-icons";
import { formatPrice } from "../../utils/formatPrice";
import { Switch } from "react-native-paper";
import { useThemeContext } from "../../hooks/themeContext";

const ModalFilter = ({
  modalVisible,
  setModalVisible,
  onGetFilteredProducts,
}: IModal) => {
  const {
    categories,
    setCategories,
    stores,
    setStores,
    ratings,
    setRatings,
    setStartPrice,
    endPrice,
    setEndPrice,
    distance,
    setDistance,
    sortPrice,
    setSortPrice,
    searchText,
    clearFilters,
    shippingFree,
    setShippingFree,
    maxPrice,
    categoryOptions,
    storeOptions,
    maxDistance,
    sortStoresBy,
    orderBy,
    setOrderBy,
  } = useSearchFilter();

  const { dynamicTheme, themeController } = useThemeContext();

  // const modalFilterSchema = yup.object().shape({
  //   category: yup.string(),
  //   partner: yup.string(),
  //   start_price: yup.number(),
  //   end_price: yup.number(),
  //   rating_value: yup.number(),
  //   latitude: yup.string(),
  //   logintude: yup.string(),
  //   delivery: yup.string(),
  //   sort_price: yup.string(),
  //   distance: yup.string(),
  // });

  // const { control, handleSubmit, setValue } = useForm<EvaluateModal>({
  //   resolver: yupResolver(modalFilterSchema),
  //   reValidateMode: "onChange",
  //   defaultValues: {
  //     rating_value: 0,
  //   },
  // });

  const submitProductsFilters = () => {
    onGetFilteredProducts();
    setModalVisible(!modalVisible);
  };

  if (!modalVisible) return;
  return (
    <View style={themeController(styles.modalContainer)}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={themeController(styles.content)}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={themeController(styles.modalHeader)}>
              <Text style={themeController(styles.title)}>Filtro</Text>
              {/* <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Feather name="x" size={20} color={theme.colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => clearFilters()}>
              <Text style={themeController(styles.clearButtonText)}>Limpar</Text>
            </TouchableOpacity> */}
            </View>

            <Text style={themeController(styles.subtitle)}>
              Você buscou por "{searchText}"
            </Text>

            {/* <Text style={globalthemeController(Styles.subtitle)}>Produtos</Text> */}

            <View style={themeController(styles.rowContainer)}>
              <Text style={themeController(styles.shippingFreeLabel)}>
                Frete grátis
              </Text>
              <Switch
                value={shippingFree}
                onValueChange={(value) => setShippingFree(value)}
                color={dynamicTheme.colors.primary}
              />
            </View>

            <Accordion title="Categorias" initialState={categories.length > 0}>
              <Select
                data={categoryOptions}
                onChange={(item) => {
                  setCategories(item ? [item] : []);
                }}
                value={categories[0]}
              />
            </Accordion>

            <Accordion title="Lojas" initialState={stores.length > 0}>
              <Select
                data={storeOptions}
                onChange={(item) => {
                  setStores(item ? [item] : []);
                }}
                value={stores[0]}
              />
            </Accordion>

            <Accordion title="Preço" initialState={true} rightTitle="">
              <Slider
                style={themeController(styles.slider)}
                minimumValue={0}
                maximumValue={maxPrice}
                step={1}
                onValueChange={(e) => {
                  setStartPrice(e === 0 ? "" : "0");
                  setEndPrice(e === 0 ? "" : e.toString());
                }}
                thumbTintColor={dynamicTheme.colors.primary}
                value={endPrice ? Number(endPrice) : 0}
                maximumTrackTintColor={dynamicTheme.colors.primary}
                minimumTrackTintColor={dynamicTheme.colors.primary}
              />
              {endPrice && (
                <View style={themeController(styles.rowContainer)}>
                  <Text style={themeController(styles.rowContainerLabel)}>
                    Até {formatPrice(Number(endPrice))}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      setStartPrice("");
                      setEndPrice("");
                    }}
                    style={themeController(styles.clearFieldFilterButton)}
                  >
                    <MaterialIcons
                      name="clear"
                      size={18}
                      color={dynamicTheme.colors.primary}
                    />
                    <Text
                      style={themeController(styles.clearFieldFilterButtonText)}
                    >
                      Limpar
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Accordion>

            <Accordion title="Ordenar por" rightTitle="" initialState={true}>
              <View style={themeController(styles.sortButtonsContainer)}>
                <TouchableOpacity
                  onPress={() => {
                    if (orderBy === "Price" && sortPrice === "Asc") {
                      setOrderBy(undefined);
                      setSortPrice("");
                    } else {
                      setOrderBy("Price");
                      setSortPrice("Asc");
                    }
                  }}
                  style={[
                    themeController(styles.orderPriceButton),
                    sortPrice === "Asc" &&
                      themeController(styles.orderPriceButtonSelected),
                  ]}
                >
                  <Ionicons
                    name="arrow-down-outline"
                    size={24}
                    color={
                      sortPrice === "Asc"
                        ? dynamicTheme.colors.white
                        : dynamicTheme.colors.gray
                    }
                  />
                  <Text
                    style={[
                      themeController(styles.orderPriceButtonText),
                      sortPrice === "Asc" &&
                        themeController(styles.orderPriceButtonTextSelected),
                    ]}
                  >
                    Menor preço
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (orderBy === "Price" && sortPrice === "Desc") {
                      setOrderBy(undefined);
                      setSortPrice("");
                    } else {
                      setOrderBy("Price");
                      setSortPrice("Desc");
                    }
                  }}
                  style={[
                    themeController(styles.orderPriceButton),
                    sortPrice === "Desc" &&
                      themeController(styles.orderPriceButtonSelected),
                  ]}
                >
                  <Ionicons
                    name="arrow-up-outline"
                    size={24}
                    color={
                      sortPrice === "Desc"
                        ? dynamicTheme.colors.white
                        : dynamicTheme.colors.gray
                    }
                  />
                  <Text
                    style={[
                      themeController(styles.orderPriceButtonText),
                      sortPrice === "Desc" &&
                        themeController(styles.orderPriceButtonTextSelected),
                    ]}
                  >
                    Maior preço
                  </Text>
                </TouchableOpacity>
              </View>
            </Accordion>

            <Accordion
              title="Avalições da loja"
              initialState={true}
              rightTitle=""
            >
              <View style={themeController(styles.rating)}>
                <Rating
                  value={Number(ratings) || 0}
                  onRate={(stars) =>
                    setRatings((oldStar) =>
                      oldStar === stars.toString() ? "" : stars.toString()
                    )
                  }
                />
              </View>
            </Accordion>

            <Accordion initialState={true} title="Distância" rightTitle="">
              <Slider
                style={themeController(styles.slider)}
                minimumValue={0}
                maximumValue={maxDistance}
                step={maxDistance < 1 ? maxDistance / 1000 : 1}
                onValueChange={(e) => {
                  setDistance(e === 0 ? "" : e.toString());
                }}
                thumbTintColor={dynamicTheme.colors.primary}
                value={distance ? Number(distance) : 0}
                maximumTrackTintColor={dynamicTheme.colors.primary}
                minimumTrackTintColor={dynamicTheme.colors.primary}
              />
              {distance && (
                <View style={themeController(styles.rowContainer)}>
                  <Text style={themeController(styles.rowContainerLabel)}>
                    {formatDistance(Number(distance))}
                  </Text>

                  <TouchableOpacity
                    onPress={() => setDistance("")}
                    style={themeController(styles.clearFieldFilterButton)}
                  >
                    <MaterialIcons
                      name="clear"
                      size={18}
                      color={dynamicTheme.colors.primary}
                    />
                    <Text
                      style={themeController(styles.clearFieldFilterButtonText)}
                    >
                      Limpar
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Accordion>

            <View style={themeController(styles.modalFooter)}>
              <View style={themeController(styles.modalFooterContent)}>
                <TouchableOpacity
                  onPress={() => clearFilters()}
                  style={[
                    themeController(styles.button),
                    themeController(styles.buttonSecondary),
                  ]}
                >
                  <Text
                    style={[
                      themeController(styles.buttonText),
                      themeController(styles.buttonSecondaryText),
                    ]}
                  >
                    Limpar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => submitProductsFilters()}
                  style={themeController(styles.button)}
                >
                  <Text style={themeController(styles.buttonText)}>
                    Concluir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default ModalFilter;
