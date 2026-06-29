'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
  X,
  LogOut,
  Eye,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface Order {
  id: string
  user_email: string
  phone: string
  status: string
  total_amount: number
  created_at: string
  delivery_address: string
}

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  unit_price: number
  special_instructions: string
}

export default function OrdersPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchOrders()
  }, [router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)

      if (error) throw error
      if (data) setOrderItems(data)
    } catch (error) {
      console.error('Error fetching order items:', error)
    }
  }

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order)
    await fetchOrderItems(order.id)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId)

      if (error) throw error
      
      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order status')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    router.push('/admin/login')
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus)

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
          <Link href="/admin/orders" className="flex items-center gap-4 px-6 py-4 bg-primary text-white font-black text-xl uppercase rounded-xl border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,221,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            <span className="text-2xl">🛒</span> ORDERS
          </Link>
          <Link href="/admin/inventory" className="flex items-center gap-4 px-6 py-4 bg-white text-black font-black text-xl uppercase rounded-xl border-4 border-black hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            <span className="text-2xl">📦</span> INVENTORY
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-4 px-6 py-4 bg-white text-black font-black text-xl uppercase rounded-xl border-4 border-black hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
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
            <h2 className="text-4xl font-black text-black uppercase tracking-tight ml-4 md:ml-0">MANAGE ORDERS</h2>
            <div className="w-14 h-14 bg-black text-[#FFDD00] rounded-xl flex items-center justify-center text-2xl font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] rotate-3">
              A
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Filter */}
          <div className="mb-12 flex flex-wrap gap-4">
            {['all', 'pending', 'confirmed', 'preparing', 'ready', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-3 font-black uppercase text-lg border-4 border-black rounded-xl transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${
                  filterStatus === status
                    ? 'bg-primary text-white'
                    : 'bg-white text-black'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-8 border-black overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFDD00] border-b-8 border-black text-black text-xl">
                  <th className="px-6 py-5 font-black uppercase">Order ID</th>
                  <th className="px-6 py-5 font-black uppercase">Customer</th>
                  <th className="px-6 py-5 font-black uppercase">Amount</th>
                  <th className="px-6 py-5 font-black uppercase">Status</th>
                  <th className="px-6 py-5 font-black uppercase">Date</th>
                  <th className="px-6 py-5 font-black uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="text-lg font-bold">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-black uppercase text-xl">
                      LOADING ORDERS...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-black uppercase text-xl">
                      NO ORDERS FOUND.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="border-b-4 border-black hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-mono font-black text-black">{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-black text-black">{order.user_email}</p>
                          <p className="text-gray-600 font-bold">{order.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-primary">PKR {order.total_amount.toFixed(0)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-4 py-2 rounded-xl border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-sm ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-bold uppercase">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewOrder(order)}
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-[16px_16px_0px_0px_rgba(227,24,55,1)] border-8 border-black max-w-3xl w-full max-h-[90vh] overflow-y-auto transform rotate-1">
            <div className="sticky top-0 bg-[#FFDD00] border-b-8 border-black p-8 flex justify-between items-center z-10">
              <h3 className="text-4xl font-black text-black uppercase tracking-tight">ORDER DETAILS</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-black text-white p-2 rounded-xl border-4 border-black hover:bg-primary transition-colors"
              >
                <X className="w-8 h-8 stroke-[3]" />
              </button>
            </div>

            <div className="p-8 space-y-8 bg-white">
              {/* Order Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 border-4 border-black rounded-xl">
                  <p className="text-sm font-bold text-gray-500 uppercase">Order ID</p>
                  <p className="font-mono font-black text-black">{selectedOrder.id.slice(0, 8)}</p>
                </div>
                <div className="bg-gray-50 p-4 border-4 border-black rounded-xl">
                  <p className="text-sm font-bold text-gray-500 uppercase">Total Amount</p>
                  <p className="font-black text-2xl text-primary">PKR {selectedOrder.total_amount.toFixed(0)}</p>
                </div>
                <div className="bg-gray-50 p-4 border-4 border-black rounded-xl">
                  <p className="text-sm font-bold text-gray-500 uppercase">Date</p>
                  <p className="font-black text-black">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 p-4 border-4 border-black rounded-xl col-span-2 md:col-span-1">
                  <p className="text-sm font-bold text-gray-500 uppercase">Customer Email</p>
                  <p className="font-black text-black break-words">{selectedOrder.user_email}</p>
                </div>
                <div className="bg-gray-50 p-4 border-4 border-black rounded-xl col-span-2 md:col-span-1">
                  <p className="text-sm font-bold text-gray-500 uppercase">Phone</p>
                  <p className="font-black text-black">{selectedOrder.phone}</p>
                </div>
                <div className="bg-gray-50 p-4 border-4 border-black rounded-xl col-span-2 md:col-span-3">
                  <p className="text-sm font-bold text-gray-500 uppercase">Delivery Address</p>
                  <p className="font-black text-black">{selectedOrder.delivery_address}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-black text-black text-2xl uppercase mb-4">Items</h4>
                <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border-4 border-black">
                  {orderItems.map(item => (
                    <div key={item.id} className="flex justify-between text-xl border-b-4 border-dashed border-gray-300 pb-2 last:border-0 last:pb-0">
                      <span className="font-black">Item × {item.quantity}</span>
                      <span className="font-black text-primary">PKR {(item.unit_price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update */}
              <div>
                <p className="text-xl font-black text-black uppercase mb-4">Update Status</p>
                <div className="flex flex-wrap gap-3">
                  {['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      className={`px-6 py-3 rounded-xl font-black uppercase text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all ${
                        selectedOrder.status === status
                          ? 'bg-primary text-white'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
