import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  if (loading) return null; 

  return isAuthenticated ? <Outlet /> : <Navigate to="/user/login" replace />;
};
export default PrivateRoute;
