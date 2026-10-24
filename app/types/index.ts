export interface Product {
  id: number;
  name: string;
  price: number;
  desc: string;
  category:
    | "boy"
    | "girl"
    | "unisex"
    | "newborn"
    | "frocks"
    | "jacket"
    | "romper"
    | "pajamaz"
    | "dress"
    | "jersi"
    | "baby-suit"
    | "newborn-set";
  image: string;
  images: string[];
  description: string;
  stock: number | null;
  sizes: string[];
  availableSizes: string[];
  fabric: string;
  occasion: string;
  pieces: string;
  care: string;
  highlights: string[];
  colors: { name: string; hex: string; images: string[] }[];
}

export interface CartItem {
  key: string;
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
  stock?: number | null;
  color?: string;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  payment: string;
}
