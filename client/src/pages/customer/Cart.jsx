import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'

const Cart = () => {
  const [cart, setCart] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(stored)
  }, [])

  const updateQuantity = (index, newQty) => {
    if (newQty < 1) return
    const updated = [...cart]
    updated[index].quantity = newQty
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const removeItem = (index) => {
    const updated = cart.filter((_, i) => i !== index)
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const getItemTotal = (item) => {
    let total = item.price * item.quantity
    if (item.extraEgg) total += 15 * item.quantity
    if (item.extraRice) total += 20 * item.quantity
    return total
  }

  const getSubtotal = () => cart.reduce((sum, item) => sum + getItemTotal(item), 0)

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <p className="text-gray-500 text-sm mb-4">
          <Link to="/home" className="hover:text-orange-400 transition">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Cart</span>
        </p>

        <h1 className="text-3xl md:text-4xl font-black uppercase mb-6 md:mb-10">
          Your <span className="text-orange-500">Cart</span>
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-6">Your cart is empty.</p>
            <button
              onClick={() => navigate('/menu')}
              className="bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-3 rounded-xl uppercase tracking-wide transition"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Left — Cart Items */}
            <div className="flex-1 space-y-4">
              <div className="hidden md:grid grid-cols-12 text-gray-500 text-sm uppercase tracking-wide pb-2 border-b border-white/10">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {cart.map((item, index) => (
                <div key={index} className="flex items-center gap-3 md:gap-4 py-3 md:py-4 border-b border-white/10">
                  <div className="relative shrink-0">
                    <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.name}
                      className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-xl"
                      onError={(e) => { e.target.src = 'https://placehold.co/64x64/1a1a1a/666?text=No' }}
                    />
                    <button
                      onClick={() => removeItem(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-400 transition"
                    >✕</button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black uppercase text-white text-sm md:text-base">{item.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {item.isSpicy ? '🌶 Spicy' : 'Not Spicy'}
                      {item.extraEgg ? ' · +Egg' : ''}
                      {item.extraRice ? ' · +Rice' : ''}
                    </p>
                    <p className="text-orange-400 font-bold text-sm md:hidden mt-1">₱{getItemTotal(item)}</p>
                  </div>
                  <div className="hidden md:block col-span-2 text-center text-gray-400 text-sm">
                    ₱{item.price}
                  </div>
                  <div className="flex items-center gap-1 md:gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition text-sm"
                    >-</button>
                    <span className="w-5 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition text-sm"
                    >+</button>
                  </div>
                  <div className="hidden md:block text-right font-black text-orange-400 text-sm">
                    ₱{getItemTotal(item)}
                  </div>
                </div>
              ))}

              <button
                onClick={() => navigate('/menu')}
                className="text-orange-400 hover:text-orange-300 font-bold text-sm uppercase tracking-wide transition flex items-center gap-2 pt-2"
              >
                ← Continue Shopping
              </button>
            </div>

            {/* Right — Order Summary */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-neutral-800 rounded-2xl border border-white/10 p-5 md:p-6">
                <h2 className="text-xl font-black uppercase mb-5 md:mb-6">Order Summary</h2>
                <div className="space-y-2 mb-5 md:mb-6">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm text-gray-400">
                      <span>{item.name} x{item.quantity}</span>
                      <span>₱{getItemTotal(item)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4 mb-5 md:mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-bold">₱{getSubtotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Delivery Fee</span>
                    <span className="font-bold text-green-400">Free</span>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 mb-5 md:mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-black uppercase text-lg">Total</span>
                    <span className="font-black text-2xl text-orange-500">₱{getSubtotal()}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3 md:py-4 rounded-xl uppercase tracking-widest transition text-sm"
                >
                  Go to Checkout →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart