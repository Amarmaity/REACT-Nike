import React from "react";
import { Link } from "react-router-dom";
import { ADMIN_PATHS } from "../../../../../../routePath/adminPaths";

const ProductTableRow = ({ product, onEdit, onDelete }) => {

  // 🔥 Price Logic
  const getPrice = () => {
    if (product.type === "simple") {
      return (
        <div className="flex flex-col">
          {product.salePrice && (
            <span className="text-green-400 font-semibold">
              ₹{product.salePrice}
            </span>
          )}
          {product.regularPrice && (
            <span className="text-gray-500 line-through text-sm">
              ₹{product.regularPrice}
            </span>
          )}
        </div>
      );
    }

    if (product.type === "variable" && product.variations?.length) {
      const prices = product.variations.map(
        (v) => v.salePrice || v.regularPrice
      );
      const min = Math.min(...prices);
      const max = Math.max(...prices);

      return (
        <span className="text-green-400 font-semibold">
          ₹{min} - ₹{max}
        </span>
      );
    }

    return "-";
  };

  // 🔥 Stock Logic
  const getStock = () => {
    if (product.type === "simple") {
      return product.stock;
    }

    if (product.type === "variable") {
      return product.variations.reduce(
        (acc, curr) => acc + curr.stock,
        0
      );
    }

    return 0;
  };

  const totalStock = getStock();

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-900 transition">

      {/* ID */}
      <td className="px-4 py-3 text-gray-400 text-sm">
        #{product.id}
      </td>

      {/* Name */}
      <td className="px-4 py-3 text-white font-medium">
        {product.name}
      </td>

      {/* Category */}
      <td className="px-4 py-3">
        <span className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300">
          {product.category}
        </span>
      </td>
      {/* Type */}
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${product.type === "variable"
            ? "bg-gray-600 text-white"
            : "bg-gray-800 text-gray-300"
            }`}
        >
          {product.type === "variable" ? "Variable" : "Simple"}
        </span>
      </td>
      {/* Status */}
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${product.status === "Active"
              ? "bg-green-900 text-green-400"
              : "bg-gray-800 text-gray-400"
            }`}
        >
          {product.status}
        </span>
      </td>



      {/* Price */}
      <td className="px-4 py-3">
        {getPrice()}
      </td>

      {/* Stock */}
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded-full ${totalStock <= 5
            ? "bg-yellow-900 text-yellow-400"
            : "bg-gray-800 text-gray-300"
            }`}
        >
          {totalStock} in stock
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Link
            to={ADMIN_PATHS.PRODUCT_EDIT(product.id)}
            className="px-3 py-1 text-xs rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition"
          >
            Edit
          </Link>

          <button
            onClick={() => onEdit(product.id)}
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
export default ProductTableRow;
