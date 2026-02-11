import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const AdminPrivateRoute = () => {
  const { isAuthenticated, loading, user } = useSelector(
    (state) => state.auth
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace />
  }

  if (user?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default AdminPrivateRoute
