export type Product = {
  id: number;
  title: string;
  name?: string;
  slug?: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock?: number;
  is_active?: boolean;
  rating?: {
    rate: number;
    count: number;
  };
};

export type BackendUser = {
  id?: number;
  username?: string;
  name?: string;
  email: string;
};

export type OrderItem = {
  product_id: number;
  quantity: number;
};

export type Order = {
  id: number;
  shipping_address: string;
  items: OrderItem[];
  status?: string;
  total?: number | string;
  created_at?: string;
};

export type Banner = {
  id: number;
  title: string;
  subtitle?: string;
  image?: string;
  link?: string;
  is_active?: boolean;
  starts_at?: string;
  ends_at?: string;
};

export type BackendResponseFormat<T = unknown> = {
  status?: boolean;
  statusCode?: number;
  data?: T;
  error?: unknown;
};

export type ProductResponse = Product | BackendResponseFormat<Product>;
export type ProductListResponse = Product[] | BackendResponseFormat<Product[]>;
export type productType = Product;
