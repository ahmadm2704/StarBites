'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X } from 'lucide-react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCartCount = () => {
      const cart = localStorage.getItem('cart')
      if (cart) {
        const items = JSON.parse(cart)
        setCartCount(items.length)
      }
    }
    
    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    // Custom event for same-window updates
    window.addEventListener('cartUpdated', updateCartCount)
    
    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
              <Image 
                src="/logo.png" 
                alt="Star Bites Logo" 
                width={50} 
                height={50}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-primary tracking-tighter style-stroke-sm leading-none">STAR BITES</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 bg-black rounded-full px-6 py-2 shadow-[2px_2px_0px_0px_rgba(227,24,55,1)] border-2 border-black transform -rotate-1 hover:rotate-0 transition-all">
            <Link href="/menu" className="text-white hover:text-secondary font-black tracking-widest uppercase transition duration-300 text-sm">
              MENU
            </Link>
            <Link href="/about" className="text-white hover:text-secondary font-black tracking-widest uppercase transition duration-300 text-sm">
              ABOUT
            </Link>
            <Link href="/contact" className="text-white hover:text-secondary font-black tracking-widest uppercase transition duration-300 text-sm">
              CONTACT
            </Link>
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative group">
              <div className="bg-primary text-white p-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-300 active:scale-95">
                <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-black shadow-[1px_1px_0px_0px_rgba(255,221,0,1)] animate-bounce border-2 border-black">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 sm:p-3 bg-white border-2 sm:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 rounded-xl transition"
            >
              {isMenuOpen ? <X className="w-6 h-6 sm:w-8 sm:h-8 stroke-[3]" /> : <Menu className="w-6 h-6 sm:w-8 sm:h-8 stroke-[3]" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 border-t-4 border-black pt-6 space-y-4 bg-white">
            <Link href="/menu" className="block py-3 text-center bg-black text-white hover:text-secondary font-black text-xl uppercase rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(227,24,55,1)]">
              MENU
            </Link>
            <Link href="/about" className="block py-3 text-center bg-black text-white hover:text-secondary font-black text-xl uppercase rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(227,24,55,1)]">
              ABOUT
            </Link>
            <Link href="/contact" className="block py-3 text-center bg-black text-white hover:text-secondary font-black text-xl uppercase rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(227,24,55,1)]">
              CONTACT
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
