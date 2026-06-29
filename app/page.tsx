'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Sparkles, Clock, Award } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const cart = localStorage.getItem('cart')
    if (cart) {
      const items = JSON.parse(cart)
      setCartCount(items.length)
    }
  }, [])
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0yMCAwTDIwIDQwTTAgMjBMMDAgMjAiIHN0cm9rZT0iI0U1QzMwMCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIiAvPgo8L3N2Zz4=')]">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-10 inline-block rotate-[-2deg]">
            <span className="star-badge text-xl px-8 py-4 animate-bounce-gentle border-2 border-black">
              🔥 HOT, FRESH & DELIVERED FAST 🔥
            </span>
          </div>
          <h1 className="star-title mb-8 text-7xl md:text-9xl">
            CRAVING<br />
            <span className="text-primary style-stroke bg-white px-4 rounded-3xl border-8 border-black shadow-[12px_12px_0px_0px_rgba(227,24,55,1)] inline-block mt-4 mb-4 transform rotate-2">PERFECTION?</span>
          </h1>
          <p className="star-subtitle mb-12 text-2xl md:text-3xl max-w-3xl mx-auto bg-white inline-block p-4 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg]">
            Crispy pizzas, juicy burgers, and golden fried chicken ready to blow your mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
            <Link href="/menu">
              <button className="star-button text-2xl px-12 py-6">
                ORDER NOW ➔
              </button>
            </Link>
            <Link href="#deals">
              <button className="star-button-secondary text-2xl px-12 py-6">
                VIEW DEALS
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary border-y-8 border-black text-white py-12 px-4 shadow-[0px_10px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden relative z-20">
        <div className="flex flex-nowrap whitespace-nowrap animate-marquee">
           {/* Simple marquee effect */}
          <div className="flex items-center gap-12 font-black text-4xl uppercase tracking-widest text-white style-stroke">
            <span>⭐ 1000+ HAPPY CUSTOMERS</span>
            <span>⭐ 50+ MENU ITEMS</span>
            <span>⭐ 30 MIN DELIVERY</span>
            <span>⭐ BEST TASTE IN TOWN</span>
            <span>⭐ 1000+ HAPPY CUSTOMERS</span>
            <span>⭐ 50+ MENU ITEMS</span>
            <span>⭐ 30 MIN DELIVERY</span>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 rounded-3xl inline-block mx-auto transform -rotate-1">
            <h2 className="star-title text-6xl md:text-7xl mb-4">WHAT'S YOUR CRAVING?</h2>
            <p className="star-subtitle text-2xl uppercase">Pick your favorite and enjoy the taste of excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Pizzas */}
            <Link href="/menu?category=pizzas">
              <div className="star-card h-full flex flex-col group overflow-hidden bg-[#FFF9C4]">
                <div className="bg-primary h-64 rounded-xl flex items-center justify-center text-8xl group-hover:scale-110 transition duration-500 border-4 border-black shadow-[inset_0px_-10px_0px_rgba(0,0,0,0.2)] rotate-2 group-hover:rotate-0">
                  🍕
                </div>
                <div className="pt-8 text-center flex-grow">
                  <h3 className="text-4xl font-black text-black mb-3 uppercase style-stroke">FRESH PIZZAS</h3>
                  <p className="text-gray-800 text-xl font-bold border-t-4 border-black pt-4">Hand-tossed with premium ingredients.</p>
                </div>
                <div className="mt-8 bg-black text-white text-center font-black py-4 rounded-xl text-xl uppercase group-hover:bg-primary transition-colors border-2 border-black">VIEW MENU ➔</div>
              </div>
            </Link>

            {/* Burgers */}
            <Link href="/menu?category=burgers">
              <div className="star-card h-full flex flex-col group overflow-hidden bg-white">
                <div className="bg-[#FF8C00] h-64 rounded-xl flex items-center justify-center text-8xl group-hover:scale-110 transition duration-500 border-4 border-black shadow-[inset_0px_-10px_0px_rgba(0,0,0,0.2)] -rotate-2 group-hover:rotate-0">
                  🍔
                </div>
                <div className="pt-8 text-center flex-grow">
                  <h3 className="text-4xl font-black text-black mb-3 uppercase style-stroke">JUICY BURGERS</h3>
                  <p className="text-gray-800 text-xl font-bold border-t-4 border-black pt-4">Signature burgers with fresh toppings.</p>
                </div>
                <div className="mt-8 bg-black text-white text-center font-black py-4 rounded-xl text-xl uppercase group-hover:bg-primary transition-colors border-2 border-black">VIEW MENU ➔</div>
              </div>
            </Link>

            {/* Fried Chicken */}
            <Link href="/menu?category=chicken">
              <div className="star-card h-full flex flex-col group overflow-hidden bg-[#FFE4E1]">
                <div className="bg-[#FFDD00] h-64 rounded-xl flex items-center justify-center text-8xl group-hover:scale-110 transition duration-500 border-4 border-black shadow-[inset_0px_-10px_0px_rgba(0,0,0,0.2)] rotate-2 group-hover:rotate-0">
                  🍗
                </div>
                <div className="pt-8 text-center flex-grow">
                  <h3 className="text-4xl font-black text-black mb-3 uppercase style-stroke">CRISPY CHICKEN</h3>
                  <p className="text-gray-800 text-xl font-bold border-t-4 border-black pt-4">Golden, crispy pieces with savory spices.</p>
                </div>
                <div className="mt-8 bg-black text-white text-center font-black py-4 rounded-xl text-xl uppercase group-hover:bg-primary transition-colors border-2 border-black">VIEW MENU ➔</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white border-y-8 border-black py-24 px-4 relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E31837_2px,transparent_2px)] [background-size:20px_20px]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="star-title text-6xl md:text-8xl text-center mb-16 rotate-1">WHY STAR BITES?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="star-card bg-[#FFDD00] text-center">
              <div className="bg-black text-white w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] border-4 border-black rotate-[-3deg]">
                <Clock className="w-12 h-12 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-black text-black mb-3 uppercase">Lightning Fast</h3>
              <p className="text-black font-bold">Your order arrives hot and fresh, always on time.</p>
            </div>

            <div className="star-card bg-[#E31837] text-white text-center">
              <div className="bg-white text-primary w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black rotate-[3deg]">
                <Sparkles className="w-12 h-12 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase">Premium Quality</h3>
              <p className="text-white font-bold">Fresh ingredients and time-tested recipes.</p>
            </div>

            <div className="star-card bg-[#FF8C00] text-center">
              <div className="bg-black text-white w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] border-4 border-black rotate-[-3deg]">
                <Award className="w-12 h-12 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-black text-black mb-3 uppercase">Best Prices</h3>
              <p className="text-black font-bold">Premium quality at affordable prices, guaranteed.</p>
            </div>

            <div className="star-card bg-black text-white text-center">
              <div className="bg-[#FFDD00] text-black w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] border-4 border-black rotate-[3deg] text-5xl">
                ⭐
              </div>
              <h3 className="text-2xl font-black text-[#FFDD00] mb-3 uppercase">Star Service</h3>
              <p className="text-gray-300 font-bold">Your satisfaction is always our priority.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="deals" className="bg-primary text-white py-24 px-4 relative overflow-hidden border-b-8 border-black">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMiIgZmlsbD0icmdiYSgwLDAsMCwwLjIpIi8+Cjwvc3ZnPg==')] opacity-30" />
        <div className="max-w-4xl mx-auto text-center relative z-10 bg-white p-12 rounded-3xl border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rotate-1">
          <h2 className="text-6xl md:text-8xl font-black mb-6 text-black style-stroke uppercase">READY TO ORDER?</h2>
          <p className="text-2xl md:text-3xl mb-10 font-bold text-black border-t-4 border-b-4 border-black py-4">Browse our delicious menu and get your favorites delivered fast!</p>
          <Link href="/menu">
            <button className="bg-black text-[#FFDD00] font-black text-3xl px-12 py-6 rounded-2xl hover:bg-gray-900 transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] active:scale-95 border-4 border-black uppercase">
              EXPLORE FULL MENU ➔
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
