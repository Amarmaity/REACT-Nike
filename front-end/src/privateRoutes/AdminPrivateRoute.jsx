import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import { PUBLIC_PATHS } from "../routePath/publicPaths"

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
    return <Navigate to={`${PUBLIC_PATHS.LOGIN}`} replace />
  }

  if (user?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />


  }
  return <Outlet />
}

export default AdminPrivateRoute
