require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testInsert() {
  const { error } = await supabase.from('orders').insert({
    customer_email: 'test@test.com',
    customer_phone: '123',
    customer_name: 'test',
    status: 'pending',
    total_amount: 100,
    delivery_address: 'test'
  });
  console.log('Order insert error:', error ? error.message : 'none');
}

testInsert();
