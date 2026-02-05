import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  if (loading) return null; 

  return isAuthenticated ? children : <Navigate to="/user/login" />;
};

export default PrivateRoute;
