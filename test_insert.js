require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testInsert() {
  const { data, error } = await supabase.from('categories').insert([
    { name: 'Test Category', description: 'Test', display_order: 1, is_active: true }
  ]).select();

  console.log('Insert Result:', data, error ? error.message : '');
  
  if (data) {
     await supabase.from('categories').delete().eq('id', data[0].id);
  }
}

testInsert();
