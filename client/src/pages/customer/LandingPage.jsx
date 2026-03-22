import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/axios'
import heroBg from '../../assets/hero-bg.jpg'

const LandingPage = () => {
  const navigate = useNavigate()
  const [bestSellers, setBestSellers] = useState([])
  const [heroIndex, setHeroIndex] = useState(0)
  const [heroAnimating, setHeroAnimating] = useState(false)

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

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      {bestSellers.length > 0 ? (
        <div
          key={heroIndex}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bestSellers[heroIndex]?.image})`,
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

      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Secret Admin Button — Logo */}
        <div
          onClick={() => navigate('/login')}
          className="cursor-pointer w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-2xl overflow-hidden opacity-90 hover:opacity-100 transition-all duration-300 hover:ring-2 hover:ring-orange-500/50"
        >
          <img src="/logo.png" alt="Sisig Babi" className="w-full h-full object-contain" />
        </div>

        <h1 className="text-4xl md:text-7xl font-black uppercase text-white mb-2">
          SISIG <span className="text-orange-500">BABI</span>
        </h1>
        <p className="text-orange-200 text-sm md:text-lg mb-10 md:mb-16 uppercase tracking-widest">
          Crispy. Savory. Delivered.
        </p>

        {/* Choice Buttons */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center">
          {/* Order Online */}
          <button
            onClick={() => navigate('/home')}
            className="group w-full max-w-xs md:w-72 h-36 md:h-48 bg-neutral-800/80 hover:bg-orange-500 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl border border-white/10 hover:border-orange-500"
          >
            <div className="flex flex-col items-center justify-center h-full p-6">
              <span className="text-4xl md:text-5xl mb-2 md:mb-4">🛵</span>
              <h2 className="text-xl md:text-2xl font-black uppercase text-white tracking-wide">Order Online</h2>
              <p className="text-gray-400 group-hover:text-orange-100 text-xs md:text-sm mt-1 md:mt-2 transition">Delivery or Pickup</p>
            </div>
          </button>

          {/* Divider */}
          <div className="text-white/30 font-black text-2xl hidden md:block">|</div>

          {/* Walk-In */}
          <button
            onClick={() => navigate('/pos')}
            className="group w-full max-w-xs md:w-72 h-36 md:h-48 bg-neutral-800/80 hover:bg-orange-500 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl border border-white/10 hover:border-orange-500"
          >
            <div className="flex flex-col items-center justify-center h-full p-6">
              <span className="text-4xl md:text-5xl mb-2 md:mb-4">🏪</span>
              <h2 className="text-xl md:text-2xl font-black uppercase text-white tracking-wide">Walk-In</h2>
              <p className="text-gray-400 group-hover:text-orange-100 text-xs md:text-sm mt-1 md:mt-2 transition">Dine-In / On-Site Order</p>
            </div>
          </button>
        </div>

        {/* Dots */}
        {bestSellers.length > 1 && (
          <div className="flex justify-center gap-2 mt-8 md:mt-12">
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
    </div>
  )
}

export default LandingPage
