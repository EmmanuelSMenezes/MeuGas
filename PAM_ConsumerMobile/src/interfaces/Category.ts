import { Pagination } from "./Utils";

export interface Category{
  active: boolean,
  category_id: string,
  category_parent_id: string,
  category_parent_name: string,
  created_at: string,
  created_by: string,
  description: string,
  identifier: number,
  updated_at: number,
  updated_by: number,
}
export interface Categories {
  categories: Category[],
  pagination: Pagination
}
