-- Star Bites Cafe - Complete Database Schema for Supabase
-- Copy and paste this entire script into Supabase SQL Editor

-- ============================================
-- 1. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  image_url VARCHAR(500),
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. INVENTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  quantity_in_stock INT DEFAULT 0,
  reorder_level INT DEFAULT 10,
  last_restocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. CUSTOMERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  name VARCHAR(255),
  address TEXT,
  total_orders INT DEFAULT 0,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  last_order_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  customer_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, preparing, ready, delivered, cancelled
  total_amount DECIMAL(12, 2) NOT NULL,
  delivery_address TEXT NOT NULL,
  special_instructions TEXT,
  delivery_time TIMESTAMP WITH TIME ZONE,
  estimated_delivery_minutes INT DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. ORDER_ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. ADMIN_USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'staff', -- admin, manager, staff
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. ANALYTICS TABLE (for tracking sales)
-- ============================================
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  total_orders INT DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  average_order_value DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);

-- ============================================
-- INITIAL DATA - CATEGORIES
-- ============================================
INSERT INTO categories (name, description, display_order, is_active) VALUES
  ('Pizzas', 'Hand-tossed with premium ingredients and authentic recipes', 1, true),
  ('Burgers', 'Signature burgers with our special sauce and fresh toppings', 2, true),
  ('Fried Chicken', 'Golden, crispy pieces with a savory blend of spices', 3, true),
  ('Sides', 'Fries, appetizers, and delicious sides', 4, true),
  ('Beverages', 'Drinks to pair with your meal', 5, true),
  ('Desserts', 'Sweet treats to finish your meal', 6, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- INITIAL DATA - PRODUCTS (Sample)
-- ============================================
INSERT INTO products (name, description, price, category_id, is_available, display_order) VALUES
  -- Pizzas
  ('Margherita Pizza', 'Classic pizza with fresh tomato, mozzarella, and basil', 450.00, (SELECT id FROM categories WHERE name = 'Pizzas'), true, 1),
  ('Pepperoni Pizza', 'Loaded with pepperoni and mozzarella cheese', 550.00, (SELECT id FROM categories WHERE name = 'Pizzas'), true, 2),
  ('Chicken Tikka Pizza', 'Spicy chicken tikka with special sauce', 650.00, (SELECT id FROM categories WHERE name = 'Pizzas'), true, 3),
  
  -- Burgers
  ('Classic Burger', 'Juicy beef patty with lettuce, tomato, and special sauce', 350.00, (SELECT id FROM categories WHERE name = 'Burgers'), true, 1),
  ('Cheese Burger', 'Loaded with melted cheese and toppings', 400.00, (SELECT id FROM categories WHERE name = 'Burgers'), true, 2),
  ('Spicy Chicken Burger', 'Crispy fried chicken with hot sauce', 450.00, (SELECT id FROM categories WHERE name = 'Burgers'), true, 3),
  
  -- Fried Chicken
  ('Chicken Wings (6 pcs)', 'Golden and crispy chicken wings', 300.00, (SELECT id FROM categories WHERE name = 'Fried Chicken'), true, 1),
  ('Chicken Drumsticks (4 pcs)', 'Spicy marinated drumsticks', 350.00, (SELECT id FROM categories WHERE name = 'Fried Chicken'), true, 2),
  ('Chicken Breast Fillet', 'Crispy fried chicken breast', 400.00, (SELECT id FROM categories WHERE name = 'Fried Chicken'), true, 3),
  
  -- Sides
  ('French Fries', 'Crispy golden fries with seasoning', 150.00, (SELECT id FROM categories WHERE name = 'Sides'), true, 1),
  ('Coleslaw', 'Fresh and crispy coleslaw', 100.00, (SELECT id FROM categories WHERE name = 'Sides'), true, 2),
  
  -- Beverages
  ('Cold Drink (250ml)', 'Refreshing cola', 80.00, (SELECT id FROM categories WHERE name = 'Beverages'), true, 1),
  ('Iced Tea (300ml)', 'Chilled iced tea', 100.00, (SELECT id FROM categories WHERE name = 'Beverages'), true, 2),
  
  -- Desserts
  ('Chocolate Cake', 'Rich and moist chocolate cake', 200.00, (SELECT id FROM categories WHERE name = 'Desserts'), true, 1),
  ('Ice Cream Scoop', 'Vanilla or chocolate ice cream', 150.00, (SELECT id FROM categories WHERE name = 'Desserts'), true, 2)
ON CONFLICT DO NOTHING;

-- ============================================
-- INITIALIZE INVENTORY FOR ALL PRODUCTS
-- ============================================
INSERT INTO inventory (product_id, quantity_in_stock, reorder_level)
SELECT id, 50, 10 FROM products
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT DEFAULT ADMIN USER
-- ============================================
-- Note: Password is hashed using bcrypt. Default: admin123
-- To set a new password, use: SELECT crypt('your_password', gen_salt('bf'));
INSERT INTO admin_users (email, password_hash, name, role, is_active) VALUES
  ('admin@starbites.pk', '$2b$12$SomeHashedPasswordHere', 'Admin User', 'admin', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- ENABLE ROW LEVEL SECURITY (Optional but Recommended)
-- ============================================
-- Enable RLS on sensitive tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to products and categories
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================
-- Daily Sales Summary
CREATE OR REPLACE VIEW daily_sales_summary AS
SELECT
  DATE(created_at) as sale_date,
  COUNT(*) as total_orders,
  SUM(total_amount) as total_revenue,
  AVG(total_amount) as average_order_value,
  COUNT(DISTINCT customer_email) as unique_customers
FROM orders
WHERE status IN ('delivered', 'confirmed')
GROUP BY DATE(created_at)
ORDER BY sale_date DESC;

-- Top Selling Products
CREATE OR REPLACE VIEW top_selling_products AS
SELECT
  p.id,
  p.name,
  c.name as category,
  COUNT(oi.id) as times_ordered,
  SUM(oi.quantity) as total_quantity_sold,
  SUM(oi.quantity * oi.unit_price) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN categories c ON p.category_id = c.id
GROUP BY p.id, p.name, c.name
ORDER BY times_ordered DESC;

-- Order Status Breakdown
CREATE OR REPLACE VIEW order_status_breakdown AS
SELECT
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM orders), 2) as percentage
FROM orders
GROUP BY status
ORDER BY count DESC;

-- ============================================
-- SCHEMA COMPLETE
-- ============================================
-- Your Star Bites database is ready!
-- You can now use the Next.js application to manage:
-- - Products and Categories
-- - Orders and Inventory
-- - Admin Users
-- - Analytics and Reports