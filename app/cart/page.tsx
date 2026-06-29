'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, ArrowLeft, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface CartItem {
  id: string
  cartId: number
  name: string
  price: number
  image_url: string
  description: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  })

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    const cart = localStorage.getItem('cart')
    if (cart) {
      setCartItems(JSON.parse(cart))
    }
    setLoading(false)
  }

  const removeFromCart = (cartId: number) => {
    const updated = cartItems.filter(item => item.cartId !== cartId)
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0)
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_email: formData.email || null,
          customer_phone: formData.phone,
          customer_name: formData.name,
          status: 'pending',
          total_amount: getTotalPrice() + 200 + Math.round(getTotalPrice() * 0.17),
          delivery_address: formData.address,
        })
        .select()

      if (orderError) throw orderError

      const orderId = orderData[0].id

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderId,
        product_id: item.id,
        quantity: 1,
        unit_price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      setOrderPlaced(true)
      localStorage.removeItem('cart')
      setCartItems([])
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md animate-bounce-gentle">
          <div className="bg-gradient-to-br from-primary to-accent text-white w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Check className="w-14 h-14" />
          </div>
          <h1 className="text-5xl font-black text-primary mb-6">Order Placed!</h1>
          <p className="text-gray-600 text-xl mb-8 font-semibold">Thank you for your order. Your delicious food will arrive soon!</p>
          <Link href="/">
            <button className="star-button w-full text-lg">
              Back to Home →
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-lg border-b-4 border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="group-hover:scale-110 transition-all duration-300">
                <Image 
                  src="/logo.png" 
                  alt="Star Bites Logo" 
                  width={60} 
                  height={60}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <span className="text-3xl font-black text-primary drop-shadow-sm">Star Bites</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-red-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/menu" className="flex items-center gap-2 text-white hover:text-gray-200 transition mb-6 font-bold text-lg">
            <ArrowLeft className="w-5 h-5" />
            Back to Menu
          </Link>
          <h1 className="text-5xl md:text-6xl font-black">Your Cart</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="text-7xl mb-6 animate-bounce-gentle">🛒</div>
              <p className="text-2xl font-semibold text-gray-600">Loading your cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
              <div className="text-8xl mb-8">🛒</div>
              <h2 className="text-4xl font-black text-primary mb-6">Your cart is empty</h2>
              <p className="text-gray-600 text-xl mb-10 font-semibold">Let&apos;s fill it with some delicious food!</p>
              <Link href="/menu">
                <button className="star-button text-xl px-12 py-4">
                  Explore Menu →
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.cartId} className="star-card p-8 flex justify-between items-center group">
                      <div className="flex items-center gap-6 flex-grow">
                        {item.image_url ? (
                          <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={item.image_url} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'
                              }}
                            />
                          </div>
                        ) : (
                          <div className="bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl group-hover:scale-110 transition duration-300">
                            🍽️
                          </div>
                        )}
                        <div className="flex-grow">
                          <h3 className="text-2xl font-black text-primary mb-2 group-hover:text-accent transition">{item.name}</h3>
                          <p className="text-gray-600 font-medium mb-3">{item.description}</p>
                          <p className="text-3xl font-black text-accent">Rs. {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white p-4 rounded-full transition-all duration-300 ml-6 hover:scale-110"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="star-card p-10 sticky top-28">
                  <h3 className="text-3xl font-black text-primary mb-8">Order Summary</h3>

                  <div className="mb-8 pb-8 border-b-2 border-gray-200 space-y-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600 font-semibold">Subtotal</span>
                      <span className="font-bold">Rs. {getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600 font-semibold">Delivery Fee</span>
                      <span className="font-bold">Rs. 200</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600 font-semibold">Tax (17%)</span>
                      <span className="font-bold">Rs. {Math.round(getTotalPrice() * 0.17).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-10 text-3xl pb-8 border-b-2 border-primary">
                    <span className="font-black text-primary">Total</span>
                    <span className="font-black text-accent">Rs. {(getTotalPrice() + 200 + Math.round(getTotalPrice() * 0.17)).toLocaleString()}</span>
                  </div>

                  {/* Checkout Form */}
                  <form onSubmit={handleCheckout} className="space-y-5">
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="star-input w-full text-base"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">Phone *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="star-input w-full text-base"
                        placeholder="+92 3XX XXX XXXX"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="star-input w-full text-base"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">Delivery Address *</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="star-input w-full resize-none h-28 text-base"
                        placeholder="Your complete delivery address"
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="star-button w-full text-lg font-black disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Processing...' : 'Place Order →'}
                    </button>
                  </form>

                  <button
                    onClick={() => {
                      setCartItems([])
                      localStorage.removeItem('cart')
                    }}
                    className="w-full mt-5 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 font-bold text-lg hover:shadow-lg"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p className="font-semibold">&copy; 2024 Star Bites. All rights reserved. 🌟</p>
        </div>
      </footer>
    </div>
  )
}
