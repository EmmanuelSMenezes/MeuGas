import React, { ReactNode, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
export interface User {
  user_id: string;
  name: string;
  last_name: string;
  email: string;
  address: Address;
  cpf: string;
  phone: string;
  phone_verified: boolean;
  profile: {
    avatar: string;
    document: string;
    fullname: string;
    profile_id: string;
    user_id: string;
  };
  role: {
    active: true;
    description: string;
    role_id: string;
    tag: string;
  };
  role_id: string;
}

export interface Consumer {
  consumer_id: string;
  legal_name: string;
  fantasy_name: string;
  document: string;
  email: string;
  phone_number: string;
  user_id: string;
  default_address: string;
  addresses: Address[];
}

export interface ConsumerProps {
  legal_name: string;
  fantasy_name: string;
  document: string;
  email: string;
  phone_number: string;
  user_id: string;
  default_address?: string;
}

export interface Address {
  address_id: string;
  number: string;
  state: string;
  city: string;
  complement: string;
  street: string;
  description: string;
  district: string;
  zip_code: string;
  latitude: string | number;
  longitude: string | number;
  consumer_id?: string;
}
export interface SignUpData {
  name: string;
  last_name: string;
  email?: string;
  password: string;
  confirm_password: string;
  phone: string;
  document?: string;
  number?: string;
  state?: string;
  city?: string;
  cep?: string;
  complement?: string;
  street?: string;
  accept_terms: boolean;
}

export interface IProduct {
  id: number;
  text: string;
  iconname?: keyof typeof AntDesign.glyphMap;
  name: string;
  subname: string;
  idCategory: number;
  price: number;
  review: number;
  image?: string;
}
export interface IBrands {
  id: number;
  name: string;
  image?: string;
  price: number;
  idCategory: number;
  rate: number;
  description: string;
  category: string;
  sold: number;
}

export interface ICreateCard {
  name: string;
  number: string;
  validity: string;
  document: string;
  cvv?: string;
  encrypted: string;
}

export interface ICard {
  card_id: string;
  consumer_id: string;
  name: string;
  document: string;
  number: string;
  validity: string;
  active: boolean;
  encrypted: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}
