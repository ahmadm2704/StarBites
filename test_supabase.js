require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  const { data: cats, error: catErr } = await supabase.from('categories').select('*');
  console.log('Categories:', cats ? cats.length : 'null', catErr ? catErr.message : '');

  const { data: prods, error: prodErr } = await supabase.from('products').select('*');
  console.log('Products:', prods ? prods.length : 'null', prodErr ? prodErr.message : '');
}

test();
