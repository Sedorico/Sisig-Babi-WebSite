import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const handleHome = () => {
    if (!user) {
      navigate('/')
    } else {
      navigate('/home')
    }
    setMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-neutral-900 text-white px-6 py-3 flex items-center justify-between shadow-lg border-b border-neutral-800">
      {/* Logo */}
      <button onClick={handleHome} className="flex items-center gap-2">
        <img src="/logo.png" alt="Sisig Babi" className="h-10 w-10 object-contain" />
        <span className="text-xl font-extrabold tracking-widest uppercase text-white">
          Sisig <span className="text-orange-500">Babi</span>
        </span>
      </button>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        <button onClick={handleHome} className="text-sm uppercase tracking-widest hover:text-orange-400 transition font-medium">Home</button>
        <Link to="/menu" className="text-sm uppercase tracking-widest hover:text-orange-400 transition font-medium">Menu</Link>
        {user ? (
          <>
            <Link to="/cart" className="text-sm uppercase tracking-widest hover:text-orange-400 transition font-medium">🛒 Cart</Link>
            <Link to="/orders" className="text-sm uppercase tracking-widest hover:text-orange-400 transition font-medium">My Orders</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="text-sm uppercase tracking-widest text-orange-400 hover:text-orange-300 transition font-bold">Admin</Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-orange-500 text-white text-sm font-bold px-5 py-2 uppercase tracking-widest hover:bg-orange-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm uppercase tracking-widest hover:text-orange-400 transition font-medium">Login</Link>
            <Link to="/register" className="bg-orange-500 text-white text-sm font-bold px-5 py-2 uppercase tracking-widest hover:bg-orange-600 transition">
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white focus:outline-none"
      >
        <div className="space-y-1.5">
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </div>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-neutral-900 border-t border-neutral-800 px-6 py-4 flex flex-col gap-4 md:hidden z-50">
          <button onClick={handleHome} className="text-sm uppercase tracking-widest hover:text-orange-400 transition font-medium text-left">Home</button>
          <Link to="/menu" onClick={() => setMenuOpen(false)} className="text-sm uppercase tracking-widest hover:text-orange-400 transition font-medium">Menu</Link>
          {user ? (
            <>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-sm uppercase tracking-widest hover:text-orange-400 transition font-medium">🛒 Cart</Link>
              <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-sm uppercase tracking-widest hover:text-orange-400 transition font-medium">My Orders</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm uppercase tracking-widest text-orange-400 font-bold">Admin</Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-orange-500 text-white text-sm font-bold px-5 py-2 uppercase tracking-widest hover:bg-orange-600 transition text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm uppercase tracking-widest hover:text-orange-400 transition font-medium">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-orange-500 text-white text-sm font-bold px-5 py-2 uppercase tracking-widest hover:bg-orange-600 transition inline-block">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar