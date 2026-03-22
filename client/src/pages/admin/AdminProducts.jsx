import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import API from '../../utils/axios'
import adminBg from '../../assets/admin-bg.png'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '', price: '', category: '',
    is_featured: 0, is_best_seller: 0, is_available: 1
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef()

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products')
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleAdd = () => {
    setEditProduct(null)
    setFormData({ name: '', price: '', category: '', is_featured: 0, is_best_seller: 0, is_available: 1 })
    setImageFile(null)
    setImagePreview(null)
    setError('')
    setShowModal(true)
  }

  const handleEdit = (product) => {
    setEditProduct(product)
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      is_featured: product.is_featured,
      is_best_seller: product.is_best_seller || 0,
      is_available: product.is_available !== undefined ? product.is_available : 1,
    })
    setImageFile(null)
    setImagePreview(product.image || null)
    setError('')
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await API.delete(`/products/${id}`)
      setSuccess('Product deleted!')
      fetchProducts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete product')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('price', formData.price)
      data.append('category', formData.category)
      data.append('is_featured', formData.is_featured)
      data.append('is_best_seller', formData.is_best_seller)
      data.append('is_available', formData.is_available)
      data.append('description', '')
      data.append('stock', 0)
      data.append('is_spicy', 0)
      if (imageFile) {
        data.append('image', imageFile)
      }
      if (editProduct) {
        await API.put(`/products/${editProduct.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
        setSuccess('Product updated!')
      } else {
        await API.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } })
        setSuccess('Product added!')
      }
      setShowModal(false)
      fetchProducts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 text-white flex flex-col shrink-0" style={{ backgroundColor: '#c2410c' }}>
        <div className="h-16 flex items-center gap-3 px-5 border-b border-orange-800">
          <img src="/logo.png" alt="logo" className="h-9 w-9 object-contain shrink-0" />
          <span className="text-lg font-extrabold uppercase tracking-wider">
            Sisig <span className="text-orange-200">Babi</span>
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin" className="block px-4 py-2 rounded-lg hover:bg-orange-800 transition text-sm">Dashboard</Link>
          <Link to="/admin/products" className="block px-4 py-2 rounded-lg bg-orange-800 font-medium text-sm">Products</Link>
          <Link to="/admin/orders" className="block px-4 py-2 rounded-lg hover:bg-orange-800 transition text-sm">Orders</Link>
          <Link to="/admin/customers" className="block px-4 py-2 rounded-lg hover:bg-orange-800 transition text-sm">Customers</Link>
          <Link to="/" className="block px-4 py-2 rounded-lg hover:bg-orange-800 transition text-sm">View Store</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col relative"
        style={{
          backgroundImage: `url(${adminBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col flex-1">
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/20 bg-white/10 backdrop-blur">
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <button onClick={handleAdd} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg transition text-sm">
              + Add Product
            </button>
          </div>

          <div className="flex-1 p-8">
            {success && <div className="bg-green-500/20 text-green-300 border border-green-500/30 px-4 py-2 rounded-lg mb-4">{success}</div>}
            {error && <div className="bg-red-500/20 text-red-300 border border-red-500/30 px-4 py-2 rounded-lg mb-4">{error}</div>}

            {loading ? (
              <p className="text-gray-300">Loading...</p>
            ) : (
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <td className="px-4 py-3 text-orange-300 font-semibold">Image</td>
                      <td className="px-4 py-3 text-orange-300 font-semibold">Name</td>
                      <td className="px-4 py-3 text-orange-300 font-semibold">Category</td>
                      <td className="px-4 py-3 text-orange-300 font-semibold">Price</td>
                      <td className="px-4 py-3 text-orange-300 font-semibold">Featured</td>
                      <td className="px-4 py-3 text-orange-300 font-semibold">Best Seller</td>
                      <td className="px-4 py-3 text-orange-300 font-semibold">Status</td>
                      <td className="px-4 py-3 text-orange-300 font-semibold">Actions</td>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-t border-white/10 hover:bg-white/10 transition">
                        <td className="px-4 py-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => { e.target.src = 'https://placehold.co/48x48/333/666?text=No' }}
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-white">{product.name}</td>
                        <td className="px-4 py-3 text-gray-300">{product.category}</td>
                        <td className="px-4 py-3 text-orange-400 font-semibold">₱{product.price}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${product.is_featured == 1 ? 'bg-orange-500/30 text-orange-300' : 'bg-gray-500/30 text-gray-400'}`}>
                            {product.is_featured == 1 ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${product.is_best_seller == 1 ? 'bg-yellow-500/30 text-yellow-300' : 'bg-gray-500/30 text-gray-400'}`}>
                            {product.is_best_seller == 1 ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${product.is_available == 0 ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'}`}>
                            {product.is_available == 0 ? 'Not Available' : 'Available'}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          <button onClick={() => handleEdit(product)} className="bg-blue-500/30 text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-500/50 transition text-xs font-medium">Edit</button>
                          <button onClick={() => handleDelete(product.id)} className="bg-red-500/30 text-red-300 px-3 py-1 rounded-lg hover:bg-red-500/50 transition text-xs font-medium">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-xl p-8 w-full max-w-md max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
            {error && <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Image Upload */}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2 block">Product Image</label>
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-44 border-2 border-dashed border-neutral-600 rounded-xl flex items-center justify-center cursor-pointer hover:border-orange-500 transition overflow-hidden"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="text-center">
                      <p className="text-4xl mb-2">📷</p>
                      <p className="text-gray-400 text-sm">Click to upload image</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
              </div>

              {/* Name */}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2 block">Product Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Sisig Rice"
                  className="w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-400 placeholder-gray-500" />
              </div>

              {/* Price */}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2 block">Price</label>
                <input name="price" value={formData.price} onChange={handleChange} required type="number" placeholder="e.g. 120"
                  className="w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-400 placeholder-gray-500" />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2 block">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} required
                  className="w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-400">
                  <option value="">Select Category</option>
                  <option value="Sisig">Sisig</option>
                  <option value="Rice Meals">Rice Meals</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Combos">Combos</option>
                  <option value="Specials">Specials</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3 block">Tags</label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="is_featured" checked={formData.is_featured == 1} onChange={handleChange} className="accent-orange-500 w-4 h-4" />
                    <span className="text-gray-300 text-sm">Featured</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="is_best_seller" checked={formData.is_best_seller == 1} onChange={handleChange} className="accent-yellow-500 w-4 h-4" />
                    <span className="text-gray-300 text-sm">Best Seller</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_available == 0}
                      onChange={(e) => setFormData({...formData, is_available: e.target.checked ? 0 : 1})}
                      className="accent-red-500 w-4 h-4"
                    />
                    <span className="text-gray-300 text-sm">Not Available</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition">
                  {editProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-gray-300 font-semibold py-2.5 rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts
