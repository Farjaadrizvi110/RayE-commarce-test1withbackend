import { supabase } from "./supabase";
import type { Category, Product, Order, Quote, GalleryItem, OrderItem, ShippingAddress } from "@/types/types";

export const api = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getProducts(categorySlug?: string): Promise<Product[]> {
    let query = supabase.from("products").select("*");

    if (categorySlug) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();

      if (category) {
        query = query.eq("category_id", category.id);
      }
    }

    const { data, error } = await query.order("name", { ascending: true });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .order("name", { ascending: true })
      .limit(6);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createOrder(orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    shipping_address: ShippingAddress;
    items: OrderItem[];
    total_amount: number;
  }): Promise<Order> {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone || null,
        shipping_address: orderData.shipping_address,
        items: orderData.items,
        total_amount: orderData.total_amount,
        status: "pending",
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Failed to create order");
    return data;
  },

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createQuote(quoteData: {
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    company?: string;
    project_description: string;
    quantity?: number;
    deadline?: string;
    file_urls?: string[];
  }): Promise<Quote> {
    const { data, error } = await supabase
      .from("quotes")
      .insert({
        customer_name: quoteData.customer_name,
        customer_email: quoteData.customer_email,
        customer_phone: quoteData.customer_phone || null,
        company: quoteData.company || null,
        project_description: quoteData.project_description,
        quantity: quoteData.quantity || null,
        deadline: quoteData.deadline || null,
        file_urls: quoteData.file_urls || null,
        status: "pending",
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Failed to create quote");
    return data;
  },

  async getGalleryItems(): Promise<GalleryItem[]> {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async uploadFile(file: File, folder: string = "uploads"): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("app-7e7c96xvq58h_artwork")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("app-7e7c96xvq58h_artwork")
      .getPublicUrl(fileName);

    return data.publicUrl;
  },
};
