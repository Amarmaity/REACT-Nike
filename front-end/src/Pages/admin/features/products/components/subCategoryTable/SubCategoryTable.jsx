import React from "react";
import SubCategoryTableRowItem from "./SubCategoryTableRowItem";

const SubCategoryTable = ({ subCategories, onView, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900 shadow-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-800 text-xs uppercase tracking-wider text-gray-400">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Subcategory</th>
            <th className="px-4 py-3 text-left">Parent</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Created</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-800">
          {subCategories.length > 0 ? (
            subCategories.map((subCategory) => (
              <SubCategoryTableRowItem
                key={subCategory.id}
                subCategory={subCategory}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-10 text-center text-gray-500">
                No Subcategory Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SubCategoryTable;
