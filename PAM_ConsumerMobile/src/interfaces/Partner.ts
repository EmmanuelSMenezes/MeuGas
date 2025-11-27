
import { Pagination } from "./Utils";
export interface Branch {
  branch_id: string;
  branch_name: string;
  document: string;
  address: {
    address_id: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    zip_code: string;
    latitude: string;
    longitude: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    active: boolean;
  };
  ratings: number;
}

export interface Partner {
  admin_id: string;
  partner_id: string;
  legal_name: string;
  fantasy_name: string;
  document: string;
  email: string;
  phone_number: string;
  branch: Branch[];
  user_id: string;
  avatar: string;
  active?: boolean;
  identifier: number;
}

export interface PartnerList {
  pagination: Pagination;
  partners: Partner[];
}

export interface PartnerOrder {
  branch_id: string;
  branch_name: string;
  fantasy_name: string;
  identifier: number;
  partner_id: string;
  user_id: string;
  avatar?: string;
  active?: string;
}
