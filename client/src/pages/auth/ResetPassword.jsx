import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../utils/axios'
import loginLeft from '../../assets/login-left.jpg'
import loginRight from '../../assets/login-right.jpg'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match')
    }

    setLoading(true)
    try {
      const res = await API.post('/auth/reset-password', { token, newPassword })
      setMessage(res.data.message || 'Password reset successful!')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div className="absolute inset-0 flex">
        <div
          className="w-1/2 h-full"
          style={{
            backgroundImage: `url(${loginLeft})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="w-1/2 h-full"
          style={{
            backgroundImage: `url(${loginRight})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-neutral-900/90 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Sisig Babi" className="w-12 h-12 mx-auto mb-3" />
            <h1 className="text-2xl font-black uppercase tracking-wide text-white">
              SISIG <span className="text-orange-500">BABI</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Enter your new password</p>
          </div>

          {message && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl text-sm mb-4">
              {message} Redirecting to login...
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3 rounded-xl uppercase tracking-widest transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Resetting...' : 'Reset Password →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword