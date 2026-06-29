'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category_id: string
}

interface Category {
  id: string
  name: string
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })
      
      if (data) {
        // Deduplicate
        const unique = Array.from(new Map(data.map(item => [item.name, item])).values())
        setCategories(unique)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('name')
      
      if (data) {
        // Deduplicate, preferring items with images over items without
        const uniqueMap = new Map<string, Product>()
        data.forEach(item => {
          const key = `${item.name}-${item.category_id}`
          const existing = uniqueMap.get(key)
          if (!existing || (!existing.image_url && item.image_url)) {
            uniqueMap.set(key, item)
          }
        })
        const unique = Array.from(uniqueMap.values())
        setProducts(unique)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (product: Product) => {
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!) : []
    cart.push({ ...product, cartId: Date.now() })
    localStorage.setItem('cart', JSON.stringify(cart))
    // dispatch an event for the Navbar to update cart count
    window.dispatchEvent(new Event('cartUpdated'))
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Navbar />

      {/* Header */}
      <section className="relative bg-primary text-white py-8 px-4 border-b-4 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-3 uppercase tracking-tighter style-stroke-sm text-black">Our Menu</h1>
          <p className="text-sm sm:text-base md:text-lg font-bold bg-black text-white inline-block px-3 md:px-4 py-1.5 rounded-lg transform -rotate-1 border border-white shadow-[2px_2px_0px_0px_rgba(255,221,0,1)]">
            EXPLORE OUR DELICIOUS SELECTION!
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 px-4 mb-10">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8 relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-4 w-6 h-6 text-black/50 stroke-[2.5]" />
            <input
              type="text"
              placeholder="SEARCH MENU ITEMS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/80 backdrop-blur-md border border-black/10 text-lg font-bold text-black focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-lg transition-all rounded-2xl placeholder-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 items-center justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm uppercase transition-all duration-300 shadow-sm active:scale-95 ${
                selectedCategory === null
                  ? 'bg-primary text-white scale-105'
                  : 'bg-white text-black/70 hover:text-black hover:bg-gray-50 border border-black/5'
              }`}
            >
              ALL ITEMS
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm uppercase transition-all duration-300 shadow-sm active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-black text-secondary scale-105'
                    : 'bg-white text-black/70 hover:text-black hover:bg-gray-50 border border-black/5'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 px-4 min-h-[50vh]">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block bg-white p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-8xl mb-4 animate-bounce-gentle">🍔</div>
                <p className="text-3xl font-black text-black uppercase">COOKING DELICIOUSNESS...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block bg-white p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-2">
                <div className="text-8xl mb-4">😢</div>
                <p className="text-3xl font-black text-black uppercase">NO ITEMS FOUND</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-3xl overflow-hidden flex flex-col transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-gray-100 shadow-lg">
                  {/* Product Image */}
                  {product.image_url ? (
                    <div className="h-48 relative overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80' // fallback image
                        }}
                      />
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-48 flex items-center justify-center text-6xl group-hover:scale-105 transition duration-700 relative overflow-hidden">
                      <span className="drop-shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">🍽️</span>
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="p-6 flex flex-col flex-grow bg-white z-10">
                    <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 font-medium mb-6 flex-grow text-sm leading-relaxed line-clamp-3">
                      {product.description}
                    </p>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-100">
                      <span className="text-2xl font-black text-gray-900 tracking-tight">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-primary text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-[0_4px_14px_0_rgba(227,24,55,0.39)] hover:shadow-[0_6px_20px_rgba(227,24,55,0.23)] hover:bg-primary/90 transform hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-20 px-4 mt-20 border-y-8 border-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 uppercase tracking-tight text-secondary style-stroke-sm">CRAVING MORE?</h2>
          <p className="text-lg md:text-2xl font-bold mb-8 md:mb-10 text-white">CHECK OUT OUR DAILY DEALS AND SAVE BIG ON YOUR FAVORITE MEALS!</p>
          <a href="/" className="inline-block bg-primary text-white font-black uppercase tracking-widest text-lg md:text-xl px-8 md:px-12 py-4 md:py-5 rounded-2xl border-4 border-white shadow-[6px_6px_0px_0px_rgba(255,221,0,1)] md:shadow-[8px_8px_0px_0px_rgba(255,221,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(255,221,0,1)] transition-all">
            VIEW HOME
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
