import React from "react";
import { Outlet } from "react-router-dom";
import ProductHeader from "./components/ProductHeader";
import { DashboardSection } from "../../components";
const Products = () => {
  return (
    <DashboardSection>
      <ProductHeader />
      <Outlet />
    </DashboardSection>
  );
};
export default Products;
