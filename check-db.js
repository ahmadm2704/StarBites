require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: cats } = await supabase.from('categories').select('*');
  console.log('Admin Categories:', cats ? cats.length : 'null');

  const { data: prods } = await supabase.from('products').select('*');
  console.log('Admin Products:', prods ? prods.length : 'null');
}

check();
