'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Navbar />

      {/* Header */}
      <section className="relative bg-primary text-white py-16 px-4 border-b-8 border-black shadow-[0px_8px_0px_0px_rgba(0,0,0,1)] mb-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase tracking-tighter style-stroke text-black">CONTACT US</h1>
          <p className="text-2xl font-black bg-black text-white inline-block px-6 py-2 rounded-xl transform -rotate-2 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,221,0,1)]">
            WE'D LOVE TO HEAR FROM YOU!
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 max-w-6xl mx-auto mb-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-8">
            <h2 className="text-4xl font-black uppercase mb-8 text-black">SEND A MESSAGE</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xl font-black mb-2 uppercase text-black">YOUR NAME</label>
                <input type="text" className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 text-lg font-bold focus:outline-none focus:border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="JOHN DOE" />
              </div>
              <div>
                <label className="block text-xl font-black mb-2 uppercase text-black">YOUR EMAIL</label>
                <input type="email" className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 text-lg font-bold focus:outline-none focus:border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="JOHN@EXAMPLE.COM" />
              </div>
              <div>
                <label className="block text-xl font-black mb-2 uppercase text-black">YOUR MESSAGE</label>
                <textarea rows={5} className="w-full bg-gray-50 border-4 border-black rounded-xl p-4 text-lg font-bold focus:outline-none focus:border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="TELL US EVERYTHING..."></textarea>
              </div>
              <button className="w-full bg-primary text-white font-black text-2xl uppercase tracking-widest py-4 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 transition-all">
                SEND NOW 🚀
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-secondary border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-8 transform rotate-1">
              <h3 className="text-3xl font-black uppercase mb-4 text-black">LOCATION</h3>
              <p className="text-2xl font-bold text-gray-900">
                123 FAST FOOD AVENUE<br />
                FOOD DISTRICT, CITY 45678
              </p>
            </div>
            
            <div className="bg-[#FFF9C4] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-8 transform -rotate-1">
              <h3 className="text-3xl font-black uppercase mb-4 text-black">HOURS</h3>
              <ul className="text-2xl font-bold text-gray-900 space-y-2">
                <li className="flex justify-between border-b-4 border-black pb-2"><span>MON - FRI:</span> <span>10AM - 11PM</span></li>
                <li className="flex justify-between border-b-4 border-black pb-2"><span>SATURDAY:</span> <span>10AM - 1AM</span></li>
                <li className="flex justify-between pb-2"><span>SUNDAY:</span> <span>12PM - 10PM</span></li>
              </ul>
            </div>
            
            <div className="bg-primary text-white border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-8 transform rotate-1">
              <h3 className="text-3xl font-black uppercase mb-4">DIRECT CONTACT</h3>
              <p className="text-3xl font-black mb-2">📞 +92 333 9686660</p>
              <p className="text-2xl font-black">📧 INFO@STARBITES.PK</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
