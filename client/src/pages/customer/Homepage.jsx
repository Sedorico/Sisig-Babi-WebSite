import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import API from '../../utils/axios'
import { useAuth } from '../../context/AuthContext'
import heroBg from '../../assets/hero-bg.jpg'

const Homepage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [show, setShow] = useState(false)
  const [bestSellers, setBestSellers] = useState([])
  const [heroIndex, setHeroIndex] = useState(0)
  const [heroAnimating, setHeroAnimating] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get('/products/featured')
        setFeaturedProducts(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
        setTimeout(() => setShow(true), 100)
      }
    }
    fetchFeatured()
  }, [])

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await API.get('/products')
        const filtered = res.data.filter(p => p.is_best_seller == 1)
        setBestSellers(filtered)
      } catch (err) {
        console.error(err)
      }
    }
    fetchBestSellers()
  }, [])

  useEffect(() => {
    if (featuredProducts.length <= 1) return
    const interval = setInterval(() => {
      nextProduct()
    }, 4000)
    return () => clearInterval(interval)
  }, [featuredProducts, currentIndex])

  useEffect(() => {
    if (bestSellers.length <= 1) return
    const interval = setInterval(() => {
      setHeroAnimating(true)
      setTimeout(() => {
        setHeroIndex(prev => (prev + 1) % bestSellers.length)
        setHeroAnimating(false)
      }, 600)
    }, 4000)
    return () => clearInterval(interval)
  }, [bestSellers])

  const nextProduct = () => {
    if (animating) return
    setAnimating(true)
    setShow(false)
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % featuredProducts.length)
      setShow(true)
      setAnimating(false)
    }, 400)
  }

  const prevProduct = () => {
    if (animating) return
    setAnimating(true)
    setShow(false)
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + featuredProducts.length) % featuredProducts.length)
      setShow(true)
      setAnimating(false)
    }, 400)
  }

  const getRelativeIndex = (offset) => {
    return (currentIndex + offset + featuredProducts.length) % featuredProducts.length
  }

  const handleOrderNow = (path) => {
    if (!user) {
      navigate('/login')
    } else {
      navigate(path)
    }
  }

  const currentProduct = featuredProducts[currentIndex]

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#7c2d12' }}>
      <Navbar />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center overflow-hidden">
        {bestSellers.length > 0 ? (
          <div
            key={heroIndex}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(https://sisig-babi-website-production.up.railway.app/uploads/${bestSellers[heroIndex]?.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: heroAnimating ? 0 : 1,
              transform: heroAnimating ? 'translateX(-40px)' : 'translateX(0)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${heroBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 w-full px-16 py-32">
          <div className="max-w-lg">
            <p className="text-orange-400 uppercase tracking-widest text-sm font-bold mb-4">
              🔥 Best Sisig in Town
            </p>
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-none mb-6">
              Crispy.<br />
              <span className="text-orange-400">Savory.</span><br />
              Delivered.
            </h1>
            <p className="text-orange-200 text-lg mb-10">
              Authentic Filipino sisig — straight from the grill to your door. Fresh, hot, and unforgettable.
            </p>
            <button
              onClick={() => handleOrderNow('/menu')}
              className="bg-orange-500 text-white font-black px-10 py-4 uppercase tracking-widest hover:bg-orange-400 transition text-lg"
            >
              Order Now →
            </button>
          </div>
        </div>

        {bestSellers.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {bestSellers.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`h-2 rounded-full transition-all ${i === heroIndex ? 'bg-orange-400 w-6' : 'bg-white/40 w-2'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Featured Section */}
      <div className="py-20 overflow-hidden" style={{ backgroundColor: '#4a1a08' }}>
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-8 h-1 bg-orange-400" />
            <h2 className="text-2xl font-black uppercase tracking-widest text-white">Featured</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : featuredProducts.length === 0 ? (
          <p className="text-orange-200 text-center py-20">No featured products yet.</p>
        ) : (
          <div className="relative">
            <div className="flex items-center justify-center gap-6">
              {featuredProducts.length > 1 && (
                <div
                  onClick={prevProduct}
                  className="cursor-pointer shrink-0 transition-all duration-500"
                  style={{ opacity: 0.5, transform: 'scale(0.75)' }}
                >
                  <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-orange-400 shadow-lg">
                    <img
                      src={`https://sisig-babi-website-production.up.railway.app/uploads/${featuredProducts[getRelativeIndex(-1)].image}`}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/200x200/1a1a1a/666?text=No+Image' }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-12 shrink-0">
                <div
                  className="w-80 h-80 shrink-0 rounded-full overflow-hidden border-4 border-orange-400 shadow-2xl shadow-orange-900/40"
                  style={{
                    opacity: show ? 1 : 0,
                    transform: show ? 'translateX(0) rotate(0deg) scale(1)' : 'translateX(-80px) rotate(-10deg) scale(0.8)',
                    transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <img
                    src={`https://sisig-babi-website-production.up.railway.app/uploads/${currentProduct.image}`}
                    alt={currentProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/400x400/1a1a1a/666?text=No+Image' }}
                  />
                </div>

                <div
                  className="max-w-sm"
                  style={{
                    opacity: show ? 1 : 0,
                    transform: show ? 'translateX(0)' : 'translateX(40px)',
                    transition: 'opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s',
                  }}
                >
                  <p className="text-orange-400 uppercase tracking-widest text-sm font-bold mb-3">Featured Item</p>
                  <h2 className="text-5xl font-black uppercase text-white mb-4">{currentProduct.name}</h2>
                  {currentProduct.description && currentProduct.description.trim() !== '' && currentProduct.description !== 'null' && (
                    <p className="text-orange-200 text-lg mb-6 max-w-md">{currentProduct.description}</p>
                  )}
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-4xl font-black text-orange-400">₱{currentProduct.price}</span>
                    {currentProduct.is_spicy == 1 && (
                      <span className="text-red-400 font-bold text-lg">🌶 Spicy</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleOrderNow(`/product/${currentProduct.id}`)}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-4 uppercase tracking-widest transition text-sm inline-block"
                  >
                    Order Now →
                  </button>
                </div>
              </div>

              {featuredProducts.length > 1 && (
                <div
                  onClick={nextProduct}
                  className="cursor-pointer shrink-0 transition-all duration-500"
                  style={{ opacity: 0.5, transform: 'scale(0.75)' }}
                >
                  <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-orange-400 shadow-lg">
                    <img
                      src={`https://sisig-babi-website-production.up.railway.app/uploads/${featuredProducts[getRelativeIndex(1)].image}`}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/200x200/1a1a1a/666?text=No+Image' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {featuredProducts.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button onClick={prevProduct} className="text-orange-300 hover:text-orange-400 transition text-2xl font-bold">‹</button>
                {featuredProducts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (idx === currentIndex) return
                      setShow(false)
                      setTimeout(() => { setCurrentIndex(idx); setShow(true) }, 400)
                    }}
                    className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-orange-400 w-6' : 'bg-orange-900 w-2'}`}
                  />
                ))}
                <button onClick={nextProduct} className="text-orange-300 hover:text-orange-400 transition text-2xl font-bold">›</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Why Choose Us */}
      <div className="bg-neutral-900 border-t border-neutral-700 py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-1 bg-orange-500" />
            <h2 className="text-2xl font-black uppercase tracking-widest text-white">Why Sisig Babi?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-5xl mb-4">🔥</p>
              <h3 className="font-black uppercase tracking-wide text-lg mb-2 text-white">Always Fresh</h3>
              <p className="text-gray-400 text-sm">Cooked to order. Never frozen. Always hot.</p>
            </div>
            <div className="text-center">
              <p className="text-5xl mb-4">🚀</p>
              <h3 className="font-black uppercase tracking-wide text-lg mb-2 text-white">Fast Delivery</h3>
              <p className="text-gray-400 text-sm">Your order delivered straight to your door.</p>
            </div>
            <div className="text-center">
              <p className="text-5xl mb-4">💯</p>
              <h3 className="font-black uppercase tracking-wide text-lg mb-2 text-white">Authentic Taste</h3>
              <p className="text-gray-400 text-sm">Traditional Filipino recipe, perfected.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-neutral-800 text-center py-8">
        <p className="text-orange-500 font-black text-xl uppercase tracking-widest mb-2">Sisig Babi</p>
        <p className="text-gray-500 text-sm">© 2026 Sisig Babi. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Homepage