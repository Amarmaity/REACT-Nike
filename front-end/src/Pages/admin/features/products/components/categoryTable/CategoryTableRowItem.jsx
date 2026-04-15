import React from "react";

const CategoryTableRowItem = ({ category, onView, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-gray-800 hover:bg-gray-900 transition">
      <td className="px-4 py-3 text-gray-400 text-sm">#{category.id}</td>

      <td className="px-4 py-3 text-white font-medium">
        <div className="flex flex-col">
          <span>{category.name}</span>
          <span className="text-xs text-gray-500">{category.slug}</span>
        </div>
      </td>

      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            category.is_active
              ? "bg-green-900 text-green-400"
              : "bg-gray-800 text-gray-400"
          }`}
        >
          {category.is_active ? "Active" : "Inactive"}
        </span>
      </td>

      <td className="px-4 py-3 text-gray-300 text-sm">
        {new Date(category.created_at).toLocaleDateString()}
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(category)}
            className="px-3 py-1 text-xs rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition"
          >
            Edit
          </button>

          <button
            onClick={() => onView(category)}
            className="px-3 py-1 text-xs rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition"
          >
            View
          </button>

          <button
            onClick={() => onDelete(category.id)}
            className="px-3 py-1 text-xs rounded-md bg-gray-800 hover:bg-gray-700 text-red-400 transition"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CategoryTableRowItem;
