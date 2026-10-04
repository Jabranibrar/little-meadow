export interface Product {
  id: number;
  name: string;
  price: number;
  desc: string;
  category: "boy" | "girl" | "unisex";
}

export interface CartItem {
  key: string;
  id: number;
  name: string;
  price: number;
  size: string;
  qty: number;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  payment: string;
}
