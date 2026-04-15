import React from "react";
import { Link } from "react-router-dom";
import { ADMIN_PATHS } from "../../../../../../routePath/adminPaths";
import {
  getProductCategoryLabel,
  getProductPriceSummary,
  getProductStatusLabel,
  getProductStock,
} from "../../services/productDisplayUtils";

const ProductTableRowItem = ({ product, onView, onDelete }) => {
  const totalStock = getProductStock(product);
  const priceSummary = getProductPriceSummary(product);
  const statusLabel = getProductStatusLabel(product);
  const categoryLabel = getProductCategoryLabel(product);
  const thumbnail = product.image || product.gallery?.[0]?.image;

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-900 transition">
      <td className="px-4 py-3 text-gray-400 text-sm">#{product.id}</td>

      <td className="px-4 py-3 text-white font-medium">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-xl border border-gray-700 bg-gray-800">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                No Img
              </div>
            )}
          </div>

          <div>
            <p className="font-medium text-white">{product.name}</p>
            <p className="text-xs text-gray-500">{product.slug}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300">
          {categoryLabel || "Uncategorized"}
        </span>
      </td>

      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            product.type === "variable"
              ? "bg-cyan-900/50 text-cyan-300"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          {product.type === "variable" ? "Variable" : "Simple"}
        </span>
      </td>

      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            product.is_active
              ? "bg-green-900 text-green-400"
              : "bg-gray-800 text-gray-400"
          }`}
        >
          {statusLabel}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="text-green-400 font-semibold">{priceSummary.primary}</span>
          {priceSummary.secondary && (
            <span className="text-gray-500 text-xs">{priceSummary.secondary}</span>
          )}
        </div>
      </td>

      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            totalStock <= 5
              ? "bg-yellow-900 text-yellow-400"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          {totalStock} in stock
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Link
            to={ADMIN_PATHS.PRODUCT_EDIT(product.id)}
            className="px-3 py-1 text-xs rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition"
          >
            Edit
          </Link>

          <button
            onClick={() => onView(product)}
            className="px-3 py-1 text-xs rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition"
          >
            View
          </button>

          <button
            onClick={() => onDelete(product.id)}
            className="px-3 py-1 text-xs rounded-md bg-gray-800 hover:bg-gray-700 text-red-400 transition"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductTableRowItem;
