import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminButton } from "../../../components";
import { ADMIN_PATHS } from "../../../../../routePath/adminPaths";

const ProductHeader = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isCreate = pathname.includes("/create");
  const isEdit = pathname.includes("/edit/");
  const isList = !isCreate && !isEdit;

  let title = "Products";

  if (isCreate) title = "Create Product";
  else if (isEdit) title = "Edit Product";

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex gap-3">
        {isList && (
          <AdminButton
            type="button"
            text="+ Add Product"
            onClick={() => navigate(ADMIN_PATHS.PRODUCT_CREATE)}
          />
        )}

        {(isCreate || isEdit) && (
          <AdminButton
            type="button"
            text="← Back to List"
            onClick={() => navigate(ADMIN_PATHS.PRODUCTS)}
          />
        )}
      </div>
    </div>
  );

};

export default ProductHeader;
