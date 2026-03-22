import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <div className="min-h-screen bg-orange-50 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>

  if (!user || user.role !== 'admin') return <Navigate to="/" />

  return children
}

export default AdminRoute