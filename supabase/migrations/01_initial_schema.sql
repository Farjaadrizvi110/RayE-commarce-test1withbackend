/*
# UK Print Pro Database Schema

## 1. New Tables

### categories
- `id` (uuid, primary key, default: gen_random_uuid())
- `name` (text, not null)
- `slug` (text, unique, not null)
- `description` (text)
- `image_url` (text)
- `created_at` (timestamptz, default: now())

### products
- `id` (uuid, primary key, default: gen_random_uuid())
- `category_id` (uuid, references categories)
- `name` (text, not null)
- `slug` (text, unique, not null)
- `description` (text)
- `base_price` (decimal, not null)
- `image_url` (text)
- `features` (jsonb) - array of product features
- `customization_options` (jsonb) - available customization options
- `is_featured` (boolean, default: false)
- `created_at` (timestamptz, default: now())

### profiles
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique)
- `full_name` (text)
- `phone` (text)
- `company` (text)
- `created_at` (timestamptz, default: now())

### orders
- `id` (uuid, primary key, default: gen_random_uuid())
- `user_id` (uuid, references profiles, nullable for guest orders)
- `order_number` (text, unique, not null)
- `status` (text, not null, default: 'pending')
- `total_amount` (decimal, not null)
- `customer_email` (text, not null)
- `customer_name` (text, not null)
- `customer_phone` (text)
- `shipping_address` (jsonb)
- `items` (jsonb, not null) - order items with product details
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### quotes
- `id` (uuid, primary key, default: gen_random_uuid())
- `user_id` (uuid, references profiles, nullable)
- `customer_name` (text, not null)
- `customer_email` (text, not null)
- `customer_phone` (text)
- `company` (text)
- `project_description` (text, not null)
- `quantity` (integer)
- `deadline` (date)
- `status` (text, default: 'pending')
- `file_urls` (jsonb) - uploaded artwork files
- `created_at` (timestamptz, default: now())

### gallery_items
- `id` (uuid, primary key, default: gen_random_uuid())
- `title` (text, not null)
- `description` (text)
- `image_url` (text)
- `category` (text)
- `created_at` (timestamptz, default: now())

## 2. Storage Bucket
- Create 'artwork-uploads' bucket for customer file uploads

## 3. Security
- Public read access for categories, products, gallery_items
- No RLS on public tables (categories, products, gallery_items)
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  base_price decimal NOT NULL,
  image_url text,
  features jsonb,
  customization_options jsonb,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  full_name text,
  phone text,
  company text,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  order_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total_amount decimal NOT NULL,
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text,
  shipping_address jsonb,
  items jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  company text,
  project_description text NOT NULL,
  quantity integer,
  deadline date,
  status text DEFAULT 'pending',
  file_urls jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Create storage bucket for artwork uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-7e7c96xvq58h_artwork', 'app-7e7c96xvq58h_artwork', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for artwork bucket
CREATE POLICY "Anyone can view artwork files"
ON storage.objects FOR SELECT
USING (bucket_id = 'app-7e7c96xvq58h_artwork');

CREATE POLICY "Anyone can upload artwork files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'app-7e7c96xvq58h_artwork' AND (storage.foldername(name))[1] = 'uploads');

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Business & Marketing', 'business-marketing', 'Professional printing for business essentials and marketing materials'),
('Large Format & Signage', 'large-format-signage', 'Eye-catching banners, posters, and signage solutions'),
('Retail & Packaging', 'retail-packaging', 'Custom packaging, labels, and retail display materials'),
('Apparel & Promotional', 'apparel-promotional', 'Custom printed apparel and promotional items'),
('Finishing Services', 'finishing-services', 'Professional finishing and special printing services');

-- Insert sample products
INSERT INTO products (category_id, name, slug, description, base_price, features, customization_options, is_featured) VALUES
(
  (SELECT id FROM categories WHERE slug = 'business-marketing'),
  'Business Cards',
  'business-cards',
  'Premium quality business cards with various finishes and paper stocks',
  25.00,
  '["High-quality card stock", "Single or double-sided", "Multiple finish options", "Fast turnaround"]'::jsonb,
  '{"sizes": ["Standard (85x55mm)", "Custom"], "finishes": ["Matte", "Gloss", "Silk"], "quantities": [100, 250, 500, 1000]}'::jsonb,
  true
),
(
  (SELECT id FROM categories WHERE slug = 'business-marketing'),
  'Flyers & Leaflets',
  'flyers-leaflets',
  'Eye-catching flyers and leaflets for promotions and events',
  35.00,
  '["Various paper weights", "Full color printing", "Multiple sizes", "Quick delivery"]'::jsonb,
  '{"sizes": ["A4", "A5", "DL"], "finishes": ["Matte", "Gloss"], "quantities": [100, 250, 500, 1000, 2500]}'::jsonb,
  true
),
(
  (SELECT id FROM categories WHERE slug = 'business-marketing'),
  'Brochures',
  'brochures',
  'Professional brochures with various folding options',
  45.00,
  '["Multiple fold options", "Premium paper", "Full color", "Professional finish"]'::jsonb,
  '{"folds": ["Bi-fold", "Tri-fold", "Z-fold"], "sizes": ["A4", "A5"], "quantities": [50, 100, 250, 500]}'::jsonb,
  true
),
(
  (SELECT id FROM categories WHERE slug = 'large-format-signage'),
  'Vinyl Banners',
  'vinyl-banners',
  'Durable weather-resistant vinyl banners for indoor and outdoor use',
  75.00,
  '["Weather-resistant", "Full color printing", "Hemmed edges", "Eyelets included"]'::jsonb,
  '{"sizes": ["2x1m", "3x1m", "4x2m", "Custom"], "materials": ["Standard Vinyl", "Premium Vinyl"], "finishing": ["Hemmed", "Hemmed with eyelets"]}'::jsonb,
  true
),
(
  (SELECT id FROM categories WHERE slug = 'large-format-signage'),
  'Roll-Up Banners',
  'roll-up-banners',
  'Portable retractable banner stands perfect for exhibitions and events',
  95.00,
  '["Portable design", "Easy setup", "Includes carry case", "High-quality print"]'::jsonb,
  '{"sizes": ["800x2000mm", "850x2000mm", "1000x2000mm"], "types": ["Standard", "Premium", "Deluxe"]}'::jsonb,
  true
),
(
  (SELECT id FROM categories WHERE slug = 'large-format-signage'),
  'Posters',
  'posters',
  'Large format posters for advertising and decoration',
  30.00,
  '["Various sizes", "High-resolution printing", "Multiple paper options", "Indoor/outdoor"]'::jsonb,
  '{"sizes": ["A3", "A2", "A1", "A0"], "materials": ["Paper", "Photo Paper", "Synthetic"], "quantities": [1, 5, 10, 25, 50]}'::jsonb,
  false
),
(
  (SELECT id FROM categories WHERE slug = 'retail-packaging'),
  'Product Labels',
  'product-labels',
  'Custom printed labels on rolls for products and packaging',
  40.00,
  '["Roll labels", "Die-cut shapes", "Waterproof options", "Various materials"]'::jsonb,
  '{"shapes": ["Round", "Square", "Rectangle", "Custom"], "sizes": ["Small", "Medium", "Large"], "quantities": [100, 250, 500, 1000, 2500]}'::jsonb,
  false
),
(
  (SELECT id FROM categories WHERE slug = 'retail-packaging'),
  'Custom Packaging Boxes',
  'custom-boxes',
  'Branded packaging boxes for products and gifts',
  120.00,
  '["Custom sizes", "Full color printing", "Various materials", "Flat-packed delivery"]'::jsonb,
  '{"types": ["Folding Carton", "Rigid Box", "Corrugated"], "printing": ["Full Color", "1-2 Colors"], "quantities": [50, 100, 250, 500]}'::jsonb,
  false
),
(
  (SELECT id FROM categories WHERE slug = 'apparel-promotional'),
  'Custom T-Shirts',
  'custom-tshirts',
  'High-quality custom printed t-shirts for events and promotions',
  12.00,
  '["Various colors", "Multiple sizes", "Screen printing or DTG", "Soft cotton fabric"]'::jsonb,
  '{"sizes": ["S", "M", "L", "XL", "XXL"], "colors": ["White", "Black", "Navy", "Red", "Custom"], "printing": ["Screen Print", "DTG"], "quantities": [10, 25, 50, 100, 250]}'::jsonb,
  true
),
(
  (SELECT id FROM categories WHERE slug = 'apparel-promotional'),
  'Promotional Items',
  'promotional-items',
  'Custom branded promotional products including pens, mugs, and keychains',
  5.00,
  '["Various items", "Custom branding", "Bulk discounts", "Quick turnaround"]'::jsonb,
  '{"items": ["Pens", "Mugs", "Keychains", "USB Drives", "Notebooks"], "quantities": [50, 100, 250, 500, 1000]}'::jsonb,
  false
),
(
  (SELECT id FROM categories WHERE slug = 'finishing-services'),
  'Lamination Services',
  'lamination',
  'Professional lamination for documents and prints',
  15.00,
  '["Matt or gloss finish", "Various sizes", "Protective coating", "Professional quality"]'::jsonb,
  '{"sizes": ["A4", "A3", "A2", "A1"], "finishes": ["Matt", "Gloss"], "quantities": [1, 10, 25, 50, 100]}'::jsonb,
  false
),
(
  (SELECT id FROM categories WHERE slug = 'finishing-services'),
  'Binding Services',
  'binding',
  'Professional binding for documents, reports, and presentations',
  20.00,
  '["Multiple binding types", "Various sizes", "Professional finish", "Quick service"]'::jsonb,
  '{"types": ["Spiral", "Wire", "Perfect Bound", "Saddle Stitch"], "sizes": ["A4", "A5"], "quantities": [1, 5, 10, 25, 50]}'::jsonb,
  false
);

-- Insert sample gallery items
INSERT INTO gallery_items (title, description, category) VALUES
('Corporate Branding Package', 'Complete branding solution for a tech startup including business cards, letterheads, and brochures', 'Business & Marketing'),
('Exhibition Stand Graphics', 'Large format graphics for a trade show exhibition stand', 'Large Format & Signage'),
('Product Packaging Design', 'Custom packaging boxes for a luxury cosmetics brand', 'Retail & Packaging'),
('Event T-Shirts', 'Custom printed t-shirts for a charity marathon event', 'Apparel & Promotional'),
('Restaurant Menu Printing', 'Laminated menus with premium finish for a restaurant chain', 'Finishing Services'),
('Retail Window Graphics', 'Eye-catching window decals for a retail store promotion', 'Large Format & Signage');
