import { useState, useEffect, useRef } from 'react'
import API from '../../utils/axios'

const POS = () => {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [guestName, setGuestName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [lastOrderId, setLastOrderId] = useState(null)
  const [lastOrderData, setLastOrderData] = useState(null)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [showCart, setShowCart] = useState(false)
  const receiptRef = useRef()

  const categories = ['All', 'Best Seller', 'Sisig', 'Rice Meals', 'Snacks']

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
  }, [])

  const handleFilter = (cat) => {
    setActiveCategory(cat)
    if (cat === 'All') setFiltered(products)
    else if (cat === 'Best Seller') setFiltered(products.filter(p => p.is_best_seller == 1))
    else setFiltered(products.filter(p => p.category === cat))
  }

  const addToCart = (product) => {
    const existing = cart.findIndex(i => i.id === product.id)
    if (existing !== -1) {
      const updated = [...cart]
      updated[existing].quantity += 1
      setCart(updated)
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: parseFloat(product.price), image: product.image, quantity: 1 }])
    }
  }

  const updateQty = (index, qty) => {
    if (qty < 1) { setCart(cart.filter((_, i) => i !== index)); return }
    const updated = [...cart]
    updated[index].quantity = qty
    setCart(updated)
  }

  const getTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePlaceOrder = async () => {
    setError('')
    if (!guestName.trim()) return setError('Please enter order name')
    if (cart.length === 0) return setError('Cart is empty')
    setPlacing(true)
    try {
      const res = await API.post('/orders/guest', {
        guest_name: guestName,
        total_amount: getTotal(),
        delivery_type: 'pickup',
        payment_method: paymentMethod,
        contact_number: '',
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price, extra_egg: 0, extra_rice: 0 }))
      })
      setLastOrderData({ id: res.data.order_id, guest_name: guestName, payment_method: paymentMethod, total: getTotal(), items: [...cart], date: new Date() })
      setLastOrderId(res.data.order_id)
      setSuccess(true)
      setCart([])
      setGuestName('')
      setShowCart(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  const handlePrint = () => {
    const printContent = receiptRef.current.innerHTML
    const printWindow = window.open('', '_blank', 'width=400,height=600')
    printWindow.document.write(`
      <html><head><title>Receipt - Order #${lastOrderData?.id}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; font-size: 12px; width: 300px; margin: 0 auto; padding: 10px; }
        .divider { border-top: 1px dashed #000; margin: 8px 0; }
      </style></head><body>${printContent}</body></html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => { printWindow.print(); printWindow.close() }, 300)
  }

  const handleNewOrder = () => { setSuccess(false); setLastOrderId(null); setLastOrderData(null); setError('') }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-orange-600 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Sisig Babi" className="w-8 h-8 md:w-9 md:h-9" />
          <div>
            <h1 className="font-black text-lg md:text-xl uppercase tracking-wide">Sisig Babi</h1>
            <p className="text-orange-200 text-xs uppercase tracking-widest hidden md:block">Point of Sale</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Mobile Cart Toggle */}
          <button
            onClick={() => setShowCart(!showCart)}
            className="md:hidden bg-orange-700 px-3 py-2 rounded-lg text-sm font-bold relative"
          >
            🛒 {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-xs w-4 h-4 rounded-full flex items-center justify-center font-black">{cart.reduce((s, i) => s + i.quantity, 0)}</span>}
          </button>
          <a href="/" className="text-orange-200 hover:text-white text-xs md:text-sm font-bold uppercase tracking-wide transition">← Home</a>
        </div>
      </div>

      {/* Success Modal */}
      {success && lastOrderData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div ref={receiptRef} style={{ fontFamily: "'Courier New', monospace", fontSize: '12px', color: '#000' }}>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>SISIG BABI</div>
                <div style={{ fontSize: '11px' }}>Crispy. Savory. Delivered.</div>
                <div style={{ fontSize: '11px' }}>Point of Sale Receipt</div>
              </div>
              <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />
              <div style={{ marginBottom: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Order #:</span><span style={{ fontWeight: 'bold' }}>{lastOrderData.id}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Name:</span><span style={{ fontWeight: 'bold' }}>{lastOrderData.guest_name}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Date:</span><span>{lastOrderData.date.toLocaleDateString('en-PH')}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Time:</span><span>{lastOrderData.date.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Payment:</span><span style={{ textTransform: 'uppercase' }}>{lastOrderData.payment_method}</span></div>
              </div>
              <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />
              <div style={{ marginBottom: '6px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>ITEMS</div>
                {lastOrderData.items.map((item, index) => (
                  <div key={index} style={{ marginBottom: '3px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{item.name}</span><span>₱{(item.price * item.quantity).toFixed(2)}</span></div>
                    <div style={{ color: '#666', fontSize: '11px' }}>{item.quantity} x ₱{item.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
                <span>TOTAL</span><span>₱{lastOrderData.total.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />
              <div style={{ textAlign: 'center', fontSize: '11px', marginTop: '8px' }}>
                <div>Thank you for dining with us!</div>
                <div style={{ marginTop: '4px' }}>🔥 Sisig Babi 🔥</div>
                <div style={{ marginTop: '2px', color: '#666' }}>Please come again!</div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handlePrint} className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-black py-3 rounded-xl uppercase tracking-wide transition text-sm">🖨️ Print</button>
              <button onClick={handleNewOrder} className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-black py-3 rounded-xl uppercase tracking-wide transition text-sm">New Order</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left — Products */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex gap-2 px-3 md:px-4 py-2 md:py-3 bg-neutral-800 border-b border-white/10 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleFilter(cat)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold uppercase tracking-wide text-xs whitespace-nowrap transition ${
                  activeCategory === cat ? 'bg-orange-500 text-white' : 'bg-neutral-700 text-gray-400 hover:bg-neutral-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 md:p-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                {filtered.map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="relative rounded-xl overflow-hidden h-32 md:h-40 group hover:ring-2 hover:ring-orange-500 transition-all"
                  >
                    <img
                      src={`https://sisig-babi-website-production.up.railway.app/uploads/${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = 'https://placehold.co/200x160/1a1a1a/666?text=No+Image' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
                      <p className="font-black text-xs md:text-sm uppercase text-white leading-tight">{product.name}</p>
                      <p className="text-orange-400 font-black text-xs md:text-sm">₱{product.price}</p>
                    </div>
                    {product.is_best_seller == 1 && (
                      <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-orange-500 text-white text-xs font-black px-1.5 py-0.5 rounded-full">🔥</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Order Summary (Desktop) */}
        <div className="hidden md:flex w-80 bg-neutral-800 border-l border-white/10 flex-col">
          <div className="p-4 border-b border-white/10">
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Order Name</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Karl, Table 2..."
              className="w-full bg-neutral-700 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition text-sm"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-10 text-sm">No items yet!</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-neutral-700 rounded-xl p-3">
                  <img src={`https://sisig-babi-website-production.up.railway.app/uploads/${item.image}`} alt={item.name} className="w-10 h-10 object-cover rounded-lg shrink-0" onError={(e) => { e.target.src = 'https://placehold.co/40x40/1a1a1a/666?text=No' }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white truncate">{item.name}</p>
                    <p className="text-orange-400 text-xs font-bold">₱{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => updateQty(index, item.quantity - 1)} className="w-6 h-6 bg-neutral-600 hover:bg-neutral-500 rounded-lg text-xs font-bold transition">-</button>
                    <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQty(index, item.quantity + 1)} className="w-6 h-6 bg-neutral-600 hover:bg-neutral-500 rounded-lg text-xs font-bold transition">+</button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-white/10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-black uppercase text-lg">Total</span>
              <span className="font-black text-2xl text-orange-500">₱{getTotal().toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              {['cash', 'gcash', 'maya'].map(method => (
                <button key={method} onClick={() => setPaymentMethod(method)}
                  className={`flex-1 py-2 rounded-xl border font-bold uppercase text-xs tracking-wide transition ${paymentMethod === method ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/20 text-gray-400 hover:border-orange-500/50'}`}>
                  {method === 'cash' ? '💵' : method === 'gcash' ? '📱' : '💳'} {method}
                </button>
              ))}
            </div>
            {error && <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-2 rounded-xl text-xs">{error}</div>}
            <button onClick={handlePlaceOrder} disabled={placing || cart.length === 0}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-4 rounded-xl uppercase tracking-widest transition disabled:opacity-50 text-sm">
              {placing ? 'Placing...' : `Place Order ₱${getTotal().toFixed(2)}`}
            </button>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="w-full text-gray-500 hover:text-red-400 font-bold text-xs uppercase tracking-wide transition py-1">Clear Cart</button>
            )}
          </div>
        </div>

        {/* Mobile Cart Drawer */}
        {showCart && (
          <div className="md:hidden absolute inset-0 bg-neutral-800 z-40 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-black uppercase text-lg">Order Summary</h2>
              <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-4 border-b border-white/10">
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Order Name</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Karl, Table 2..."
                className="w-full bg-neutral-700 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition text-sm"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-10 text-sm">No items yet!</p>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-neutral-700 rounded-xl p-3">
                    <img src={`https://sisig-babi-website-production.up.railway.app/uploads/${item.image}`} alt={item.name} className="w-10 h-10 object-cover rounded-lg shrink-0" onError={(e) => { e.target.src = 'https://placehold.co/40x40/1a1a1a/666?text=No' }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-white truncate">{item.name}</p>
                      <p className="text-orange-400 text-xs font-bold">₱{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => updateQty(index, item.quantity - 1)} className="w-7 h-7 bg-neutral-600 hover:bg-neutral-500 rounded-lg text-sm font-bold transition">-</button>
                      <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQty(index, item.quantity + 1)} className="w-7 h-7 bg-neutral-600 hover:bg-neutral-500 rounded-lg text-sm font-bold transition">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-white/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-black uppercase text-lg">Total</span>
                <span className="font-black text-2xl text-orange-500">₱{getTotal().toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                {['cash', 'gcash', 'maya'].map(method => (
                  <button key={method} onClick={() => setPaymentMethod(method)}
                    className={`flex-1 py-2 rounded-xl border font-bold uppercase text-xs tracking-wide transition ${paymentMethod === method ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/20 text-gray-400'}`}>
                    {method === 'cash' ? '💵' : method === 'gcash' ? '📱' : '💳'} {method}
                  </button>
                ))}
              </div>
              {error && <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-2 rounded-xl text-xs">{error}</div>}
              <button onClick={handlePlaceOrder} disabled={placing || cart.length === 0}
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-4 rounded-xl uppercase tracking-widest transition disabled:opacity-50 text-sm">
                {placing ? 'Placing...' : `Place Order ₱${getTotal().toFixed(2)}`}
              </button>
              {cart.length > 0 && (
                <button onClick={() => setCart([])} className="w-full text-gray-500 hover:text-red-400 font-bold text-xs uppercase py-1">Clear Cart</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default POS