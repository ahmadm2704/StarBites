'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
  X,
  LogOut,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface DailyRevenue {
  date: string
  revenue: number
  orders: number
}

interface TopProduct {
  name: string
  count: number
  revenue: number
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [statusBreakdown, setStatusBreakdown] = useState<any[]>([])
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    repeatCustomers: 0,
  })

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchAnalytics()
  }, [router])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)

      // Fetch orders and order items
      const [ordersRes, itemsRes, productsRes] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('order_items').select('*'),
        supabase.from('products').select('id, name'),
      ])

      const orders = ordersRes.data || []
      const items = itemsRes.data || []
      const products = productsRes.data || []

      // Calculate daily revenue
      const revenueMap: { [key: string]: { revenue: number; orders: number } } = {}
      orders.forEach(order => {
        const date = new Date(order.created_at).toISOString().split('T')[0]
        if (!revenueMap[date]) {
          revenueMap[date] = { revenue: 0, orders: 0 }
        }
        revenueMap[date].revenue += order.total_amount
        revenueMap[date].orders += 1
      })

      const dailyData = Object.entries(revenueMap)
        .map(([date, data]) => ({
          date,
          revenue: data.revenue,
          orders: data.orders,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-30) // Last 30 days

      setDailyRevenue(dailyData)

      // Calculate top products
      const productCounts: { [key: string]: { count: number; revenue: number } } = {}
      items.forEach(item => {
        if (!productCounts[item.product_id]) {
          productCounts[item.product_id] = { count: 0, revenue: 0 }
        }
        productCounts[item.product_id].count += item.quantity
        productCounts[item.product_id].revenue += item.unit_price * item.quantity
      })

      const topProds: TopProduct[] = Object.entries(productCounts)
        .map(([productId, data]) => {
          const product = products.find(p => p.id === productId)
          return {
            name: product?.name || 'Unknown',
            count: data.count,
            revenue: data.revenue,
          }
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      setTopProducts(topProds)

      // Status breakdown
      const statusCounts: { [key: string]: number } = {}
      orders.forEach(order => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
      })

      const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
      }))

      setStatusBreakdown(statusData)

      // Calculate metrics
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)
      const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
      const uniqueCustomers = new Set(orders.map(o => o.user_email)).size
      const repeatCustomers = orders.filter(o => {
        const email = o.user_email
        return orders.filter(order => order.user_email === email).length > 1
      }).length

      setMetrics({
        totalRevenue,
        avgOrderValue,
        conversionRate: (orders.length / uniqueCustomers) * 100,
        repeatCustomers: uniqueCustomers > 0 ? Math.round((repeatCustomers / uniqueCustomers) * 100) : 0,
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    router.push('/admin/login')
  }

  const handleExportReport = () => {
    // Create CSV report
    const reportData = `Star Bites Analytics Report\nGenerated: ${new Date().toLocaleString()}\n\nMetrics\nTotal Revenue,PKR ${metrics.totalRevenue.toFixed(2)}\nAverage Order Value,PKR ${metrics.avgOrderValue.toFixed(2)}\nRepeat Customer Rate,${metrics.repeatCustomers}%\n\nDaily Revenue\nDate,Revenue,Orders\n${dailyRevenue.map(d => `${d.date},${d.revenue},${d.orders}`).join('\n')}\n\nTop Products\nProduct,Quantity,Revenue\n${topProducts.map(p => `${p.name},${p.count},${p.revenue}`).join('\n')}`

    const blob = new Blob([reportData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `star-bites-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const COLORS = ['#DC2626', '#F97316', '#FFB800', '#3B82F6', '#8B5CF6']

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
          <Link href="/admin/dashboard" className="flex items-center gap-4 px-6 py-4 bg-white text-black font-black text-xl uppercase rounded-xl border-4 border-black hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            <span className="text-2xl">📊</span> DASHBOARD
          </Link>
          <Link href="/admin/products" className="flex items-center gap-4 px-6 py-4 bg-white text-black font-black text-xl uppercase rounded-xl border-4 border-black hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            <span className="text-2xl">🍔</span> PRODUCTS
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-4 px-6 py-4 bg-white text-black font-black text-xl uppercase rounded-xl border-4 border-black hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            <span className="text-2xl">🛒</span> ORDERS
          </Link>
          <Link href="/admin/inventory" className="flex items-center gap-4 px-6 py-4 bg-white text-black font-black text-xl uppercase rounded-xl border-4 border-black hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            <span className="text-2xl">📦</span> INVENTORY
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-4 px-6 py-4 bg-white text-black font-black text-xl uppercase rounded-xl border-4 border-black hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            <span className="text-2xl">👥</span> CUSTOMERS
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-4 px-6 py-4 bg-primary text-white font-black text-xl uppercase rounded-xl border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,221,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            <span className="text-2xl">📈</span> ANALYTICS
          </Link>
        </nav>

        <div className="absolute bottom-8 left-6 right-6">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-600 text-white font-black text-xl uppercase rounded-xl border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,221,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            <LogOut className="w-6 h-6 stroke-[3]" /> LOGOUT
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-[0px_8px_0px_0px_rgba(0,0,0,1)] border-b-8 border-black sticky top-0 z-40 mb-12">
          <div className="flex items-center justify-between p-6">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-3 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
              {isMenuOpen ? <X className="w-6 h-6 stroke-[3]" /> : <Menu className="w-6 h-6 stroke-[3]" />}
            </button>
            <h2 className="text-4xl font-black text-black uppercase tracking-tight ml-4 md:ml-0 flex-1">ANALYTICS & REPORTS</h2>
            <div className="flex items-center gap-6">
              <button
                onClick={handleExportReport}
                className="hidden md:flex items-center gap-3 px-6 py-3 bg-[#FFDD00] text-black font-black text-xl uppercase rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                <Download className="w-6 h-6 stroke-[3]" /> EXPORT CSV
              </button>
              <div className="w-14 h-14 bg-black text-[#FFDD00] rounded-xl flex items-center justify-center text-2xl font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] rotate-3">
                A
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Mobile Export Button */}
          <button
            onClick={handleExportReport}
            className="md:hidden w-full mb-8 flex items-center justify-center gap-3 px-6 py-4 bg-[#FFDD00] text-black font-black text-xl uppercase rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <Download className="w-6 h-6 stroke-[3]" /> EXPORT CSV
          </button>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-black font-black text-2xl uppercase animate-pulse">LOADING ANALYTICS...</p>
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div className="bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-8 border-black p-6 transform hover:-translate-y-2 transition-transform">
                  <p className="text-black font-black uppercase text-lg border-b-4 border-black pb-2 mb-4">Total Revenue</p>
                  <p className="text-4xl font-black text-primary">PKR {metrics.totalRevenue.toFixed(0)}</p>
                </div>
                <div className="bg-[#FFDD00] rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-8 border-black p-6 transform rotate-1 hover:rotate-0 transition-transform">
                  <p className="text-black font-black uppercase text-lg border-b-4 border-black pb-2 mb-4">Average Order Value</p>
                  <p className="text-4xl font-black text-black">PKR {metrics.avgOrderValue.toFixed(0)}</p>
                </div>
                <div className="bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-8 border-black p-6 transform -rotate-1 hover:rotate-0 transition-transform">
                  <p className="text-black font-black uppercase text-lg border-b-4 border-black pb-2 mb-4">Repeat Customer Rate</p>
                  <p className="text-4xl font-black text-green-600">{metrics.repeatCustomers}%</p>
                </div>
                <div className="bg-black text-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(227,24,55,1)] border-8 border-primary p-6 transform hover:-translate-y-2 transition-transform">
                  <p className="text-white font-black uppercase text-lg border-b-4 border-primary pb-2 mb-4">Avg Orders/Customer</p>
                  <p className="text-4xl font-black text-[#FFDD00]">{metrics.conversionRate.toFixed(1)}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-8 border-black p-8">
                  <h3 className="text-3xl font-black text-black uppercase mb-8 border-b-4 border-black pb-4">REVENUE TREND (LAST 30 DAYS)</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={dailyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="date" stroke="#000" tick={{ fill: '#000', fontWeight: 'bold' }} />
                      <YAxis stroke="#000" tick={{ fill: '#000', fontWeight: 'bold' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '4px solid #000', borderRadius: '12px', fontWeight: 'bold', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                      />
                      <Legend wrapperStyle={{ fontWeight: 'bold' }} />
                      <Line type="monotone" dataKey="revenue" stroke="#E31837" strokeWidth={4} dot={{ strokeWidth: 4, r: 4, fill: '#E31837' }} activeDot={{ r: 8 }} name="Revenue (PKR)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Status Breakdown */}
                <div className="bg-white rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-8 border-black p-8">
                  <h3 className="text-3xl font-black text-black uppercase mb-8 border-b-4 border-black pb-4">ORDER STATUS</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={statusBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="#000"
                        strokeWidth={4}
                      >
                        {statusBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '4px solid #000', borderRadius: '12px', fontWeight: 'bold', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-8 border-black p-8">
                <h3 className="text-3xl font-black text-black uppercase mb-8 border-b-4 border-black pb-4">TOP 5 PRODUCTS</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="name" stroke="#000" tick={{ fill: '#000', fontWeight: 'bold' }} />
                    <YAxis stroke="#000" tick={{ fill: '#000', fontWeight: 'bold' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '4px solid #000', borderRadius: '12px', fontWeight: 'bold', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                    />
                    <Legend wrapperStyle={{ fontWeight: 'bold' }} />
                    <Bar dataKey="count" fill="#E31837" stroke="#000" strokeWidth={4} name="Quantity Sold" />
                    <Bar dataKey="revenue" fill="#FFDD00" stroke="#000" strokeWidth={4} name="Revenue (PKR)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
