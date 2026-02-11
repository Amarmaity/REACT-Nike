import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const isAdmin = user?.role === "admin";
  
  const pathname = location.pathname.replace(/\/$/, "");
  const isAdminDashboard = pathname.startsWith("/admin/dashboard");
  const hideLayout = isAdmin && isAdminDashboard;

  return (
    <>
      {!hideLayout && <Navbar />}
      <Outlet />
      {!hideLayout && <Footer />}
    </>
  );
};

export default Layout;
