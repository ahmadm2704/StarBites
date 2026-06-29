'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // For demo purposes, we're using a simple validation
      // In production, you'd verify against your admin_users table
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminEmail', email)
        router.push('/admin/dashboard')
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary selection:bg-black selection:text-white flex items-center justify-center p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMiIgZmlsbD0icmdiYSgwLDAsMCwwLjIpIi8+Cjwvc3ZnPg==')]">
      <div className="bg-white rounded-3xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-8 border-black w-full max-w-md p-8 transform rotate-1">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-black text-[#FFDD00] p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,221,0,1)] w-fit mx-auto mb-6 transform -rotate-3 text-4xl">
            ⭐
          </div>
          <h1 className="text-4xl font-black text-black uppercase style-stroke-sm tracking-tight leading-none mb-2">STAR BITES</h1>
          <p className="text-2xl font-black bg-[#FFDD00] inline-block px-4 py-1 rounded-lg border-4 border-black uppercase transform rotate-2">ADMIN PORTAL</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-4 border-red-500 rounded-xl p-4 mb-6 flex gap-3 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] transform -rotate-1">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 stroke-[3]" />
            <p className="text-red-700 font-black uppercase text-lg">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-lg font-black text-black mb-2 uppercase">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FFDD00] transition text-xl font-bold placeholder-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              placeholder="ADMIN@STARBITES.PK"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-black text-black mb-2 uppercase">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FFDD00] transition text-xl font-bold placeholder-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-[#FFDD00] hover:text-white hover:bg-gray-900 font-black uppercase tracking-widest py-5 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(227,24,55,1)] transition-all text-xl mt-4 active:scale-95"
          >
            {loading ? 'AUTHENTICATING...' : 'ACCESS PORTAL ➔'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-6 bg-[#FFF9C4] rounded-xl border-4 border-black transform -rotate-1">
          <p className="text-lg font-black text-black uppercase mb-3">DEMO CREDENTIALS:</p>
          <div className="font-bold text-gray-800 text-lg">
            <p>📧 <span className="font-black text-primary ml-2">admin@starbites.pk</span></p>
            <p className="mt-2">🔑 <span className="font-black text-primary ml-2">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
