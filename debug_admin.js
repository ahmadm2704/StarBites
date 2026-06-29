require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  console.log("Checking inventory...");
  const inv = await supabase.from('inventory').select('*');
  console.log("Inventory:", inv.data, inv.error);

  console.log("Checking orders...");
  const orders = await supabase.from('orders').select('*');
  console.log("Orders:", orders.data, orders.error);

  console.log("Checking order_items...");
  const items = await supabase.from('order_items').select('*');
  console.log("Order Items:", items.data, items.error);
}

check();
