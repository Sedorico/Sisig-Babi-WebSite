import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../utils/axios'
import adminBg from '../../assets/admin-bg.png'

const AdminDashboard = () => {
  const { logout } = useAuth()
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue: 0,
    total_customers: 0,
    total_products: 0,
    recent_orders: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/orders/stats')
        setStats(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const STATUS_COLORS = {
    pending:   'bg-yellow-500/30 text-yellow-300',
    confirmed: 'bg-blue-500/30 text-blue-300',
    preparing: 'bg-orange-500/30 text-orange-300',
    ready:     'bg-purple-500/30 text-purple-300',
    delivered: 'bg-green-500/30 text-green-300',
    cancelled: 'bg-red-500/30 text-red-300',
  }

  return (
    <div className="min-h-screen flex">

      {/* Sidebar */}
      <div className="w-64 text-white flex flex-col shrink-0" style={{ backgroundColor: '#c2410c' }}>

        {/* Logo — same height as top bar */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-orange-800">
          <img src="/logo.png" alt="logo" className="h-9 w-9 object-contain shrink-0" />
          <span className="text-lg font-extrabold uppercase tracking-wider">
            Sisig <span className="text-orange-200">Babi</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin" className="block px-4 py-2 rounded-lg bg-orange-800 font-medium text-sm">Dashboard</Link>
          <Link to="/admin/products" className="block px-4 py-2 rounded-lg hover:bg-orange-800 transition text-sm">Products</Link>
          <Link to="/admin/orders" className="block px-4 py-2 rounded-lg hover:bg-orange-800 transition text-sm">Orders</Link>
          <Link to="/admin/customers" className="block px-4 py-2 rounded-lg hover:bg-orange-800 transition text-sm">Customers</Link>
          <Link to="/" className="block px-4 py-2 rounded-lg hover:bg-orange-800 transition text-sm">View Store</Link>
        </nav>

        <div className="p-4 border-t border-orange-800">
          <button onClick={logout} className="w-full bg-white text-orange-700 font-semibold py-2 rounded-lg hover:bg-orange-100 transition text-sm">
            Logout
          </button>
        </div>
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

          {/* Top Bar — same height as sidebar logo */}
          <div className="h-16 flex items-center px-6 border-b border-white/20 bg-white/10 backdrop-blur">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          </div>

          <div className="flex-1 p-8">
            {loading ? (
              <p className="text-gray-300">Loading stats...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                    <p className="text-gray-300 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-orange-400 mt-2">{stats.total_orders}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                    <p className="text-gray-300 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-orange-400 mt-2">₱{parseFloat(stats.total_revenue).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                    <p className="text-gray-300 text-sm">Total Customers</p>
                    <p className="text-3xl font-bold text-orange-400 mt-2">{stats.total_customers}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                    <p className="text-gray-300 text-sm">Total Products</p>
                    <p className="text-3xl font-bold text-orange-400 mt-2">{stats.total_products}</p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-10">
                  <h2 className="text-lg font-bold text-white mb-4">Recent Orders</h2>
                  {stats.recent_orders.length === 0 ? (
                    <p className="text-gray-400 text-sm">No orders yet.</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-2 px-3 text-orange-300 font-semibold">Order #</th>
                          <th className="text-left py-2 px-3 text-orange-300 font-semibold">Customer</th>
                          <th className="text-left py-2 px-3 text-orange-300 font-semibold">Amount</th>
                          <th className="text-left py-2 px-3 text-orange-300 font-semibold">Status</th>
                          <th className="text-left py-2 px-3 text-orange-300 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recent_orders.map(order => (
                          <tr key={order.id} className="border-b border-white/10 hover:bg-white/10 transition">
                            <td className="py-2 px-3 font-medium text-white">#{order.id}</td>
                            <td className="py-2 px-3 text-gray-300">{order.customer_name}</td>
                            <td className="py-2 px-3 text-orange-400 font-semibold">₱{parseFloat(order.total_amount).toFixed(2)}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-500/30 text-gray-300'}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-gray-400">{formatDate(order.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link to="/admin/products" className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition">
                      <p className="text-3xl mb-2">🍽️</p>
                      <p className="font-semibold text-white">Manage Products</p>
                    </Link>
                    <Link to="/admin/orders" className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition">
                      <p className="text-3xl mb-2">📦</p>
                      <p className="font-semibold text-white">Manage Orders</p>
                    </Link>
                    <Link to="/admin/customers" className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition">
                      <p className="text-3xl mb-2">👥</p>
                      <p className="font-semibold text-white">Manage Customers</p>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard