import { IProduct } from "./Catalog";

export interface Purchase extends IProduct {
  quantity: number;
}

interface Payment {
  card_id?: string;
  security_code?: string;
  payment_options_id: string;
  amount_paid: number;
  installments: number;
}

export interface IPaymentMiniumPrice {
  pagseguro_value_minimum_id: string;
  partner_id: string;
  value_minimum_standard: number;
  value_minimum: number;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export type OrderStatus =
  | "Pendente"
  | "Recusado"
  | "Aceito"
  | "Em andamento"
  | "Concluído"
  | "Cancelado pelo cliente";

export interface Order {
  order_id: string;
  chat_id: string;
  order_number: number;
  amount: number;
  change: number;
  order_status_id: string;
  status_name: string;
  observation: string;
  consumer: {
    user_id: string;
    consumer_id: string;
    legal_name: string;
    fantasy_name: string;
    document: string;
    email: string;
    phone_number: string;
    street: string;
    city: string;
    state: string;
    number: string;
    complement: string;
    district: string;
    zip_code: string;
    latitude: string;
    longitude: string;
  };
  partner: {
    user_id: string;
    partner_id: string;
    identifier: number;
    legal_name: string;
    fantasy_name: string;
    document: string;
    email: string;
    phone_number: string;
    branch_id: string;
    branch_name: string;
    phone: string;
  };
  shipping: {
    shipping_company_id: string;
    company_name: string;
    document: string;
    address_id: string;
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
      created_at: string;
      updated_at: string;
      latitude: string;
      longitude: string;
    };
  };
  shipping_options: IShipping;
  order_itens: [
    {
      order_item_id: string;
      product_name: string;
      quantity: number;
      product_value: number;
      product_id: string;
      image_default: string;
      url: string;
    }
  ];
  payment_history: PaymentHistory[];
  payments: {
    payment_id: string;
    payment_options_id: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    installments: number;
    amount_paid: number;
    payment_situation_id: string;
    description: string;
    identifier: number;
    payment_local_id: string;
    payment_local_name: string;
  }[];
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface OrderHistory {
  orders: {
    order_id: string;
    order_number: number;
    amount: number;
    freight: number;
    orders_status_id: string;
    status_name: string;
    consumer: {
      user_id: string;
      consumer_id: string;
      legal_name: string;
    };
    partner: {
      user_id: string;
      partner_id: string;
      identifier: 0;
      fantasy_name: string;
      branch_id: string;
      branch_name: string;
    };
    order_itens: {
      order_item_id: string;
      product_name: string;
      quantity: number;
      product_value: number;
      product_id: string;
      image_default: string;
      url: string;
    }[];
    created_at: string;
    updated_at: string;
  }[];
  pagination: {
    totalPages: number;
    totalRows: number;
  };
}

export interface CreateOrder {
  order_itens: {
    product_id: string;
    product_name: string;
    quantity: number;
    product_value: number;
  }[];
  change: number;
  shipping_options: IShipping;
  amount: number;
  branch_id: string;
  address_id?: string;
  observation: string;
  shipping_company_id: string;
  payments: Payment[];
  created_by: string;
  consumer_id: string;
  address: {
    legal_name: string;
    fantasy_name: string;
    document: string;
    email: string;
    phone_number: string;
    street: string;
    city: string;
    state: string;
    number: string;
    complement: string;
    district: string;
    zip_code: string;
    latitude: string | number;
    longitude: string | number;
  };
}

export interface IOrderResponse extends Order {
  pagseguro?: {
    sucessPayment?: string;
    errorPayment?: {
      errorMessages: {
        code: string;
        message?: string;
        description: string;
        parameterName: string;
      }[];
    };
  };
}

export interface IPixResponse {
  created_at: string;
  customer: {
    email: string;
    name: string;
    tax_id: string;
  };
  id: string;
  links: {
    href: string;
    media: string;
    rel: string;
    type: string;
  }[];
  notification_urls: [];
  qr_codes: {
    amount: any[];
    arrangements: any[];
    expiration_date: string;
    id: string;
    links: any[];
    text: string;
  }[];
  reference_id: string;
}

interface IPay {
  payment_options_id: string;
  description: string;
  payment_local_id: string;
  payment_local_name: string;
}

export interface IShipping {
  actuation_area_config_id: string;
  actuation_area_shipping_id: string;
  delivery_option_id: string;
  name: string;
  value: number;
}

export interface OrderPayment {
  payment_options: IPay[];
  shipping_options: IShipping[];
}

export interface IOrderStatus {
  order_status_id: string;
  name: string;
}

export type PaymentStatusName =
  | "CANCELED"
  | "PAID"
  | "AUTHORIZED"
  | "IN_ANALYSIS"
  | "DECLINED"
  | "WAITING_PIX";

export type PaymentStatus = 0 | 1 | 2 | 3 | 4 | 5;

export interface PaymentHistory {
  id: string;
  created_at_payment: string;
  status_payment: PaymentStatus;
  status_payment_name: PaymentStatusName;
}

export interface PagSeguroSession {
  expires_at: number;
  session: string;
}
