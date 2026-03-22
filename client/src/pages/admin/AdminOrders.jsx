import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import adminBg from '../../assets/admin-bg.png';

const STATUS_COLORS = {
  pending:   'bg-yellow-500/30 text-yellow-300',
  confirmed: 'bg-blue-500/30 text-blue-300',
  preparing: 'bg-orange-500/30 text-orange-300',
  ready:     'bg-purple-500/30 text-purple-300',
  delivered: 'bg-green-500/30 text-green-300',
  cancelled: 'bg-red-500/30 text-red-300',
};

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [updating, setUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const openOrder = async (orderId) => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setSelectedOrder(res.data);
      setStatusUpdate(res.data.status);
    } catch (err) {
      setError('Failed to load order details.');
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || statusUpdate === selectedOrder.status) return;
    try {
      setUpdating(true);
      await api.put(`/orders/${selectedOrder.id}/status`, { status: statusUpdate });
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: statusUpdate } : o));
      setSelectedOrder(prev => ({ ...prev, status: statusUpdate }));
    } catch (err) {
      setError('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const isWalkIn = (order) => !order.user_id && order.guest_name

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
          <Link to="/admin/products" className="block px-4 py-2 rounded-lg hover:bg-orange-800 transition text-sm">Products</Link>
          <Link to="/admin/orders" className="block px-4 py-2 rounded-lg bg-orange-800 font-medium text-sm">Orders</Link>
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
            <h1 className="text-2xl font-bold text-white">Orders Management</h1>
            <button onClick={fetchOrders} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              Refresh
            </button>
          </div>

          <div className="flex-1 p-6">
            {error && <div className="bg-red-500/20 text-red-300 border border-red-500/30 px-4 py-3 rounded-lg mb-4">{error}</div>}

            <div className="flex gap-2 mb-6 flex-wrap">
              {['all', ...STATUS_OPTIONS].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
                    filterStatus === status
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/10 text-gray-300 border border-white/20 hover:border-orange-400'
                  }`}
                >
                  {status === 'all' ? `All (${orders.length})` : `${status} (${orders.filter(o => o.status === status).length})`}
                </button>
              ))}
            </div>

            <div className="flex gap-6">
              <div className="flex-1 min-w-0">
                {loading ? (
                  <div className="text-center py-12 text-gray-300">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-12 text-gray-300">No orders found.</div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map(order => (
                      <div
                        key={order.id}
                        onClick={() => openOrder(order.id)}
                        className={`bg-white/10 backdrop-blur rounded-xl p-4 cursor-pointer border-2 transition hover:bg-white/20 ${
                          selectedOrder?.id === order.id ? 'border-orange-400' : 'border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-bold text-white">Order #{order.id}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-500/30 text-gray-300'}`}>
                                {order.status}
                              </span>
                              {/* Walk-In or Online Badge */}
                              {isWalkIn(order) ? (
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/30 text-purple-300 border border-purple-500/30">
                                  🏪 Walk-In
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/30 text-blue-300 border border-blue-500/30">
                                  🛵 Online
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-300">{order.customer_name || 'Customer'}</p>
                            <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-orange-400">₱{parseFloat(order.total_amount).toFixed(2)}</p>
                            <p className="text-xs text-gray-400 capitalize">{order.delivery_type}</p>
                            <p className="text-xs text-gray-400 capitalize">{order.payment_method}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedOrder && (
                <div className="w-96 bg-white/10 backdrop-blur border border-white/20 rounded-xl p-5 h-fit sticky top-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">Order #{selectedOrder.id}</h2>
                      {isWalkIn(selectedOrder) ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/30 text-purple-300 border border-purple-500/30">
                          🏪 Walk-In
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/30 text-blue-300 border border-blue-500/30">
                          🛵 Online
                        </span>
                      )}
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
                  </div>
                  <div className="mb-4 p-3 bg-white/10 rounded-lg">
                    <p className="text-sm font-semibold text-orange-300 mb-1">Customer Info</p>
                    <p className="text-sm text-gray-300">{selectedOrder.customer_name || 'N/A'}</p>
                    <p className="text-sm text-gray-300">{selectedOrder.customer_email || 'N/A'}</p>
                    <p className="text-sm text-gray-300">{selectedOrder.contact_number || 'N/A'}</p>
                    {selectedOrder.address && <p className="text-sm text-gray-300 mt-1">📍 {selectedOrder.address}</p>}
                  </div>
                  <div className="mb-4 p-3 bg-white/10 rounded-lg">
                    <p className="text-sm font-semibold text-orange-300 mb-1">Order Info</p>
                    <p className="text-sm text-gray-300 capitalize">Delivery: {selectedOrder.delivery_type}</p>
                    <p className="text-sm text-gray-300 capitalize">Payment: {selectedOrder.payment_method}</p>
                    <p className="text-sm text-gray-300">Date: {formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-orange-300 mb-2">Items</p>
                    <div className="space-y-2">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start text-sm">
                            <div>
                              <p className="text-white font-medium">{item.name} x{item.quantity}</p>
                              {item.extra_egg ? <p className="text-xs text-gray-400">+ Extra Egg</p> : null}
                              {item.extra_rice ? <p className="text-xs text-gray-400">+ Extra Rice</p> : null}
                            </div>
                            <p className="text-gray-300 font-medium">₱{parseFloat(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">No items found.</p>
                      )}
                    </div>
                    <div className="border-t border-white/20 mt-3 pt-3 flex justify-between font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-orange-400">₱{parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-orange-300 mb-2">Update Status</p>
                    <select
                      value={statusUpdate}
                      onChange={e => setStatusUpdate(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg px-3 py-2 text-sm capitalize mb-3 focus:outline-none focus:border-orange-400"
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s} className="capitalize">{s}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleUpdateStatus}
                      disabled={updating || statusUpdate === selectedOrder.status}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:text-gray-400 text-white font-semibold py-2 rounded-lg transition text-sm"
                    >
                      {updating ? 'Updating...' : 'Update Status'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}