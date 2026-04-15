import React from "react";

const SubCategoryTableRowItem = ({ subCategory, onView, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-gray-800 transition hover:bg-gray-900">
      <td className="px-4 py-3 text-sm text-gray-400">#{subCategory.id}</td>

      <td className="px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          {subCategory.image ? (
            <img
              src={subCategory.image}
              alt={subCategory.name}
              className="h-12 w-12 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800 text-xs text-gray-500">
              N/A
            </div>
          )}

          <div className="flex flex-col">
            <span className="font-medium">{subCategory.name}</span>
            <span className="text-xs text-gray-500">{subCategory.slug}</span>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 text-sm text-gray-300">
        {subCategory.master_category_details?.name || "Not available"}
      </td>

      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            subCategory.is_active
              ? "bg-green-900 text-green-400"
              : "bg-gray-800 text-gray-400"
          }`}
        >
          {subCategory.is_active ? "Active" : "Inactive"}
        </span>
      </td>

      <td className="px-4 py-3 text-sm text-gray-300">
        {new Date(subCategory.created_at).toLocaleDateString()}
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(subCategory)}
            className="rounded-md bg-gray-700 px-3 py-1 text-xs text-gray-200 transition hover:bg-gray-600"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onView(subCategory)}
            className="rounded-md bg-gray-700 px-3 py-1 text-xs text-gray-200 transition hover:bg-gray-600"
          >
            View
          </button>

          <button
            type="button"
            onClick={() => onDelete(subCategory.id)}
            className="rounded-md bg-gray-800 px-3 py-1 text-xs text-red-400 transition hover:bg-gray-700"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SubCategoryTableRowItem;
