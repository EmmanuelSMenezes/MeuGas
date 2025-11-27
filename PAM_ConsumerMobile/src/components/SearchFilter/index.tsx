import React, { ReactNode, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "./styles";
import { AntDesign } from "@expo/vector-icons";
import { IProduct } from "../../interfaces/User";
import { theme } from "../../styles/theme";
import { useThemeContext } from "../../hooks/themeContext";

interface SearchProps {
  data: IProduct[];
  searchdata: string;
  setsearchdata?: (searchData: string) => void;
}

interface ItemProps {
  item?: IProduct;
}

const SearchFilter = ({ data, searchdata, setsearchdata }: SearchProps) => {
  const { dynamicTheme, themeController } = useThemeContext();

  const ProductCardSearch = ({ item }: ItemProps) => {
    return (
      <TouchableOpacity onPress={() => {}}>
        <View
          style={[
            themeController(styles.setflexviewdata),
            themeController(styles.searchtextlist),
          ]}
        >
          {/* <View>
            {item?.image}
          </View> */}
          <Text
            style={[
              themeController(styles.textboldstyle),
              { color: dynamicTheme.colors.primary },
            ]}
          >
            {item?.name}
          </Text>
          <View style={themeController(styles.textflexview)}>
            <Text style={themeController(styles.textboldstyletwo)}>
              {item?.text}
            </Text>
            <Text style={themeController(styles.textSpan)}>
              {item?.subname}
            </Text>
            <Text style={themeController(styles.textbold)}>
              R${item?.price}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyListMessage = () => {
    return (
      <Text style={themeController(styles.searchtextlist)}>
        Item não encontrado
      </Text>
    );
  };

  return (
    <View>
      <ScrollView style={themeController(styles.bgcolorwhiteset)} horizontal>
        <FlatList
          data={data?.filter((produto) =>
            produto.text.toLowerCase().includes(searchdata.toLowerCase())
          )}
          renderItem={ProductCardSearch}
          keyExtractor={(item) => item?.id?.toString()}
          ListEmptyComponent={EmptyListMessage}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
};
export default SearchFilter;
