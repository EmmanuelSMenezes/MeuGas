export interface Pagination {
  totalRows: number;
  totalPages: number;
}
export interface Rating {
  rating_value: number;
  note: string;
  created_at: string;
}

export type PermissionResources = "camera" | "location";

export type TSortOptions = "Asc" | "Desc";

export interface ITheme {
  fonts: {
    light_italic: string;
    light: string;
    italic: string;
    regular: string;
    medium: string;
    bold: string;
  };

  colors: {
    primary: string;
    primaryBackground: string;
    secondary: string;
    text: string;
    black: string;
    gray: string;
    lightgray: string;
    white: string;
    background: string;
    shadow: string;
    shadowPrimary: string;
    success: string;
    danger: string;
    warning: string;
    blue: string;
    shadowBlue: string;
    gold: string;
    orange: string;
  };
}

export interface ViaCEPResponse {
  cep: string;
  logradouro: string | "";
  complemento: string | "";
  bairro: string | "";
  localidade: string;
  uf: string;
  ibge: string;
  gia: string | "";
  ddd: string;
  siafi: string;
}
