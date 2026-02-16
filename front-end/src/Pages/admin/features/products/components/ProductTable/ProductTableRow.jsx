import React from "react";
import { Link } from "react-router-dom";
import { ADMIN_PATHS } from "../../../../../../routePath/adminPaths";

const ProductTableRow = ({ product, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-gray-700 hover:bg-gray-800 transition">
      <td className="px-4 py-3 text-gray-300">{product.id}</td>

      <td className="px-4 py-3 font-medium text-white">
        {product.name}
      </td>

      <td className="px-4 py-3 text-blue-400 font-semibold">
        ₹{product.price}
      </td>

      <td className="px-4 py-3">
        <span className="px-2 py-1 text-xs rounded-full bg-gray-600 text-blue-300">
          {product.stock} in stock
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Link
          to={`${ADMIN_PATHS.PRODUCT_EDIT(product.id)}`}           
            className="px-3 py-1 text-xs rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Edit
          </Link>
          <button
            onClick={() => onEdit(product.id)}
            className="px-3 py-1 text-xs rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            View
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="px-3 py-1 text-xs rounded-md bg-red-600 hover:bg-red-700 text-white transition"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductTableRow;
