'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
  X,
  Plus,
  Trash2,
  Edit,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category_id: string
  is_available: boolean
  image_url?: string
}

interface Category {
  id: string
  name: string
}

export default function ProductsPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    is_available: true,
    image_url: '',
  })

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
      const [categoriesRes, productsRes] = await Promise.all([
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
        supabase.from('products').select('*'),
      ])

      if (categoriesRes.data) setCategories(categoriesRes.data)
      if (productsRes.data) setProducts(productsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return
      
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${fileName}`

      setUploadingImage(true)

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      setFormData({ ...formData, image_url: data.publicUrl })
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please check if the bucket exists and permissions are correct.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.category_id || !formData.price) {
      alert('Please fill all required fields')
      return
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        is_available: formData.is_available,
        image_url: formData.image_url || null,
      }

      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData])

        if (error) throw error
      }

      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
    }
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category_id: product.category_id,
      is_available: product.is_available,
      image_url: product.image_url || '',
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      is_available: true,
      image_url: '',
    })
    setEditingId(null)
    setShowForm(false)
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
          <Link href="/admin/products" className="flex items-center gap-4 px-6 py-4 bg-primary text-white font-black text-xl uppercase rounded-xl border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,221,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
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
            <h2 className="text-4xl font-black text-black uppercase tracking-tight ml-4 md:ml-0">MANAGE PRODUCTS</h2>
            <div className="w-14 h-14 bg-black text-[#FFDD00] rounded-xl flex items-center justify-center text-2xl font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(227,24,55,1)] rotate-3">
              A
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Add Product Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-black text-[#FFDD00] font-black text-xl uppercase px-8 py-4 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(227,24,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-3"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
              {showForm ? 'CANCEL' : 'ADD NEW PRODUCT'}
            </button>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-8 border-black p-8 mb-12">
              <h3 className="text-3xl font-black text-black uppercase tracking-tight mb-8">
                {editingId ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-lg font-black text-black mb-2 uppercase">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FFDD00] transition text-xl font-bold placeholder-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      placeholder="E.G., MARGHERITA PIZZA"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-black text-black mb-2 uppercase">
                      Category *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FFDD00] transition text-xl font-bold placeholder-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <option value="">SELECT CATEGORY</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-lg font-black text-black mb-2 uppercase">
                      Price (PKR) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FFDD00] transition text-xl font-bold placeholder-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-black text-black mb-2 uppercase">
                      Status
                    </label>
                    <select
                      value={formData.is_available ? 'available' : 'unavailable'}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.value === 'available' })}
                      className="w-full px-4 py-4 bg-gray-50 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FFDD00] transition text-xl font-bold placeholder-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <option value="available">AVAILABLE</option>
                      <option value="unavailable">UNAVAILABLE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-lg font-black text-black mb-2 uppercase">
                      Image Upload / URL
                    </label>
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="w-full px-4 py-3 bg-white border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FFDD00] transition text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-black file:text-white hover:file:bg-gray-800"
                      />
                      <div className="text-center font-black text-sm uppercase">OR</div>
                      <input
                        type="text"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full px-4 py-4 bg-gray-50 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FFDD00] transition text-xl font-bold placeholder-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        placeholder="HTTPS://EXAMPLE.COM/IMAGE.JPG"
                      />
                      {uploadingImage && <p className="text-primary font-black uppercase text-sm animate-pulse">UPLOADING IMAGE...</p>}
                      {formData.image_url && (
                        <div className="mt-4 relative w-32 h-32 border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-black text-black mb-2 uppercase">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FFDD00] transition text-xl font-bold placeholder-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    placeholder="PRODUCT DESCRIPTION..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t-4 border-black border-dashed">
                  <button type="submit" className="bg-primary text-white font-black text-xl uppercase px-8 py-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    {editingId ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
                  </button>
                  <button type="button" onClick={resetForm} className="bg-white text-black font-black text-xl uppercase px-8 py-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-8 border-black overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFDD00] border-b-8 border-black text-black text-xl">
                  <th className="px-6 py-5 font-black uppercase">Image</th>
                  <th className="px-6 py-5 font-black uppercase">Product Name</th>
                  <th className="px-6 py-5 font-black uppercase">Category</th>
                  <th className="px-6 py-5 font-black uppercase">Price</th>
                  <th className="px-6 py-5 font-black uppercase">Status</th>
                  <th className="px-6 py-5 font-black uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="text-lg font-bold">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-black uppercase text-xl">
                      LOADING PRODUCTS...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-black uppercase text-xl">
                      NO PRODUCTS FOUND. ADD YOUR FIRST PRODUCT!
                    </td>
                  </tr>
                ) : (
                  products.map(product => {
                    const category = categories.find(c => c.id === product.category_id)
                    return (
                      <tr key={product.id} className="border-b-4 border-black hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          {product.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-xl border-2 border-black" />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-xl border-2 border-black flex items-center justify-center text-2xl">🍽️</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-black font-black uppercase">{product.name}</td>
                        <td className="px-6 py-4 text-gray-600 uppercase">{category?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-primary font-black">PKR {product.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-4 py-2 rounded-xl border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-sm ${
                            product.is_available
                              ? 'bg-green-400 text-black'
                              : 'bg-red-500 text-white'
                          }`}>
                            {product.is_available ? 'AVAILABLE' : 'UNAVAILABLE'}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-4">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-3 bg-blue-500 text-white rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                          >
                            <Edit className="w-5 h-5 stroke-[3]" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-3 bg-primary text-white rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                          >
                            <Trash2 className="w-5 h-5 stroke-[3]" />
                          </button>
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
