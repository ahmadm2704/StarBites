'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Users,
  TrendingUp,
  LogOut,
  Menu,
  X,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  totalCustomers: number
  todayOrders: number
  topProduct: { name: string; count: number } | null
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    todayOrders: 0,
    topProduct: null,
  })
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    setIsAuthorized(true)
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')

      if (ordersError) throw ordersError

      // Fetch order items for revenue and top product
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('product_id, unit_price, quantity')

      if (itemsError) throw itemsError

      // Fetch unique customers
      const { data: customers, error: customersError } = await supabase
        .from('orders')
        .select('customer_email')

      if (customersError) throw customersError

      // Calculate stats
      const totalRevenue = orderItems.reduce(
        (sum, item) => sum + (item.unit_price * item.quantity),
        0
      )

      const pendingOrders = orders.filter(o => o.status === 'pending').length
      const uniqueCustomers = new Set(customers.map(c => c.customer_email)).size

      // Get today's orders
      const today = new Date().toISOString().split('T')[0]
      const todayOrders = orders.filter(o => o.created_at.startsWith(today)).length

      // Get top product
      const productCounts: { [key: string]: number } = {}
      orderItems.forEach(item => {
        productCounts[item.product_id] = (productCounts[item.product_id] || 0) + item.quantity
      })

      let topProductId = null
      let maxCount = 0
      for (const [productId, count] of Object.entries(productCounts)) {
        if (count > maxCount) {
          maxCount = count
          topProductId = productId
        }
      }

      let topProduct = null
      if (topProductId) {
        const { data: productData } = await supabase
          .from('products')
          .select('name')
          .eq('id', topProductId)
          .single()

        if (productData) {
          topProduct = { name: productData.name, count: maxCount }
        }
      }

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        totalCustomers: uniqueCustomers,
        todayOrders,
        topProduct,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    router.push('/admin/login')
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] text-center animate-pulse">
          <div className="text-8xl mb-4">🍔</div>
          <p className="text-3xl font-black text-black uppercase">REDIRECTING TO LOGIN...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9C4] selection:bg-primary selection:text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-black text-white border-r-8 border-primary transform transition-transform duration-300 shadow-[8px_0px_0px_0px_rgba(0,0,0,1)] ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static`}>
        <div className="p-8 border-b-8 border-primary bg-primary text-black">
          <h1 className="text-4xl font-black uppercase style-stroke-sm text-black">STAR BITES ADMIN</h1>
          <p className="text-xl font-bold mt-2 text-white bg-black inline-block px-3 py-1 rounded-lg transform -rotate-2">MANAGEMENT PORTAL</p>
        </div>

        <nav className="p-6 space-y-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-4 px-6 py-4 bg-primary text-white font-black text-xl uppercase rounded-xl border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,221,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <LayoutDashboard className="w-6 h-6 stroke-[3]" />
            DASHBOARD
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-4 px-6 py-4 bg-white text-black font-black text-xl uppercase rounded-xl border-4 border-black hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            <UtensilsCrossed className="w-6 h-6 stroke-[3]" />
            PRODUCTS
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-4 px-6 py-4 bg-white text-black font-black text-xl uppercase rounded-xl border-4 border-black hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            <ShoppingCart className="w-6 h-6 stroke-[3]" />
            ORDERS
          </Link>
          <Link
            href="/admin/inventory"
            className="flex items-center gap-4 px-6 py-4 bg-white text-black font-black text-xl uppercase rounded-xl border-4 border-black hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            <TrendingUp className="w-6 h-6 stroke-[3]" />
            INVENTORY
          </Link>
          <Link
            href="/admin/customers"
            className="flex items-center gap-4 px-6 py-4 bg-white text-black font-black text-xl uppercase rounded-xl border-4 border-black hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            <Users className="w-6 h-6 stroke-[3]" />
            CUSTOMERS
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-4 px-6 py-4 bg-white text-black font-black text-xl uppercase rounded-xl border-4 border-black hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            <TrendingUp className="w-6 h-6 stroke-[3]" />
            ANALYTICS
          </Link>
        </nav>

        <div className="absolute bottom-8 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-600 text-white font-black text-xl uppercase rounded-xl border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,221,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <LogOut className="w-6 h-6 stroke-[3]" />
            LOGOUT
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-[0px_8px_0px_0px_rgba(0,0,0,1)] border-b-8 border-black sticky top-0 z-40 mb-12">
          <div className="flex items-center justify-between p-6">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl"
            >
              {isMenuOpen ? <X className="w-6 h-6 stroke-[3]" /> : <Menu className="w-6 h-6 stroke-[3]" />}
            </button>
            <h2 className="text-4xl font-black text-black uppercase tracking-tight ml-4 md:ml-0">DASHBOARD OVERVIEW</h2>
            <div className="w-14 h-14 bg-black text-[#FFDD00] rounded-xl flex items-center justify-center text-2xl font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] rotate-3">
              A
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block bg-white p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-6xl mb-4 animate-bounce-gentle">📊</div>
                <p className="text-2xl font-black text-black uppercase">LOADING STATISTICS...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {/* Total Orders */}
                <div className="star-card bg-white transform -rotate-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-800 text-lg font-bold uppercase tracking-widest mb-2">TOTAL ORDERS</p>
                      <p className="text-5xl font-black text-primary style-stroke-sm">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-primary p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <ShoppingCart className="w-8 h-8 text-white stroke-[3]" />
                    </div>
                  </div>
                </div>

                {/* Total Revenue */}
                <div className="star-card bg-[#FFDD00] transform rotate-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 text-lg font-bold uppercase tracking-widest mb-2">TOTAL REVENUE</p>
                      <p className="text-5xl font-black text-black">RS. {stats.totalRevenue.toFixed(0)}</p>
                    </div>
                    <div className="bg-black p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                      <TrendingUp className="w-8 h-8 text-[#FFDD00] stroke-[3]" />
                    </div>
                  </div>
                </div>

                {/* Pending Orders */}
                <div className="star-card bg-white transform -rotate-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-800 text-lg font-bold uppercase tracking-widest mb-2">PENDING ORDERS</p>
                      <p className="text-5xl font-black text-primary style-stroke-sm">{stats.pendingOrders}</p>
                    </div>
                    <div className="bg-primary p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <AlertCircle className="w-8 h-8 text-white stroke-[3]" />
                    </div>
                  </div>
                </div>

                {/* Total Customers */}
                <div className="star-card bg-[#FFDD00] transform rotate-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 text-lg font-bold uppercase tracking-widest mb-2">CUSTOMERS</p>
                      <p className="text-5xl font-black text-black">{stats.totalCustomers}</p>
                    </div>
                    <div className="bg-black p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                      <Users className="w-8 h-8 text-[#FFDD00] stroke-[3]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Today's Orders */}
                <div className="bg-white border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-8">
                  <h3 className="text-3xl font-black text-black uppercase mb-8 tracking-tight">TODAY'S PERFORMANCE</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b-4 border-dashed border-gray-300 pb-4">
                      <span className="text-xl font-bold text-gray-600 uppercase">ORDERS TODAY</span>
                      <span className="font-black text-4xl text-primary">{stats.todayOrders}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xl font-bold text-gray-600 uppercase">TOP PRODUCT</span>
                      <span className="font-black text-2xl text-black bg-[#FFDD00] px-4 py-2 rounded-lg border-4 border-black transform rotate-2">
                        {stats.topProduct ? `${stats.topProduct.name.toUpperCase()} (${stats.topProduct.count})` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-black border-8 border-primary shadow-[12px_12px_0px_0px_rgba(255,221,0,1)] rounded-3xl p-8">
                  <h3 className="text-3xl font-black text-white uppercase mb-8 tracking-tight">QUICK ACTIONS</h3>
                  <div className="space-y-4">
                    <Link href="/admin/products" className="block">
                      <button className="w-full text-left px-6 py-4 bg-primary text-white font-black text-xl uppercase rounded-xl border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,221,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-between">
                        <span>ADD NEW PRODUCT</span>
                        <span className="text-3xl leading-none">+</span>
                      </button>
                    </Link>
                    <Link href="/admin/orders" className="block">
                      <button className="w-full text-left px-6 py-4 bg-white text-black font-black text-xl uppercase rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-between">
                        <span>VIEW ALL ORDERS</span>
                        <span>➔</span>
                      </button>
                    </Link>
                    <Link href="/admin/analytics" className="block">
                      <button className="w-full text-left px-6 py-4 bg-white text-black font-black text-xl uppercase rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-between">
                        <span>VIEW ANALYTICS</span>
                        <span>📈</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
