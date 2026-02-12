import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { PUBLIC_PATHS } from "../routePath/publicPaths";

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  if (loading) return null; 

  return isAuthenticated ? <Outlet /> : <Navigate to={`${PUBLIC_PATHS.LOGIN}`} replace />;
};
export default PrivateRoute;
