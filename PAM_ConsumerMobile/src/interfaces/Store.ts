import { Pagination } from "./Utils";

export interface Store {
  id: number;
  name: string;
  document: string;
  address: string;
  category: string;
  image?: string;
}

export interface IStoreCategory {
  category_id: string;
  identifier?: number;
  description: string;
  category_parent_name: string;
  category_parent_id: string;
}

export interface IStoreProduct {
  product_id: string;
  identifier?: number;
  name: string;
  price: number;
  image_default?: string;
  ordersnumbers?: number;
  url: string;
  ratings: number;
  categories: IStoreCategory[];
}

export interface IStoreDetails {
  branch_id: string;
  branch_name: string;
  partner_id: string;
  ratings: number;
  avatar: string;
  product: {
    products: IStoreProduct[];
    pagination: Pagination;
  };
  address: {
    address_id: string,
    street: string,
    number: string,
    complement: string,
    district: string,
    city: string,
    state: string,
    zip_code: string,
    active: boolean,
    created_by: string,
    created_at: string,
    updated_by: string,
    updated_at: string,
    latitude: string,
    longitude: string
  }
}
