import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminButton } from "../../../components";
import { ADMIN_PATHS } from "../../../../../routePath/adminPaths";

const ProductHeader = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // 🔹 Route Conditions (simplified)
  const isProduct = pathname.includes("/products");
  const isCategoryPage = pathname.includes("/products/category");
  const isCreate = pathname.includes("/create");
  const isEdit = pathname.includes("/edit/");

  const isList = !isCreate && !isEdit;

  // 🔹 Title Logic (priority matters)
  let title = "Products";

  if (isCategoryPage) {
    title = "Manage Category";
  } else if (isProduct) {
    title = "Manage Products";
  }

  return (
    <div className="flex justify-between items-center mb-6">
      {/* 🔹 Title */}
      <h1 className="text-2xl font-bold">{title}</h1>

      {/* 🔹 Actions */}
      <div className="flex gap-3">

        {/* Show Manage Category on product pages only */}
        {isProduct && !isCategoryPage && (
          <AdminButton
            type="button"
            text="+ Manage Category"
            onClick={() => navigate(ADMIN_PATHS.CATEGORY_MANAGE)}
          />
        )}

        {/* Category Page Buttons */}
        {isCategoryPage && (
          <>
            <AdminButton
              type="button"
              text="+ Add Master Category"
              onClick={() => navigate(ADMIN_PATHS.MASTER_CATEGORY)}
            />
            <AdminButton
              type="button"
              text="+ Add SubCategory"
              onClick={() => navigate(ADMIN_PATHS.SUB_CATEGORY)}
            />
          </>
        )}

        {/* Product List Page */}
        {isList && isProduct && !isCategoryPage && (
          <AdminButton
            type="button"
            text="+ Add Product"
            onClick={() => navigate(ADMIN_PATHS.PRODUCT_CREATE)}
          />
        )}

        {/* Back Button (always visible) */}
        <AdminButton
          type="button"
          text="← Back"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate(ADMIN_PATHS.PRODUCTS);
            }
          }}
        />

      </div>
    </div>
  );
};

export default ProductHeader;