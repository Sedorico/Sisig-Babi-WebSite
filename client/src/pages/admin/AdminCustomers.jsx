import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import adminBg from '../../assets/admin-bg.png';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/auth/customers');
      setCustomers(res.data);
    } catch (err) {
      setError('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async (user) => {
    try {
      setUpdating(user.id);
      await api.put(`/auth/customers/${user.id}/ban`, { is_banned: !user.is_banned });
      setCustomers(prev =>
        prev.map(c => c.id === user.id ? { ...c, is_banned: !c.is_banned } : c)
      );
    } catch (err) {
      setError('Failed to update customer status.');
    } finally {
      setUpdating(null);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
  };

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
          <Link to="/admin/orders" className="block px-4 py-2 rounded-lg hover:bg-orange-800 transition text-sm">Orders</Link>
          <Link to="/admin/customers" className="block px-4 py-2 rounded-lg bg-orange-800 font-medium text-sm">Customers</Link>
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
            <h1 className="text-2xl font-bold text-white">Customers Management</h1>
            <button onClick={fetchCustomers} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              Refresh
            </button>
          </div>

          <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
            {error && <div className="bg-red-500/20 text-red-300 border border-red-500/30 px-4 py-3 rounded-lg mb-4">{error}</div>}

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 mb-6"
            />

            <div className="flex gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-5 py-4">
                <p className="text-xs text-gray-400">Total Customers</p>
                <p className="text-2xl font-bold text-white">{customers.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-5 py-4">
                <p className="text-xs text-gray-400">Active</p>
                <p className="text-2xl font-bold text-green-400">{customers.filter(c => !c.is_banned).length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-5 py-4">
                <p className="text-xs text-gray-400">Banned</p>
                <p className="text-2xl font-bold text-red-400">{customers.filter(c => c.is_banned).length}</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-300">Loading customers...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-12 text-gray-300">No customers found.</div>
            ) : (
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left px-5 py-3 text-orange-300 font-semibold">#</th>
                      <th className="text-left px-5 py-3 text-orange-300 font-semibold">Name</th>
                      <th className="text-left px-5 py-3 text-orange-300 font-semibold">Email</th>
                      <th className="text-left px-5 py-3 text-orange-300 font-semibold">Orders</th>
                      <th className="text-left px-5 py-3 text-orange-300 font-semibold">Registered</th>
                      <th className="text-left px-5 py-3 text-orange-300 font-semibold">Status</th>
                      <th className="text-left px-5 py-3 text-orange-300 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer, idx) => (
                      <tr key={customer.id} className="border-b border-white/10 hover:bg-white/10 transition">
                        <td className="px-5 py-3 text-gray-400">{idx + 1}</td>
                        <td className="px-5 py-3 font-medium text-white">{customer.name}</td>
                        <td className="px-5 py-3 text-gray-300">{customer.email}</td>
                        <td className="px-5 py-3 text-gray-300">{customer.order_count || 0}</td>
                        <td className="px-5 py-3 text-gray-400">{formatDate(customer.created_at)}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${customer.is_banned ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'}`}>
                            {customer.is_banned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => handleBanToggle(customer)}
                            disabled={updating === customer.id}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                              customer.is_banned
                                ? 'bg-green-500/30 text-green-300 hover:bg-green-500/50'
                                : 'bg-red-500/30 text-red-300 hover:bg-red-500/50'
                            }`}
                          >
                            {updating === customer.id ? '...' : customer.is_banned ? 'Unban' : 'Ban'}
                          </button>
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
    </div>
  );
}