'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
  X,
  LogOut,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface InventoryItem {
  id: string
  product_id: string
  quantity_in_stock: number
  reorder_level: number
  last_restocked_at: string
}

interface Product {
  id: string
  name: string
}

export default function InventoryPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [invRes, prodRes] = await Promise.all([
        supabase.from('inventory').select('*'),
        supabase.from('products').select('id, name'),
      ])

      if (invRes.data) setInventory(invRes.data)
      if (prodRes.data) setProducts(prodRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (id: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('inventory')
        .update({
          quantity_in_stock: newQuantity,
          last_restocked_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
      
      setInventory(inventory.map(item =>
        item.id === id
          ? { ...item, quantity_in_stock: newQuantity, last_restocked_at: new Date().toISOString() }
          : item
      ))
      setEditingId(null)
    } catch (error) {
      console.error('Error updating inventory:', error)
      alert('Failed to update inventory')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    router.push('/admin/login')
  }

  const getLowStockItems = () => inventory.filter(item => item.quantity_in_stock <= item.reorder_level)

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
          <Link href="/admin/inventory" className="flex items-center gap-4 px-6 py-4 bg-primary text-white font-black text-xl uppercase rounded-xl border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,221,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
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
            <h2 className="text-4xl font-black text-black uppercase tracking-tight ml-4 md:ml-0">MANAGE INVENTORY</h2>
            <div className="w-14 h-14 bg-black text-[#FFDD00] rounded-xl flex items-center justify-center text-2xl font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] rotate-3">
              A
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Low Stock Alert */}
          {getLowStockItems().length > 0 && (
            <div className="bg-[#FFDD00] border-8 border-black rounded-3xl p-6 mb-12 flex items-center gap-6 shadow-[12px_12px_0px_0px_rgba(227,24,55,1)] transform -rotate-1">
              <div className="bg-primary text-white p-4 rounded-xl border-4 border-black animate-bounce-gentle">
                <AlertTriangle className="w-10 h-10 stroke-[3]" />
              </div>
              <div>
                <p className="font-black text-black text-3xl uppercase">Low Stock Alert!</p>
                <p className="text-xl font-bold text-gray-800 uppercase mt-2">
                  <span className="bg-black text-white px-3 py-1 rounded border-2 border-black mr-2">{getLowStockItems().length}</span> 
                  ITEM(S) BELOW REORDER LEVEL. PLEASE RESTOCK!
                </p>
              </div>
            </div>
          )}

          {/* Inventory Table */}
          <div className="bg-white rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-8 border-black overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFDD00] border-b-8 border-black text-black text-xl">
                  <th className="px-6 py-5 font-black uppercase">Product</th>
                  <th className="px-6 py-5 font-black uppercase">Current Stock</th>
                  <th className="px-6 py-5 font-black uppercase">Reorder Level</th>
                  <th className="px-6 py-5 font-black uppercase">Status</th>
                  <th className="px-6 py-5 font-black uppercase">Last Restocked</th>
                  <th className="px-6 py-5 font-black uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="text-lg font-bold">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-black uppercase text-xl">
                      LOADING INVENTORY...
                    </td>
                  </tr>
                ) : inventory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-black uppercase text-xl">
                      NO INVENTORY ITEMS FOUND.
                    </td>
                  </tr>
                ) : (
                  inventory.map(item => {
                    const product = products.find(p => p.id === item.product_id)
                    const isLowStock = item.quantity_in_stock <= item.reorder_level
                    return (
                      <tr key={item.id} className={`border-b-4 border-black hover:bg-gray-50 transition ${isLowStock ? 'bg-red-50' : ''}`}>
                        <td className="px-6 py-4 font-black text-black uppercase">{product?.name || 'Unknown'}</td>
                        <td className="px-6 py-4">
                          {editingId === item.id ? (
                            <input
                              type="number"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(e.target.value)}
                              className="w-24 px-4 py-3 bg-white border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-xl"
                            />
                          ) : (
                            <span className={`font-black text-2xl ${isLowStock ? 'text-primary' : 'text-green-600'}`}>
                              {item.quantity_in_stock}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-black text-gray-600">{item.reorder_level}</td>
                        <td className="px-6 py-4">
                          <span className={`px-4 py-2 rounded-xl border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-sm ${
                            isLowStock
                              ? 'bg-primary text-white'
                              : 'bg-green-400 text-black'
                          }`}>
                            {isLowStock ? 'LOW STOCK' : 'OK'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800 uppercase">
                          {item.last_restocked_at ? new Date(item.last_restocked_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === item.id ? (
                            <div className="flex gap-3">
                              <button
                                onClick={() => updateQuantity(item.id, parseInt(editQuantity))}
                                className="px-4 py-3 bg-green-500 text-black font-black uppercase rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                              >
                                SAVE
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-4 py-3 bg-white text-black font-black uppercase rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                              >
                                CANCEL
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingId(item.id)
                                setEditQuantity((item.quantity_in_stock || 0).toString())
                              }}
                              className="px-6 py-3 bg-black text-[#FFDD00] font-black uppercase rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                            >
                              UPDATE
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
