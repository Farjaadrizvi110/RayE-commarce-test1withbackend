export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  features: string[] | null;
  customization_options: CustomizationOptions | null;
  is_featured: boolean;
  created_at: string;
}

export interface CustomizationOptions {
  sizes?: string[];
  finishes?: string[];
  quantities?: number[];
  folds?: string[];
  materials?: string[];
  finishing?: string[];
  types?: string[];
  shapes?: string[];
  colors?: string[];
  printing?: string[];
  items?: string[];
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  company: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  order_number: string;
  status: string;
  total_amount: number;
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  shipping_address: ShippingAddress | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  address_line1: string;
  address_line2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  customization: Record<string, string | number>;
}

export interface Quote {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  company: string | null;
  project_description: string;
  quantity: number | null;
  deadline: string | null;
  status: string;
  file_urls: string[] | null;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization: Record<string, string | number>;
  price: number;
}
