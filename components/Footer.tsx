'use client'

import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-4 border-t-8 border-primary">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image 
                src="/logo.png" 
                alt="Star Bites Logo" 
                width={60} 
                height={60}
                className="w-16 h-16 object-contain bg-white rounded-xl p-2 border-2 border-white"
              />
              <span className="text-3xl font-black text-primary style-stroke uppercase">STAR BITES</span>
            </div>
            <p className="text-white font-bold text-lg">Premium fast food delivered fresh to your door. HOT & READY!</p>
          </div>
          <div>
            <h4 className="font-black text-2xl mb-6 text-[#FFDD00] uppercase">QUICK LINKS</h4>
            <ul className="space-y-4 text-white font-bold">
              <li><Link href="/menu" className="hover:text-primary transition uppercase flex items-center gap-2">➔ MENU</Link></li>
              <li><Link href="/about" className="hover:text-primary transition uppercase flex items-center gap-2">➔ ABOUT</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition uppercase flex items-center gap-2">➔ CONTACT</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-2xl mb-6 text-[#FFDD00] uppercase">SUPPORT</h4>
            <ul className="space-y-4 text-white font-bold">
              <li><Link href="#" className="hover:text-primary transition uppercase flex items-center gap-2">➔ FAQ</Link></li>
              <li><Link href="#" className="hover:text-primary transition uppercase flex items-center gap-2">➔ TERMS</Link></li>
              <li><Link href="#" className="hover:text-primary transition uppercase flex items-center gap-2">➔ PRIVACY</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-2xl mb-6 text-[#FFDD00] uppercase">CONTACT US</h4>
            <div className="bg-[#222] p-4 rounded-xl border-2 border-gray-800">
              <p className="text-white mb-3 font-black text-xl">📞 +92 333 9686660</p>
              <p className="text-white font-black text-lg text-primary">📧 INFO@STARBITES.PK</p>
            </div>
          </div>
        </div>
        <div className="border-t-4 border-gray-800 pt-8 text-center text-white">
          <p className="font-black text-xl uppercase tracking-widest">&copy; 2026 STAR BITES. ALL RIGHTS RESERVED. ⭐</p>
        </div>
      </div>
    </footer>
  )
}
