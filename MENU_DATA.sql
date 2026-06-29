-- 1. FIX PERMISSIONS SO THE WEBSITE CAN SEE THE DATA
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for categories" ON categories;
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for products" ON products;
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);


-- 2. INSERT CATEGORIES
INSERT INTO categories (name, description, display_order, is_active) VALUES
  ('Pizza Menu', 'Star Regular, Star Super, Cheezy Star, and Star Special Pizzas', 1, true),
  ('Star Amazing Deals', 'Amazing value deals for individuals and groups', 2, true),
  ('Star Sandwiches & Platters', 'Delicious Sandwiches and Roasted Platters', 3, true),
  ('Star Special Pasta', 'Creamy and Crunchy Pastas', 4, true),
  ('Star Burgers', 'Signature Zinger and Beef Burgers', 5, true),
  ('Star Strips n Chips', 'Chicken Strips and Chips Combos', 6, true),
  ('Star Side Orders', 'Fries, Wings, Nuggets, Drinks and Ice Cream', 7, true),
  ('Family & Student Deals', 'Special discounted deals for families and students', 8, true)
ON CONFLICT (name) DO NOTHING;


-- 3. INSERT PIZZA MENU
INSERT INTO products (name, description, price, category_id, is_available) VALUES 
('Chicken Tikka Star', 'Star Tender Chunks of Marinated Grilled with Savory Onion', 750, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true),
('Fajita Chicken Star', 'An Star Authentic Taste of Fajita Marinated Chicken Onion and Bell Peppers', 750, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true),
('Chicken Lover Star', 'Extreme quantity of Chicken and Onion with rich Mozzarella Cheese', 750, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true),
('Chicken Tandoori Star', 'Our traditionally developed Tandoori Chicken with Onion, Olives, Jalapeno and Tomato Sauce', 750, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true),
('Hot N Spicy Star', 'Hot and Spicy Chicken Onion with Jalapeno', 750, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true),
('Euro Star', 'A delightful combination of specially Marinated Smoked Chicken with Bell Pepper, Mushrooms and Tomatoes', 750, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true),
('Chicken Supreme Star', 'A combination of 3 Flavors of Chicken, Black Olives, Mushrooms, Bell Pepper and Onion with Tomato Sauce', 850, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true),
('Black Pepper Tikka', 'A Blend of Marinated Black Pepper Chicken, Onion and Bell Pepper', 850, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true),
('Cheese Lover Pizza', 'Yummiest Blend of Cheese and Pizza Sauce', 850, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true),
('Chicken Mushroom', 'Tender Chunks of Marinated Grilled Chicken Tikka, Lots of Mushrooms, Onion and Tomato Sauce', 850, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true),
('Cheezious Special', 'Delicious Special Chicken with Black Olives, Sausages and Bell Pepper', 1100, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true),
('Chicken Extreme', 'Combination of 3 Flavors of Chicken with Onion, Bell Pepper, Green Olives, Mushrooms and Special Sauce', 1100, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true),
('Star Crown Crust', 'Scrumptious Pizza with a Yummy Blend of Grilled Chicken, Olives, Onion, Capsicum and Special Sauce', 1100, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true),
('Behari Kebab', 'Enjoy Special Chicken Behari Kabab, Grilled Chicken with Onion, Jalapeno and Ginger Garnishing', 1100, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true),
('Stuff Crust Pizza', 'Special Chicken, Green Olives, Mushrooms, with the Crust Filled with Cheese or Kabab', 1100, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true),
('Peri Peri Pizza', 'A bold, tangy, and spicy delight infused with our special Cheezious sauce', 1100, (SELECT id FROM categories WHERE name = 'Pizza Menu'), true);


-- 4. INSERT STAR AMAZING DEALS
INSERT INTO products (name, description, price, category_id, is_available) VALUES 
('Somewhat Amazing 1', '2 Bazinga, Regular Fries, 2 Regular Drinks', 1250, (SELECT id FROM categories WHERE name = 'Star Amazing Deals'), true),
('Somewhat Amazing 2', '2 Bazinga Burger, 2 pcs Chicken, Large Fries, 2 Regular Drinks', 1800, (SELECT id FROM categories WHERE name = 'Star Amazing Deals'), true),
('Somewhat Amazing 3', '3 Bazinga Burger, Large Fries, 1 Liter Drink', 1900, (SELECT id FROM categories WHERE name = 'Star Amazing Deals'), true),
('Somewhat Amazing 4', '3 Bazinga Burger, 3 pcs Chicken, 1 Liter Drink', 2400, (SELECT id FROM categories WHERE name = 'Star Amazing Deals'), true);


-- 5. INSERT STAR SANDWICHES & PLATTERS
INSERT INTO products (name, description, price, category_id, is_available) VALUES 
('Mexican Sandwich', 'Mozzarella Dipped Chicken Topped with Garlic Sauce and Tomatoes Served in Baked Bread', 1000, (SELECT id FROM categories WHERE name = 'Star Sandwiches & Platters'), true),
('Special Roasted Platter', '4 pcs Behari Rolls, 6 pcs Wings Served with Fries and Sauce', 1300, (SELECT id FROM categories WHERE name = 'Star Sandwiches & Platters'), true),
('Pizza Stacker', 'A unique blend of Delicious Sauce, Crispy Chicken and Pizza Crust', 1250, (SELECT id FROM categories WHERE name = 'Star Sandwiches & Platters'), true),
('Euro Sandwich', 'Mozzarella Dipped Black Pepper Chicken Topped with Garlic Sauce, Pineapple and Tomatoes', 1000, (SELECT id FROM categories WHERE name = 'Star Sandwiches & Platters'), true),
('Classic Roll Platter', '4 pcs Behari Rolls, 4 pcs Arabic Rolls Served with Fries and Sauce', 1500, (SELECT id FROM categories WHERE name = 'Star Sandwiches & Platters'), true);


-- 6. INSERT STAR SPECIAL PASTA
INSERT INTO products (name, description, price, category_id, is_available) VALUES 
('Alfredo Pasta Star Special', 'Pasta made in the yummiest White Sauce with Chicken Chunks Topped with Cheese', 1300, (SELECT id FROM categories WHERE name = 'Star Special Pasta'), true),
('Crunchy Chicken Pasta', 'Yummiest Macaroni Pasta in White Sauce topped with Crispy Chicken and Cheese', 1300, (SELECT id FROM categories WHERE name = 'Star Special Pasta'), true);


-- 7. INSERT STAR BURGERS
INSERT INTO products (name, description, price, category_id, is_available) VALUES 
('Star Zinger Burger', 'Crispy fried chicken, boneless fillet with signature sauce and lettuce held in a corn-dusted bun', 560, (SELECT id FROM categories WHERE name = 'Star Burgers'), true),
('Star Bazooka', 'Tender, juicy chicken strips loaded with mayo, pickles, jalapenos, and signature stacker sauce, all wrapped in a warm tortilla', 650, (SELECT id FROM categories WHERE name = 'Star Burgers'), true),
('Star Zinger Mighty Burger', 'Double patty zinger burger', 660, (SELECT id FROM categories WHERE name = 'Star Burgers'), true),
('Star Beef Special Burger', 'Special beef patty burger', 600, (SELECT id FROM categories WHERE name = 'Star Burgers'), true);


-- 8. INSERT STAR STRIPS N CHIPS
INSERT INTO products (name, description, price, category_id, is_available) VALUES 
('Star Strips n Chips Deal', '8 Strips, 3 Dips, 1 Regular Fries, 1 500ml Cold Drink', 1200, (SELECT id FROM categories WHERE name = 'Star Strips n Chips'), true);


-- 9. INSERT STAR SIDE ORDERS
INSERT INTO products (name, description, price, category_id, is_available) VALUES 
('Fries (Small)', 'Crispy golden fries', 250, (SELECT id FROM categories WHERE name = 'Star Side Orders'), true),
('Fries (Large)', 'Crispy golden fries', 350, (SELECT id FROM categories WHERE name = 'Star Side Orders'), true),
('Star Finger Strip (10 pcs)', '10 pieces of finger strips', 600, (SELECT id FROM categories WHERE name = 'Star Side Orders'), true),
('Star Hot Wing (10 pcs)', '10 pieces of hot wings', 600, (SELECT id FROM categories WHERE name = 'Star Side Orders'), true),
('Star Special Ice Cream', 'Special ice cream', 450, (SELECT id FROM categories WHERE name = 'Star Side Orders'), true),
('Star Ice Cream Family Pack', 'Family pack ice cream', 1000, (SELECT id FROM categories WHERE name = 'Star Side Orders'), true),
('Star Nuggets (5 pcs)', '5 pieces of chicken nuggets', 450, (SELECT id FROM categories WHERE name = 'Star Side Orders'), true),
('Star Loaded Fries', 'Loaded fries with cheese and toppings', 600, (SELECT id FROM categories WHERE name = 'Star Side Orders'), true),
('Chicken Piece', 'Single fried chicken piece', 350, (SELECT id FROM categories WHERE name = 'Star Side Orders'), true),
('Juice', 'Refreshing juice', 100, (SELECT id FROM categories WHERE name = 'Star Side Orders'), true),
('Cold Drink (Regular)', 'Regular cold drink', 80, (SELECT id FROM categories WHERE name = 'Star Side Orders'), true),
('Cold Drink (1 Liter)', '1 liter cold drink', 200, (SELECT id FROM categories WHERE name = 'Star Side Orders'), true),
('Cold Drink (1.5 Liter)', '1.5 liter cold drink', 250, (SELECT id FROM categories WHERE name = 'Star Side Orders'), true),
('Cold Drink (2.25 Liter)', '2.25 liter cold drink', 280, (SELECT id FROM categories WHERE name = 'Star Side Orders'), true);


-- 10. INSERT FAMILY & STUDENT DEALS
INSERT INTO products (name, description, price, category_id, is_available) VALUES 
('Star Zinger Roasted Family Deal', '4 Zinger Pcs, 4 Star Zinger Burger, 1.5L Cold Drink, 2 Dip Sauce, 1 Regular Fries', 3200, (SELECT id FROM categories WHERE name = 'Family & Student Deals'), true),
('Star Student Deal', '3 Zinger Burger, 3 Chicken Piece, 1 Regular Fries, 1 Dip Sauce, 1 Cold Drink', 2400, (SELECT id FROM categories WHERE name = 'Family & Student Deals'), true),
('4 Star Family Deals', '1 Star Party Pizza, 4 Star Zinger Burger, 4 Dips Sauce, 2 Regular Fries, 1.5L Cold Drink', 5500, (SELECT id FROM categories WHERE name = 'Family & Student Deals'), true),
('3 Star Family Deals', '1 Star Large Pizza, 3 Star Zinger Burger, 3 Dips Sauce, 2 Regular Fries, 1.5L Cold Drink', 4000, (SELECT id FROM categories WHERE name = 'Family & Student Deals'), true),
('Zinger Student Deal-1', '2 Star Zinger Burger, 2 Dips Sauce, 1 Regular Fries, 500 ml Cold Drink', 1050, (SELECT id FROM categories WHERE name = 'Family & Student Deals'), true),
('Zinger Student Deal-2', '5 Star Zinger Burger, 1 Dips Sauce, 1 Regular Fries, 1 Liter Cold Drink', 2300, (SELECT id FROM categories WHERE name = 'Family & Student Deals'), true),
('Star Roasted Family Deals', '9 Zinger Chicken Pcs, 1 Large Fries, 1.5L Cold Drink', 2500, (SELECT id FROM categories WHERE name = 'Family & Student Deals'), true);
