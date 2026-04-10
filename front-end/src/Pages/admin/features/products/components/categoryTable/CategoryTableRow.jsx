import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ADMIN_PATHS } from "../../../../../../routePath/adminPaths";

const CategoryTableRow = ({ categories, onEdit, onDelete }) => { 
   

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-900 transition">
      {/* ID */}
      <td className="px-4 py-3 text-gray-400 text-sm">
        #{categories.id}
      </td>

      {/* Name */}
      <td className="px-4 py-3 text-white font-medium">
        {categories.name}
      </td>  
      <td className="px-4 py-3 text-white font-medium">
        {categories.description}
      </td>   
      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Link
            to={ADMIN_PATHS.PRODUCT_EDIT(categories.id)}
            className="px-3 py-1 text-xs rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition"
          >
            Edit
          </Link>

          <button
            onClick={() => onEdit(categories.id)}
            className="px-3 py-1 text-xs rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition"
          >
            View
          </button>

          <button
            onClick={() => onDelete(categories.id)}
            className="px-3 py-1 text-xs rounded-md bg-gray-800 hover:bg-gray-700 text-red-400 transition"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};
export default CategoryTableRow;
