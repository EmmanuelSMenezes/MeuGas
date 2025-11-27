import { Category } from "./Category";
import { Pagination } from "./Utils";

export interface ICategory {
  category_id: string;
  identifier: number;
  description: string;
  category_parent_name: string;
  category_parent_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  active: boolean;
}

export interface IProductBranch {
  branch_id: string;
  branch_name: string;
  document: string;
  phone: string;
  partner_id: string;
  address: {
    address_id: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    zip_code: string;
    active: boolean;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    latitude: string;
    longitude: string;
  };
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  active: boolean;
  ratings: number;
  distance: number;
  avatar: string;
  ordersNumbers: number;
}

export interface IOfferProduct {
  product_id: string;
  identifier: number;
  name: string;
  description: string;
  image_default: string;
  url: string;
  price: number;
  type: string;
  categories: ICategory[];
  admin_id: string;
  images: [
    {
      product_image_id: string;
      url: string;
      created_by: string;
      created_at: string;
      updated_by: string;
      updated_at: string;
    }
  ];
  branch: IProductBranch;
}

export interface IOfferProducts {
  products: IOfferProduct[];
  pagination: Pagination;
}

export type IProductSearched = {
  branch_id: string;
  branch_name: string;
  distance: number;
  ratings: number;
  ordersnumbers: number;
  product_id: string;
  name: string;
  price: number;
  description: string;
  url: string;
  categories: {
    category_id: string;
    description: string;
    category_parent_name: string;
    category_parent_id: string;
  }[];
};

export interface IOfferSearchedProducts {
  products: IProductSearched[];
  pagination: Pagination;
}

export interface IBranch {
  branch_id: string;
  branch_name: string;
  partner_id: string;
  ratings: number;
  distance: number;
  avatar: string;
  ordersNumbers: number;
}

export interface IBranches {
  branches: IBranch[];
  pagination: Pagination;
}

export interface ISearchFilters {
  branchs: {
    branch_id: string;
    branch_name: string;
  }[];
  categories: {
    category_id: string;
    description: string;
  }[];
  price_maximum: number;
  distance_maximum: number;
}
