'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Navbar />

      {/* Header */}
      <section className="relative bg-primary text-white py-16 px-4 border-b-8 border-black shadow-[0px_8px_0px_0px_rgba(0,0,0,1)] mb-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase tracking-tighter style-stroke text-black">OUR STORY</h1>
          <p className="text-2xl font-black bg-black text-white inline-block px-6 py-2 rounded-xl transform rotate-2 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,221,0,1)]">
            HOW STAR BITES BEGAN!
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 max-w-5xl mx-auto mb-20">
        <div className="bg-white border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="bg-secondary p-4 rounded-3xl border-4 border-black transform -rotate-3 hover:rotate-0 transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Image 
                  src="/logo.png" 
                  alt="Star Bites Logo" 
                  width={400} 
                  height={400}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-black">MORE THAN JUST FAST FOOD.</h2>
              <div className="space-y-4 text-xl font-bold text-gray-800">
                <p>
                  Star Bites was born out of a simple craving: perfection. We didn't just want to make burgers; we wanted to craft the juiciest, most flavorful masterpieces you've ever tasted.
                </p>
                <p>
                  Every pizza is baked to a golden crisp, every piece of chicken is fried with our secret blend of spices, and every order is prepared with an obsession for quality.
                </p>
                <p className="bg-primary text-white p-4 rounded-xl border-4 border-black transform rotate-1">
                  We don't cut corners. We only serve food that blows your mind. Period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
