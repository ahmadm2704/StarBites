'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
  X,
  LogOut,
  Eye,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Customer {
  email: string
  phone: string
  order_count: number
  total_spent: number
  last_order: string
}

export default function CustomersPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchCustomers()
  }, [router])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      // Fetch all orders
      const { data: orders, error } = await supabase
        .from('orders')
        .select('user_email, phone, total_amount, created_at')

      if (error) throw error
      
      // Group by email
      const customerMap: { [key: string]: Customer } = {}
      
      orders.forEach(order => {
        if (!customerMap[order.user_email]) {
          customerMap[order.user_email] = {
            email: order.user_email,
            phone: order.phone,
            order_count: 0,
            total_spent: 0,
            last_order: order.created_at,
          }
        }
        customerMap[order.user_email].order_count += 1
        customerMap[order.user_email].total_spent += order.total_amount
        
        // Update last order if this one is newer
        if (new Date(order.created_at) > new Date(customerMap[order.user_email].last_order)) {
          customerMap[order.user_email].last_order = order.created_at
        }
      })

      const customerList = Object.values(customerMap).sort((a, b) =>
        new Date(b.last_order).getTime() - new Date(a.last_order).getTime()
      )

      setCustomers(customerList)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    router.push('/admin/login')
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
          <Link href="/admin/customers" className="flex items-center gap-4 px-6 py-4 bg-primary text-white font-black text-xl uppercase rounded-xl border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,221,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            <span className="text-2xl">👥</span> CUSTOMERS
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-4 px-6 py-4 bg-white text-black font-black text-xl uppercase rounded-xl border-4 border-black hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
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
            <h2 className="text-4xl font-black text-black uppercase tracking-tight ml-4 md:ml-0">CUSTOMER MANAGEMENT</h2>
            <div className="w-14 h-14 bg-black text-[#FFDD00] rounded-xl flex items-center justify-center text-2xl font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] rotate-3">
              A
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Total Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-8 border-black p-8 transform -rotate-1 hover:rotate-0 transition-transform">
              <p className="text-black font-black uppercase text-xl border-b-4 border-black pb-2 mb-4">Total Customers</p>
              <p className="text-6xl font-black text-primary style-stroke-sm">{customers.length}</p>
            </div>
            <div className="bg-[#FFDD00] rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-8 border-black p-8 transform translate-y-2 hover:translate-y-0 transition-transform">
              <p className="text-black font-black uppercase text-xl border-b-4 border-black pb-2 mb-4">Average Orders</p>
              <p className="text-6xl font-black text-black">
                {customers.length > 0
                  ? (customers.reduce((sum, c) => sum + c.order_count, 0) / customers.length).toFixed(1)
                  : '0'}
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-8 border-black p-8 transform rotate-1 hover:rotate-0 transition-transform">
              <p className="text-black font-black uppercase text-xl border-b-4 border-black pb-2 mb-4">Total Revenue</p>
              <p className="text-4xl font-black text-[#FFDD00] style-stroke-sm">
                PKR {customers.reduce((sum, c) => sum + c.total_spent, 0).toFixed(0)}
              </p>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-8 border-black overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black border-b-8 border-black text-[#FFDD00] text-xl">
                  <th className="px-6 py-5 font-black uppercase">Email</th>
                  <th className="px-6 py-5 font-black uppercase">Phone</th>
                  <th className="px-6 py-5 font-black uppercase">Orders</th>
                  <th className="px-6 py-5 font-black uppercase">Total Spent</th>
                  <th className="px-6 py-5 font-black uppercase">Last Order</th>
                  <th className="px-6 py-5 font-black uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="text-lg font-bold">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-black uppercase text-xl">
                      LOADING CUSTOMERS...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-black uppercase text-xl">
                      NO CUSTOMERS FOUND.
                    </td>
                  </tr>
                ) : (
                  customers.map(customer => (
                    <tr key={customer.email} className="border-b-4 border-black hover:bg-[#FFF9C4] transition">
                      <td className="px-6 py-4 font-black text-black">{customer.email}</td>
                      <td className="px-6 py-4 font-black text-gray-600">{customer.phone}</td>
                      <td className="px-6 py-4">
                        <span className="bg-primary text-white px-3 py-1 rounded-xl border-2 border-black font-black">
                          {customer.order_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-green-600">PKR {customer.total_spent.toFixed(0)}</td>
                      <td className="px-6 py-4 text-gray-800 font-bold uppercase">
                        {new Date(customer.last_order).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-3 bg-white text-black rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFDD00] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-2 font-black uppercase"
                        >
                          <Eye className="w-5 h-5 stroke-[3]" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-[16px_16px_0px_0px_rgba(227,24,55,1)] border-8 border-black max-w-md w-full transform -rotate-2">
            <div className="bg-[#FFDD00] border-b-8 border-black p-8 flex justify-between items-center rounded-t-2xl">
              <h3 className="text-3xl font-black text-black uppercase tracking-tight">CUSTOMER DETAILS</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="bg-black text-white p-2 rounded-xl border-4 border-black hover:bg-primary transition-colors"
              >
                <X className="w-6 h-6 stroke-[3]" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-gray-50 p-4 border-4 border-black rounded-xl">
                <p className="text-sm font-bold text-gray-500 uppercase">Email</p>
                <p className="font-black text-black text-xl break-words">{selectedCustomer.email}</p>
              </div>
              <div className="bg-gray-50 p-4 border-4 border-black rounded-xl">
                <p className="text-sm font-bold text-gray-500 uppercase">Phone</p>
                <p className="font-black text-black text-xl">{selectedCustomer.phone}</p>
              </div>
              <div className="bg-gray-50 p-4 border-4 border-black rounded-xl">
                <p className="text-sm font-bold text-gray-500 uppercase">Total Orders</p>
                <p className="text-3xl font-black text-primary style-stroke-sm">{selectedCustomer.order_count}</p>
              </div>
              <div className="bg-gray-50 p-4 border-4 border-black rounded-xl">
                <p className="text-sm font-bold text-gray-500 uppercase">Total Spent</p>
                <p className="text-3xl font-black text-green-600">PKR {selectedCustomer.total_spent.toFixed(0)}</p>
              </div>
              <div className="bg-gray-50 p-4 border-4 border-black rounded-xl">
                <p className="text-sm font-bold text-gray-500 uppercase">Last Order</p>
                <p className="font-black text-black text-xl">{new Date(selectedCustomer.last_order).toLocaleString()}</p>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-full px-6 py-4 bg-primary text-white font-black text-2xl uppercase rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
