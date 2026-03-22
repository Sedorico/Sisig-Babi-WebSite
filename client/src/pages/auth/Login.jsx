import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../utils/axios'
import loginLeft from '../../assets/login-left.jpg'
import loginRight from '../../assets/login-right.jpg'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await API.post('/auth/login', { email, password })
      login(res.data.user, res.data.token)
      if (res.data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/home')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left Side - Mascot */}
      <div
        className="hidden md:flex w-1/2 relative items-center justify-center"
        style={{
          backgroundImage: `url(${loginLeft})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-8">
          <img src="/logo.png" alt="Sisig Babi" className="h-24 w-24 object-contain mx-auto mb-4" />
          <h1 className="text-4xl font-black uppercase tracking-widest text-white">
            Sisig <span className="text-orange-500">Babi</span>
          </h1>
          <p className="text-gray-300 mt-3 text-lg">Crispy. Savory. Delivered.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div
        className="w-full md:w-1/2 relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${loginRight})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 w-full max-w-md px-8 py-10">
          <div className="bg-neutral-900/90 border border-neutral-700 p-8 rounded-xl backdrop-blur">

            <h2 className="text-3xl font-black uppercase tracking-widest text-white mb-1">Login</h2>
            <p className="text-gray-400 text-sm mb-8">Welcome back! Sign in to your account.</p>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2 block">Email</label>
                <input
                  type="email"
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-neutral-800 border border-neutral-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 transition placeholder-gray-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Password</label>
                  <Link to="/forgot-password" className="text-xs text-orange-400 hover:text-orange-300 transition">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-neutral-800 border border-neutral-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 transition placeholder-gray-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-black py-3 uppercase tracking-widest transition text-sm rounded-lg"
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-400 hover:text-orange-300 font-bold transition">
                Register for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login