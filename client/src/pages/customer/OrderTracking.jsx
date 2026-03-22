import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import API from '../../utils/axios'

const OrderTracking = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/my-orders')
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    setCancelling(orderId)
    try {
      await API.put(`/orders/${orderId}/cancel`)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancelling(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
      case 'preparing': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
      case 'out_for_delivery': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
      case 'completed': return 'bg-green-500/20 text-green-400 border border-green-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return '⏳ Pending'
      case 'preparing': return '👨‍🍳 Preparing'
      case 'out_for_delivery': return '🛵 Out for Delivery'
      case 'completed': return '✅ Completed'
      case 'cancelled': return '❌ Cancelled'
      default: return status
    }
  }

  const getStatusStep = (status) => {
    switch (status) {
      case 'pending': return 1
      case 'preparing': return 2
      case 'out_for_delivery': return 3
      case 'completed': return 4
      default: return 0
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-8 py-12">
        <p className="text-gray-500 text-sm mb-4">
          <Link to="/home" className="hover:text-orange-400 transition">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-white">My Orders</span>
        </p>

        <h1 className="text-4xl font-black uppercase mb-10">
          My <span className="text-orange-500">Orders</span>
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-6">No orders yet.</p>
            <button
              onClick={() => navigate('/menu')}
              className="bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-3 rounded-xl uppercase tracking-wide transition"
            >
              Order Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-neutral-800 rounded-2xl border border-white/10 overflow-hidden">
                {/* Order Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
                  <div>
                    <p className="font-black text-lg text-white">Order #{order.id}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(order.created_at).toLocaleDateString('en-PH', {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                    {/* Cancel Button — pending lang */}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        disabled={cancelling === order.id}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 px-4 py-1.5 rounded-full text-sm font-bold transition disabled:opacity-50"
                      >
                        {cancelling === order.id ? 'Cancelling...' : '✕ Cancel'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Progress Bar */}
                {order.status !== 'cancelled' && (
                  <div className="px-6 py-4 border-b border-white/10">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-3 left-0 right-0 h-1 bg-white/10 z-0">
                        <div
                          className="h-full bg-orange-500 transition-all duration-500"
                          style={{ width: `${((getStatusStep(order.status) - 1) / 3) * 100}%` }}
                        />
                      </div>
                      {[
                        { label: 'Pending', step: 1 },
                        { label: 'Preparing', step: 2 },
                        { label: 'On the way', step: 3 },
                        { label: 'Delivered', step: 4 },
                      ].map((s) => (
                        <div key={s.step} className="flex flex-col items-center z-10">
                          <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                            getStatusStep(order.status) >= s.step
                              ? 'bg-orange-500 border-orange-500'
                              : 'bg-neutral-800 border-white/20'
                          }`} />
                          <p className={`text-xs mt-2 font-bold ${
                            getStatusStep(order.status) >= s.step ? 'text-orange-400' : 'text-gray-600'
                          }`}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="px-6 py-4 border-b border-white/10 space-y-3">
                  {order.items && order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => { e.target.src = 'https://placehold.co/48x48/1a1a1a/666?text=No' }}
                      />
                      <div className="flex-1">
                        <p className="font-bold text-white">{item.name}</p>
                        <p className="text-gray-500 text-xs">
                          x{item.quantity}
                          {item.extra_egg ? ' · +Egg' : ''}
                          {item.extra_rice ? ' · +Rice' : ''}
                        </p>
                      </div>
                      <p className="text-orange-400 font-bold">₱{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span className="capitalize">{order.delivery_type}</span>
                    {' · '}
                    <span className="uppercase">{order.payment_method}</span>
                    {order.address && (
                      <span className="ml-2 text-gray-600">· {order.address}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Total</p>
                    <p className="font-black text-xl text-orange-500">₱{order.total_amount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderTracking