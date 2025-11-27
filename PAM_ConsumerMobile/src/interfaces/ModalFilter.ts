import { Category } from "./Category";
import { IBranch, IProductSearched } from "./Offer";
import { IBrands } from "./User";

export type ICategory = {
  id: number;
  text?: string;
  name?: string;
};

export interface ICategoryProps {
  item: ICategory;
}
export interface IModal {
  setModalVisible: (modaVisible: boolean) => void;
  modalVisible?: boolean;
  productsFilter: IProductSearched[];
  onGetFilteredProducts?: () => void;
}
