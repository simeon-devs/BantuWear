
/*
  # BantuWear Initial Schema

  ## Overview
  Sets up the complete e-commerce database schema for BantuWear, an Afro-futurist
  premium fashion platform.

  ## New Tables

  ### users
  - `id` (uuid, PK) - unique user identifier
  - `email` (text, unique) - user login email
  - `password_hash` (text) - bcrypt password hash
  - `role` (text) - either 'ADMIN' or 'CUSTOMER', defaults to 'CUSTOMER'
  - `created_at` (timestamptz) - account creation timestamp

  ### products
  - `id` (uuid, PK) - unique product identifier
  - `name` (text) - product display name
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - full product description
  - `price` (numeric) - product price in USD
  - `sizes` (text[]) - available sizes array e.g. ['S','M','L','XL']
  - `categories` (text[]) - product categories array
  - `stock` (integer) - available inventory count
  - `images` (text[]) - array of image URLs
  - `model_3d_url` (text) - path to GLB 3D model file
  - `tags` (text[]) - searchable tags array
  - `created_at` (timestamptz)

  ### orders
  - `id` (uuid, PK) - unique order identifier
  - `user_id` (uuid, FK -> users.id) - owning customer
  - `total_amount` (numeric) - total order value
  - `status` (text) - PENDING | PAID | SHIPPED, defaults to 'PENDING'
  - `created_at` (timestamptz)

  ### order_items
  - `id` (uuid, PK) - unique line item identifier
  - `order_id` (uuid, FK -> orders.id) - parent order
  - `product_id` (uuid, FK -> products.id) - ordered product
  - `quantity` (integer) - number of units
  - `size` (text) - selected size
  - `price` (numeric) - unit price at time of order

  ## Security
  - RLS enabled on all tables
  - Users can read/update their own profile
  - Products are publicly readable; only admins can write
  - Orders are readable/writable only by owning user
  - Order items follow order ownership rules
*/

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role          text NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('ADMIN', 'CUSTOMER')),
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  slug         text UNIQUE NOT NULL,
  description  text NOT NULL DEFAULT '',
  price        numeric(10, 2) NOT NULL CHECK (price >= 0),
  sizes        text[] NOT NULL DEFAULT '{}',
  categories   text[] NOT NULL DEFAULT '{}',
  stock        integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  images       text[] NOT NULL DEFAULT '{}',
  model_3d_url text NOT NULL DEFAULT '',
  tags         text[] NOT NULL DEFAULT '{}',
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ADMIN'
    )
  );

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_amount numeric(10, 2) NOT NULL CHECK (total_amount >= 0),
  status       text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'SHIPPED')),
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity   integer NOT NULL CHECK (quantity > 0),
  size       text NOT NULL DEFAULT '',
  price      numeric(10, 2) NOT NULL CHECK (price >= 0)
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON order_items(product_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );
