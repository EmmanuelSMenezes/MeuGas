import React, { createContext, useContext, useEffect, useState } from "react";
import { Pagination, TSortOptions } from "../interfaces/Utils";
import { OrderProductsBy, useOffer } from "./OfferContext";
import {
  IBranch,
  IBranches,
  IOfferSearchedProducts,
  IProductSearched,
} from "../interfaces/Offer";

interface ISelectOption {
  item: string;
  label: string;
}

export type StoreOrderOptions = "Ratings" | "OrdersNumbers";

interface ISearchFilterContext {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  stores: string[];
  setStores: React.Dispatch<React.SetStateAction<string[]>>;
  ratings: string;
  setRatings: React.Dispatch<React.SetStateAction<string>>;
  startPrice: string;
  setStartPrice: React.Dispatch<React.SetStateAction<string>>;
  endPrice: string;
  setEndPrice: React.Dispatch<React.SetStateAction<string>>;
  distance: string;
  setDistance: React.Dispatch<React.SetStateAction<string>>;
  sortPrice: string;
  setSortPrice: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  foundProductsCurrentPage: number;
  setFoundProductsCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  getFilteredProducts: () => Promise<IOfferSearchedProducts>;
  getMoreFilteredProducts: () => Promise<IProductSearched[]>;
  itensPerPage: number;
  clearFilters: () => void;
  shippingFree: boolean;
  setShippingFree: React.Dispatch<React.SetStateAction<boolean>>;
  getFilteredStores: (
    order?: StoreOrderOptions,
    sort?: TSortOptions
  ) => Promise<IBranches>;
  getMoreFilteredStores: () => Promise<IBranch[]>;
  orderStoresBy: StoreOrderOptions;
  setOrderStoresBy: React.Dispatch<React.SetStateAction<StoreOrderOptions>>;
  sortStoresBy: TSortOptions;
  setSortStoresBy: React.Dispatch<React.SetStateAction<TSortOptions>>;
  foundStoresCurrentPage: number;
  setFoundStoresCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  maxDistance: number;
  setMaxDistance: React.Dispatch<React.SetStateAction<number>>;
  maxPrice: number;
  setMaxPrice: React.Dispatch<React.SetStateAction<number>>;
  categoryOptions: ISelectOption[];
  setCategoryOptions: React.Dispatch<React.SetStateAction<ISelectOption[]>>;
  storeOptions: ISelectOption[];
  setStoreOptions: React.Dispatch<React.SetStateAction<ISelectOption[]>>;
  getSearchFilters: () => void;
  clearStoreOrders: () => void;
  orderBy: OrderProductsBy;
  setOrderBy: React.Dispatch<React.SetStateAction<OrderProductsBy>>;
}

const SearchFilterContext = createContext<ISearchFilterContext>(
  {} as ISearchFilterContext
);

interface ISearchFilterProviderProps {
  children: React.ReactNode;
}

const SearchFilterProvider = ({ children }: ISearchFilterProviderProps) => {
  const { getProductsByLocation, getStoresByLocation, getFilterByLocation } =
    useOffer();

  // Product filters
  const [categories, setCategories] = useState<string[]>([]);
  const [stores, setStores] = useState<string[]>([]);
  const [ratings, setRatings] = useState<string>("");
  const [startPrice, setStartPrice] = useState<string>("");
  const [endPrice, setEndPrice] = useState<string>("");
  const [distance, setDistance] = useState<string>("");
  const [sortPrice, setSortPrice] = useState<TSortOptions>();
  const [orderBy, setOrderBy] = useState<OrderProductsBy>();
  const [shippingFree, setShippingFree] = useState<boolean>(false);

  // Store filters
  const [orderStoresBy, setOrderStoresBy] = useState<StoreOrderOptions>();
  const [sortStoresBy, setSortStoresBy] = useState<TSortOptions>();

  // Filter Rules
  const [maxDistance, setMaxDistance] = useState<number>(100);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [categoryOptions, setCategoryOptions] = useState<ISelectOption[]>([]);
  const [storeOptions, setStoreOptions] = useState<ISelectOption[]>([]);

  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [foundProductsCurrentPage, setFoundProductsCurrentPage] =
    useState<number>(1);
  const [foundStoresCurrentPage, setFoundStoresCurrentPage] =
    useState<number>(1);

  const itensPerPage = 8;

  const getMoreFilteredProducts = async (): Promise<IProductSearched[]> => {
    const categoryIds =
      categories?.length > 0 ? `'${categories.toString()}'` : "";
    const storeIds = stores?.length > 0 ? `'${stores.toString()}'` : "";

    try {
      const { products } = await getProductsByLocation(
        itensPerPage,
        foundProductsCurrentPage + 1,
        searchText,
        categoryIds,
        storeIds,
        ratings,
        distance,
        startPrice,
        endPrice,
        sortPrice,
        orderBy,
        shippingFree
      );

      return products;
    } catch (err) {
      // console.log("deu b.o aqui viu");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredProducts = async (): Promise<IOfferSearchedProducts> => {
    const categoryIds =
      categories?.length > 0 ? `'${categories.toString()}'` : "";
    const storeIds = stores?.length > 0 ? `'${stores.toString()}'` : "";

    setFoundProductsCurrentPage(1);

    try {
      const foundProducts = await getProductsByLocation(
        itensPerPage,
        1,
        searchText,
        categoryIds,
        storeIds,
        ratings,
        distance,
        startPrice,
        endPrice,
        sortPrice,
        orderBy,
        shippingFree
      );

      return foundProducts;
    } catch (err) {
      // console.log("deu b.o aqui viu");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredStores = async (
    order: StoreOrderOptions,
    sort: TSortOptions
  ): Promise<IBranches> => {
    setIsLoading(true);
    setFoundStoresCurrentPage(1);

    setOrderStoresBy(order);
    setSortStoresBy(sort);

    try {
      const branches = await getStoresByLocation(order, sort, searchText, 1, 4);

      return branches;
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const getMoreFilteredStores = async (): Promise<IBranch[]> => {
    try {
      const { branches } = await getStoresByLocation(
        orderStoresBy,
        sortStoresBy,
        searchText,
        foundStoresCurrentPage + 1,
        4
      );

      return branches;
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const getSearchFilters = async () => {
    clearFilters();

    const filters = await getFilterByLocation(searchText);

    const formattedCategories = filters?.categories?.map((category) => {
      return {
        item: category.category_id,
        label: category.description,
      };
    });

    const formattedStores = filters?.branchs?.map((store) => {
      return {
        item: store.branch_id,
        label: store.branch_name,
      };
    });

    setCategoryOptions(formattedCategories);
    setStoreOptions(formattedStores);
    setMaxDistance(filters?.distance_maximum);
    setMaxPrice(filters?.price_maximum);
  };

  const clearFilters = () => {
    setCategories([]);
    setStores([]);
    setRatings("");
    setStartPrice("");
    setEndPrice("");
    setDistance("");
    setSortPrice(null);
    setFoundProductsCurrentPage(1);
    setFoundStoresCurrentPage(1);
    setShippingFree(false);
  };

  const clearStoreOrders = () => {
    setOrderStoresBy(undefined);
    setSortStoresBy(undefined);
    setFoundStoresCurrentPage(1);
  };

  const contextValue = {
    categories,
    setCategories,
    stores,
    setStores,
    ratings,
    setRatings,
    startPrice,
    setStartPrice,
    endPrice,
    setEndPrice,
    distance,
    setDistance,
    sortPrice,
    setSortPrice,
    searchText,
    setSearchText,
    isLoading,
    setIsLoading,
    foundProductsCurrentPage,
    setFoundProductsCurrentPage,
    getFilteredProducts,
    getMoreFilteredProducts,
    itensPerPage,
    clearFilters,
    shippingFree,
    setShippingFree,
    getFilteredStores,
    getMoreFilteredStores,
    orderStoresBy,
    setOrderStoresBy,
    sortStoresBy,
    setSortStoresBy,
    foundStoresCurrentPage,
    setFoundStoresCurrentPage,
    maxDistance,
    setMaxDistance,
    maxPrice,
    setMaxPrice,
    categoryOptions,
    setCategoryOptions,
    storeOptions,
    setStoreOptions,
    getSearchFilters,
    clearStoreOrders,
    orderBy,
    setOrderBy,
  };

  return (
    <SearchFilterContext.Provider value={contextValue}>
      {children}
    </SearchFilterContext.Provider>
  );
};

const useSearchFilter = () => {
  const context = useContext(SearchFilterContext);

  return context;
};

export { useSearchFilter, SearchFilterProvider };
