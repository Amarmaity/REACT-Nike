import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { loginSuccess, logout, authChecked } from "../features/auth/authSlice";

const AuthCheck = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1️⃣ try normal auth
        const res = await api.get("/get-user/");
        dispatch(loginSuccess(res.data.user));
      } catch (err) {
        // only attempt refresh on 401
        if (err.response?.status === 401) {
          try {
            // 2️⃣ refresh access token
            await api.post("/refresh-token/");
            const res2 = await api.get("/get-user/");
            dispatch(loginSuccess(res2.data.user));
          } catch {
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
  }, [dispatch]);

  return children;
};

export default AuthCheck;
