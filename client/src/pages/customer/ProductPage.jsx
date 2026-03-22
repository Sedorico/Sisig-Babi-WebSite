import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import API from '../../utils/axios'
import { useAuth } from '../../context/AuthContext'

const ProductPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isSpicy, setIsSpicy] = useState(false)
  const [extraEgg, setExtraEgg] = useState(false)
  const [extraRice, setExtraRice] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`)
        setProduct(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const getTotal = () => {
    let total = product.price * quantity
    if (extraEgg) total += 15 * quantity
    if (extraRice) total += 20 * quantity
    return total
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login')
      return
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      isSpicy,
      extraEgg,
      extraRice,
    }

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')

    const existingIndex = existingCart.findIndex(
      (item) =>
        item.id === cartItem.id &&
        item.isSpicy === cartItem.isSpicy &&
        item.extraEgg === cartItem.extraEgg &&
        item.extraRice === cartItem.extraRice
    )

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += quantity
    } else {
      existingCart.push(cartItem)
    }

    localStorage.setItem('cart', JSON.stringify(existingCart))
    navigate('/cart')
  }

  if (loading) return (
    <div className="min-h-screen bg-neutral-900">
      <Navbar />
      <p className="text-center mt-10 text-gray-400">Loading...</p>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-neutral-900">
      <Navbar />
      <p className="text-center mt-10 text-gray-400">Product not found.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-neutral-800 rounded-2xl border border-white/10 p-6 flex flex-col md:flex-row gap-8">
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-72 h-64 object-cover rounded-xl"
            onError={(e) => { e.target.src = 'https://placehold.co/400x300/1a1a1a/666?text=No+Image' }}
          />

          <div className="flex-1">
            <h1 className="text-3xl font-black uppercase text-white">{product.name}</h1>
            {product.description && product.description.trim() !== '' && product.description !== 'null' && (
              <p className="text-gray-400 mt-2">{product.description}</p>
            )}
            <p className="text-orange-500 font-black text-3xl mt-3">₱{product.price}</p>

            {product.is_spicy == 1 && (
              <div className="mt-4">
                <p className="font-medium text-gray-300 mb-2">🌶 Spicy Option</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsSpicy(false)}
                    className={`px-4 py-2 rounded-lg border transition ${!isSpicy ? 'bg-orange-500 text-white border-orange-500' : 'border-white/20 text-gray-400'}`}
                  >
                    Not Spicy
                  </button>
                  <button
                    onClick={() => setIsSpicy(true)}
                    className={`px-4 py-2 rounded-lg border transition ${isSpicy ? 'bg-red-500 text-white border-red-500' : 'border-white/20 text-gray-400'}`}
                  >
                    Spicy 🌶
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4">
              <p className="font-medium text-gray-300 mb-2">Add-ons</p>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={extraEgg}
                  onChange={(e) => setExtraEgg(e.target.checked)}
                  className="accent-orange-500 w-4 h-4"
                />
                <span className="text-gray-300">Extra Egg <span className="text-orange-500 font-medium">+₱15</span></span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={extraRice}
                  onChange={(e) => setExtraRice(e.target.checked)}
                  className="accent-orange-500 w-4 h-4"
                />
                <span className="text-gray-300">Extra Rice <span className="text-orange-500 font-medium">+₱20</span></span>
              </label>
            </div>

            <div className="mt-4">
              <p className="font-medium text-gray-300 mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="bg-white/10 text-white font-bold px-4 py-2 rounded-lg hover:bg-white/20 transition"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="bg-white/10 text-white font-bold px-4 py-2 rounded-lg hover:bg-white/20 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-xl font-bold text-white">Total: <span className="text-orange-500">₱{getTotal()}</span></p>
              <button
                onClick={handleAddToCart}
                className="bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-3 rounded-xl transition uppercase tracking-wide"
              >
                {user ? 'Add to Cart 🛒' : 'Login to Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
