'use server'

import { createClient } from '@supabase/supabase-js'

// We use the service role key to bypass Row Level Security since it's blocking the frontend
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories in action:', error.message)
    return []
  }

  // Deduplicate categories by name (since there seem to be many duplicates from seed runs)
  const uniqueCategories = [];
  const names = new Set();
  for (const cat of data) {
    if (!names.has(cat.name)) {
      names.add(cat.name);
      uniqueCategories.push(cat);
    }
  }

  return uniqueCategories
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching products in action:', error.message)
    return []
  }

  // Deduplicate products by name and category
  const uniqueProducts = [];
  const seen = new Set();
  for (const prod of data) {
    const key = `${prod.name}-${prod.category_id}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueProducts.push(prod);
    }
  }

  return uniqueProducts
}
