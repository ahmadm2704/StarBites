require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlid3Npcm10bnNwZHNmeWpmd3VyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjY3Mjg1MSwiZXhwIjoyMDk4MjQ4ODUxfQ.E1dVA5JLXMKaSwj92Elm6KeJTXBP6rgYYImJYJ6TaLk'
);

async function checkDuplicates() {
  const { data: products } = await supabase.from('products').select('id, name, category_id, image_url');
  const { data: categories } = await supabase.from('categories').select('id, name');

  console.log('PRODUCTS:');
  console.log(products.filter(p => p.name === 'Margherita Pizza'));

  console.log('CATEGORIES:');
  console.log(categories);
}

checkDuplicates();
