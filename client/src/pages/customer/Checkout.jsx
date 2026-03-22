import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import API from '../../utils/axios'

const Checkout = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    delivery_type: 'delivery',
    address: '',
    contact_number: '',
    payment_method: 'cod',
  })

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]')
    if (stored.length === 0) navigate('/cart')
    setCart(stored)
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const getItemTotal = (item) => {
    let total = item.price * item.quantity
    if (item.extraEgg) total += 15 * item.quantity
    if (item.extraRice) total += 20 * item.quantity
    return total
  }

  const getGrandTotal = () => cart.reduce((sum, item) => sum + getItemTotal(item), 0)

  const handlePlaceOrder = async () => {
    setError('')
    if (formData.delivery_type === 'delivery' && !formData.address) return setError('Please enter your delivery address')
    if (!formData.contact_number) return setError('Please enter your contact number')
    setLoading(true)
    try {
      const orderItems = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        extra_egg: item.extraEgg ? 1 : 0,
        extra_rice: item.extraRice ? 1 : 0,
      }))
      await API.post('/orders', {
        total_amount: getGrandTotal(),
        delivery_type: formData.delivery_type,
        address: formData.address,
        contact_number: formData.contact_number,
        payment_method: formData.payment_method,
        items: orderItems,
      })
      localStorage.removeItem('cart')
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <p className="text-gray-500 text-sm mb-4">
          <Link to="/home" className="hover:text-orange-400 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/cart" className="hover:text-orange-400 transition">Cart</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Checkout</span>
        </p>

        <h1 className="text-3xl md:text-4xl font-black uppercase mb-6 md:mb-10">
          Check<span className="text-orange-500">out</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left — Form */}
          <div className="flex-1 space-y-4 md:space-y-6">
            {/* Delivery Type */}
            <div className="bg-neutral-800 rounded-2xl border border-white/10 p-5 md:p-6">
              <h2 className="text-base md:text-lg font-black uppercase tracking-wide mb-4">Delivery Type</h2>
              <div className="flex gap-3 md:gap-4">
                <button
                  onClick={() => setFormData({ ...formData, delivery_type: 'delivery' })}
                  className={`flex-1 py-2.5 md:py-3 rounded-xl border font-bold uppercase tracking-wide transition text-xs md:text-sm ${
                    formData.delivery_type === 'delivery' ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/20 text-gray-400 hover:border-orange-500/50'
                  }`}
                >
                  🛵 Delivery
                </button>
                <button
                  onClick={() => setFormData({ ...formData, delivery_type: 'pickup' })}
                  className={`flex-1 py-2.5 md:py-3 rounded-xl border font-bold uppercase tracking-wide transition text-xs md:text-sm ${
                    formData.delivery_type === 'pickup' ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/20 text-gray-400 hover:border-orange-500/50'
                  }`}
                >
                  🏪 Pickup
                </button>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-neutral-800 rounded-2xl border border-white/10 p-5 md:p-6 space-y-4">
              <h2 className="text-base md:text-lg font-black uppercase tracking-wide">Delivery Details</h2>
              {formData.delivery_type === 'delivery' && (
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Delivery Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter your full address"
                    className="w-full bg-neutral-700 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition text-sm"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Contact Number</label>
                <input
                  type="text"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  placeholder="09XXXXXXXXX"
                  className="w-full bg-neutral-700 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition text-sm"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-neutral-800 rounded-2xl border border-white/10 p-5 md:p-6">
              <h2 className="text-base md:text-lg font-black uppercase tracking-wide mb-4">Payment Method</h2>
              <div className="flex gap-2 md:gap-4">
                {[
                  { value: 'cod', label: '💵 COD' },
                  { value: 'gcash', label: '📱 GCash' },
                  { value: 'maya', label: '💳 Maya' },
                ].map(method => (
                  <button
                    key={method.value}
                    onClick={() => setFormData({ ...formData, payment_method: method.value })}
                    className={`flex-1 py-2.5 md:py-3 rounded-xl border font-bold uppercase tracking-wide transition text-xs md:text-sm ${
                      formData.payment_method === method.value ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/20 text-gray-400 hover:border-orange-500/50'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-neutral-800 rounded-2xl border border-white/10 p-5 md:p-6 lg:sticky lg:top-8">
              <h2 className="text-xl font-black uppercase mb-5 md:mb-6">Order Summary</h2>
              <div className="space-y-3 mb-5 md:mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <p className="text-white font-medium">{item.name} x{item.quantity}</p>
                      <p className="text-gray-500 text-xs">
                        {item.extraEgg ? '+Egg ' : ''}{item.extraRice ? '+Rice' : ''}
                      </p>
                    </div>
                    <span className="text-gray-400">₱{getItemTotal(item)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 space-y-2 mb-5 md:mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-bold">₱{getGrandTotal()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery Fee</span>
                  <span className="font-bold text-green-400">Free</span>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 mb-5 md:mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-black uppercase text-lg">Total</span>
                  <span className="font-black text-2xl text-orange-500">₱{getGrandTotal()}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3 md:py-4 rounded-xl uppercase tracking-widest transition text-sm disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order 🎉'}
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="w-full mt-3 text-gray-500 hover:text-gray-300 font-bold py-2 text-sm uppercase tracking-wide transition"
              >
                ← Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout