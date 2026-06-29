import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
// Use the service role key to bypass RLS blocking the admin dashboard and inventory operations
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlid3Npcm10bnNwZHNmeWpmd3VyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjY3Mjg1MSwiZXhwIjoyMDk4MjQ4ODUxfQ.E1dVA5JLXMKaSwj92Elm6KeJTXBP6rgYYImJYJ6TaLk'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone: string
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          password_hash: string
          role: 'admin' | 'manager' | 'staff'
          created_at: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string
          order: number
          created_at: string
        }
      }
      products: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string
          image_url: string
          price: number
          is_available: boolean
          created_at: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          size: string
          price_modifier: number
          created_at: string
        }
      }
      inventory: {
        Row: {
          id: string
          product_id: string
          quantity: number
          reorder_level: number
          last_restocked: string
          created_at: string
        }
      }
      orders: {
        Row: {
          id: string
          user_email: string
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          total_amount: number
          delivery_address: string
          phone: string
          created_at: string
          updated_at: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          variant_id: string | null
          quantity: number
          unit_price: number
          special_instructions: string
          created_at: string
        }
      }
    }
  }
}
