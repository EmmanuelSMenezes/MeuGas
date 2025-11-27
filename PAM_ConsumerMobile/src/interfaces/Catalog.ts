interface IProductImage {
  product_image_id: string;
  url: string;
}

export interface IProduct {
  branch_id: string;
  branch_name: string;
  product: {
    product_id: string;
    partner_id: string;
    image_default: string;
    identifier: number;
    type: string;
    name: string;
    description: string;
    price: number;
    minimum_price: number;
    images: {
      product_image_id: string;
      url: string;
    }[];
    categories: {
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
    }[];
    active: boolean;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
  };
}

export interface ICatalog {
  products: IProduct[];
  pagination: {
    totalRows: number;
    totalPages: number;
  };
}
