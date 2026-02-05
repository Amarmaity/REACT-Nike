import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminPrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector(
    (state) => state.auth
  );

  if (loading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/user/login" />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/unauthorized" />; 
  }

  return children;
};

export default AdminPrivateRoute;
