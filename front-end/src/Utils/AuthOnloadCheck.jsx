import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { loginSuccess, logout, authChecked } from "../features/auth/authSlice";

const AuthCheck = ({ children }) => {
  const dispatch = useDispatch();
  const hasChecked = useRef(false);

  useEffect(() => {    
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkAuth = async () => {
      try {
        // Try to get user with existing access token
        const res = await api.get("/get-user/");
        dispatch(loginSuccess(res.data.user));
      } catch (err) {
        // If access token failed, try to refresh
        if (err.response?.status === 401) {
          try {
            await api.post("/refresh/");
            // After refresh, try get-user again
            const res2 = await api.get("/get-user/");
            dispatch(loginSuccess(res2.data.user));
          } catch {
            // Refresh also failed - user is not logged in
            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }
      } finally {
        dispatch(authChecked());
      }
    };

    checkAuth();

    // Listen for logout events from axios interceptor (for other API calls)
    const handleAuthLogout = () => {
      dispatch(logout());
    };

    window.addEventListener("auth:logout", handleAuthLogout);

    return () => {
      window.removeEventListener("auth:logout", handleAuthLogout);
    };
  }, [dispatch]);
  return children;
};
export default AuthCheck;
