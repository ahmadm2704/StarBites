require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// This script requires the SERVICE ROLE KEY to bypass Row Level Security (RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase URL or Service Role Key!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const categories = [
  { name: 'Pizza Menu', description: 'Star Regular, Star Super, Cheezy Star, and Star Special Pizzas', display_order: 1, is_active: true },
  { name: 'Star Amazing Deals', description: 'Amazing value deals for individuals and groups', display_order: 2, is_active: true },
  { name: 'Star Sandwiches & Platters', description: 'Delicious Sandwiches and Roasted Platters', display_order: 3, is_active: true },
  { name: 'Star Special Pasta', description: 'Creamy and Crunchy Pastas', display_order: 4, is_active: true },
  { name: 'Star Burgers', description: 'Signature Zinger and Beef Burgers', display_order: 5, is_active: true },
  { name: 'Star Strips n Chips', description: 'Chicken Strips and Chips Combos', display_order: 6, is_active: true },
  { name: 'Star Side Orders', description: 'Fries, Wings, Nuggets, Drinks and Ice Cream', display_order: 7, is_active: true },
  { name: 'Family & Student Deals', description: 'Special discounted deals for families and students', display_order: 8, is_active: true }
];

const products = [
  // Pizzas
  { name: 'Chicken Tikka Star', description: 'Star Tender Chunks of Marinated Grilled with Savory Onion', price: 750, category_name: 'Pizza Menu' },
  { name: 'Fajita Chicken Star', description: 'An Star Authentic Taste of Fajita Marinated Chicken Onion and Bell Peppers', price: 750, category_name: 'Pizza Menu' },
  { name: 'Chicken Lover Star', description: 'Extreme quantity of Chicken and Onion with rich Mozzarella Cheese', price: 750, category_name: 'Pizza Menu' },
  { name: 'Chicken Tandoori Star', description: 'Our traditionally developed Tandoori Chicken with Onion, Olives, Jalapeno and Tomato Sauce', price: 750, category_name: 'Pizza Menu' },
  { name: 'Hot N Spicy Star', description: 'Hot and Spicy Chicken Onion with Jalapeno', price: 750, category_name: 'Pizza Menu' },
  { name: 'Euro Star', description: 'A delightful combination of specially Marinated Smoked Chicken with Bell Pepper, Mushrooms and Tomatoes', price: 750, category_name: 'Pizza Menu' },
  { name: 'Chicken Supreme Star', description: 'A combination of 3 Flavors of Chicken, Black Olives, Mushrooms, Bell Pepper and Onion with Tomato Sauce', price: 850, category_name: 'Pizza Menu' },
  { name: 'Black Pepper Tikka', description: 'A Blend of Marinated Black Pepper Chicken, Onion and Bell Pepper', price: 850, category_name: 'Pizza Menu' },
  { name: 'Cheese Lover Pizza', description: 'Yummiest Blend of Cheese and Pizza Sauce', price: 850, category_name: 'Pizza Menu' },
  { name: 'Chicken Mushroom', description: 'Tender Chunks of Marinated Grilled Chicken Tikka, Lots of Mushrooms, Onion and Tomato Sauce', price: 850, category_name: 'Pizza Menu' },
  { name: 'Cheezious Special', description: 'Delicious Special Chicken with Black Olives, Sausages and Bell Pepper', price: 1100, category_name: 'Pizza Menu' },
  { name: 'Chicken Extreme', description: 'Combination of 3 Flavors of Chicken with Onion, Bell Pepper, Green Olives, Mushrooms and Special Sauce', price: 1100, category_name: 'Pizza Menu' },
  { name: 'Star Crown Crust', description: 'Scrumptious Pizza with a Yummy Blend of Grilled Chicken, Olives, Onion, Capsicum and Special Sauce', price: 1100, category_name: 'Pizza Menu' },
  { name: 'Behari Kebab', description: 'Enjoy Special Chicken Behari Kabab, Grilled Chicken with Onion, Jalapeno and Ginger Garnishing', price: 1100, category_name: 'Pizza Menu' },
  { name: 'Stuff Crust Pizza', description: 'Special Chicken, Green Olives, Mushrooms, with the Crust Filled with Cheese or Kabab', price: 1100, category_name: 'Pizza Menu' },
  { name: 'Peri Peri Pizza', description: 'A bold, tangy, and spicy delight infused with our special Cheezious sauce', price: 1100, category_name: 'Pizza Menu' },

  // Deals
  { name: 'Somewhat Amazing 1', description: '2 Bazinga, Regular Fries, 2 Regular Drinks', price: 1250, category_name: 'Star Amazing Deals' },
  { name: 'Somewhat Amazing 2', description: '2 Bazinga Burger, 2 pcs Chicken, Large Fries, 2 Regular Drinks', price: 1800, category_name: 'Star Amazing Deals' },
  { name: 'Somewhat Amazing 3', description: '3 Bazinga Burger, Large Fries, 1 Liter Drink', price: 1900, category_name: 'Star Amazing Deals' },
  { name: 'Somewhat Amazing 4', description: '3 Bazinga Burger, 3 pcs Chicken, 1 Liter Drink', price: 2400, category_name: 'Star Amazing Deals' },

  // Sandwiches
  { name: 'Mexican Sandwich', description: 'Mozzarella Dipped Chicken Topped with Garlic Sauce and Tomatoes Served in Baked Bread', price: 1000, category_name: 'Star Sandwiches & Platters' },
  { name: 'Special Roasted Platter', description: '4 pcs Behari Rolls, 6 pcs Wings Served with Fries and Sauce', price: 1300, category_name: 'Star Sandwiches & Platters' },
  { name: 'Pizza Stacker', description: 'A unique blend of Delicious Sauce, Crispy Chicken and Pizza Crust', price: 1250, category_name: 'Star Sandwiches & Platters' },
  { name: 'Euro Sandwich', description: 'Mozzarella Dipped Black Pepper Chicken Topped with Garlic Sauce, Pineapple and Tomatoes', price: 1000, category_name: 'Star Sandwiches & Platters' },
  { name: 'Classic Roll Platter', description: '4 pcs Behari Rolls, 4 pcs Arabic Rolls Served with Fries and Sauce', price: 1500, category_name: 'Star Sandwiches & Platters' },

  // Pasta
  { name: 'Alfredo Pasta Star Special', description: 'Pasta made in the yummiest White Sauce with Chicken Chunks Topped with Cheese', price: 1300, category_name: 'Star Special Pasta' },
  { name: 'Crunchy Chicken Pasta', description: 'Yummiest Macaroni Pasta in White Sauce topped with Crispy Chicken and Cheese', price: 1300, category_name: 'Star Special Pasta' },

  // Burgers
  { name: 'Star Zinger Burger', description: 'Crispy fried chicken, boneless fillet with signature sauce and lettuce held in a corn-dusted bun', price: 560, category_name: 'Star Burgers' },
  { name: 'Star Bazooka', description: 'Tender, juicy chicken strips loaded with mayo, pickles, jalapenos, and signature stacker sauce, all wrapped in a warm tortilla', price: 650, category_name: 'Star Burgers' },
  { name: 'Star Zinger Mighty Burger', description: 'Double patty zinger burger', price: 660, category_name: 'Star Burgers' },
  { name: 'Star Beef Special Burger', description: 'Special beef patty burger', price: 600, category_name: 'Star Burgers' },

  // Strips
  { name: 'Star Strips n Chips Deal', description: '8 Strips, 3 Dips, 1 Regular Fries, 1 500ml Cold Drink', price: 1200, category_name: 'Star Strips n Chips' },

  // Sides
  { name: 'Fries (Small)', description: 'Crispy golden fries', price: 250, category_name: 'Star Side Orders' },
  { name: 'Fries (Large)', description: 'Crispy golden fries', price: 350, category_name: 'Star Side Orders' },
  { name: 'Star Finger Strip (10 pcs)', description: '10 pieces of finger strips', price: 600, category_name: 'Star Side Orders' },
  { name: 'Star Hot Wing (10 pcs)', description: '10 pieces of hot wings', price: 600, category_name: 'Star Side Orders' },
  { name: 'Star Special Ice Cream', description: 'Special ice cream', price: 450, category_name: 'Star Side Orders' },
  { name: 'Star Ice Cream Family Pack', description: 'Family pack ice cream', price: 1000, category_name: 'Star Side Orders' },
  { name: 'Star Nuggets (5 pcs)', description: '5 pieces of chicken nuggets', price: 450, category_name: 'Star Side Orders' },
  { name: 'Star Loaded Fries', description: 'Loaded fries with cheese and toppings', price: 600, category_name: 'Star Side Orders' },
  { name: 'Chicken Piece', description: 'Single fried chicken piece', price: 350, category_name: 'Star Side Orders' },
  { name: 'Juice', description: 'Refreshing juice', price: 100, category_name: 'Star Side Orders' },
  { name: 'Cold Drink (Regular)', description: 'Regular cold drink', price: 80, category_name: 'Star Side Orders' },
  { name: 'Cold Drink (1 Liter)', description: '1 liter cold drink', price: 200, category_name: 'Star Side Orders' },
  { name: 'Cold Drink (1.5 Liter)', description: '1.5 liter cold drink', price: 250, category_name: 'Star Side Orders' },
  { name: 'Cold Drink (2.25 Liter)', description: '2.25 liter cold drink', price: 280, category_name: 'Star Side Orders' },

  // Family Deals
  { name: 'Star Zinger Roasted Family Deal', description: '4 Zinger Pcs, 4 Star Zinger Burger, 1.5L Cold Drink, 2 Dip Sauce, 1 Regular Fries', price: 3200, category_name: 'Family & Student Deals' },
  { name: 'Star Student Deal', description: '3 Zinger Burger, 3 Chicken Piece, 1 Regular Fries, 1 Dip Sauce, 1 Cold Drink', price: 2400, category_name: 'Family & Student Deals' },
  { name: '4 Star Family Deals', description: '1 Star Party Pizza, 4 Star Zinger Burger, 4 Dips Sauce, 2 Regular Fries, 1.5L Cold Drink', price: 5500, category_name: 'Family & Student Deals' },
  { name: '3 Star Family Deals', description: '1 Star Large Pizza, 3 Star Zinger Burger, 3 Dips Sauce, 2 Regular Fries, 1.5L Cold Drink', price: 4000, category_name: 'Family & Student Deals' },
  { name: 'Zinger Student Deal-1', description: '2 Star Zinger Burger, 2 Dips Sauce, 1 Regular Fries, 500 ml Cold Drink', price: 1050, category_name: 'Family & Student Deals' },
  { name: 'Zinger Student Deal-2', description: '5 Star Zinger Burger, 1 Dips Sauce, 1 Regular Fries, 1 Liter Cold Drink', price: 2300, category_name: 'Family & Student Deals' },
  { name: 'Star Roasted Family Deals', description: '9 Zinger Chicken Pcs, 1 Large Fries, 1.5L Cold Drink', price: 2500, category_name: 'Family & Student Deals' }
];

async function seedDatabase() {
  console.log("Starting database seed...");
  
  // 1. Insert Categories
  for (const cat of categories) {
    const { error } = await supabase.from('categories').upsert(cat, { onConflict: 'name' });
    if (error) {
      console.error(`Error inserting category ${cat.name}:`, error.message);
    }
  }
  console.log("Categories inserted.");

  // 2. Get Category IDs
  const { data: dbCategories, error: catError } = await supabase.from('categories').select('id, name');
  if (catError) {
    console.error("Failed to fetch categories:", catError.message);
    process.exit(1);
  }

  // 3. Insert Products
  for (const prod of products) {
    const category = dbCategories.find(c => c.name === prod.category_name);
    if (!category) {
      console.error(`Category not found for product: ${prod.name}`);
      continue;
    }

    const { category_name, ...productData } = prod;
    productData.category_id = category.id;
    productData.is_available = true;

    const { error } = await supabase.from('products').insert(productData);
    if (error) {
       // Ignore duplicate errors if they exist, but log others
       if (!error.message.includes('duplicate key value')) {
          console.error(`Error inserting product ${prod.name}:`, error.message);
       }
    }
  }
  console.log("Products inserted.");
  console.log("Database seed complete! You can now check the website.");
}

seedDatabase();
