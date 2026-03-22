import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import API from '../../utils/axios'
import { useAuth } from '../../context/AuthContext'

const categories = ['All', 'Best Seller', 'Sisig', 'Rice Meals', 'Snacks']

const Menu = () => {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])
  const [addedId, setAddedId] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products')
        setProducts(res.data)
        setFiltered(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
    const stored = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(stored)
  }, [])

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleFilter = (cat) => {
    setActiveCategory(cat)
    if (cat === 'All') setFiltered(products)
    else if (cat === 'Best Seller') setFiltered(products.filter(p => p.is_best_seller == 1))
    else setFiltered(products.filter(p => p.category === cat))
  }

  const handleAddToCart = (e, product) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingIndex = existingCart.findIndex(item => item.id === product.id)
    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += 1
    } else {
      existingCart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1, isSpicy: false, extraEgg: false, extraRice: false })
    }
    localStorage.setItem('cart', JSON.stringify(existingCart))
    setCart(existingCart)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const handleProductClick = (productId) => {
    if (!user) { navigate('/login'); return }
    navigate(`/product/${productId}`)
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-black uppercase mb-3">
            Our Signature <span className="text-orange-500">Dishes</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            From classic favorites to creative culinary creations, our menu is designed to tantalize your taste buds.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-4 py-2 rounded-full font-bold uppercase tracking-wide text-xs md:text-sm transition ${
                activeCategory === cat ? 'bg-orange-500 text-white' : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {filtered.map(product => (
              <div
                key={product.id}
                className="relative rounded-2xl overflow-hidden group cursor-pointer h-48 md:h-72"
                onClick={() => handleProductClick(product.id)}
              >
                <img
                  src={`http://localhost:5000/uploads/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x300/1a1a1a/666?text=No+Image' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                {product.is_best_seller == 1 && (
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-orange-500 text-white text-xs font-black px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-wide">
                    🔥 Best
                  </div>
                )}
                {product.is_spicy == 1 && (
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-red-500 text-white text-xs font-black px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-wide">
                    🌶
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 flex items-end justify-between">
                  <div>
                    <h3 className="text-white font-black text-sm md:text-xl uppercase">{product.name}</h3>
                    <p className="text-orange-400 font-black text-sm md:text-lg">₱{product.price}</p>
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`font-black px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm uppercase tracking-wide transition ${
                      addedId === product.id ? 'bg-green-500 text-white scale-95' : 'bg-orange-500 hover:bg-orange-400 text-white'
                    }`}
                  >
                    {addedId === product.id ? '✓' : '+Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <div
          onClick={() => navigate('/cart')}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-orange-500 hover:bg-orange-400 text-white font-black px-6 md:px-8 py-3 md:py-4 rounded-full shadow-2xl cursor-pointer transition flex items-center gap-3 z-50 text-sm md:text-base"
        >
          <span>🛒</span>
          <span>{getTotalItems()} item{getTotalItems() > 1 ? 's' : ''} in cart</span>
          <span>→</span>
        </div>
      )}
    </div>
  )
}

export default Menu