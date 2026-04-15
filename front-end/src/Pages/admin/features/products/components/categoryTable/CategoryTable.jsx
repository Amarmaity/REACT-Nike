import React from "react";
import CategoryTableRowItem from "./CategoryTableRowItem";

const CategoryTable = ({ categories, onView, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-gray-900 rounded-xl shadow-lg border border-gray-800">
      <table className="min-w-full text-sm">
        
        <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Name</th> 
            <th className="px-4 py-3 text-left">Status</th> 
            <th className="px-4 py-3 text-left">Created</th> 
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-800">
          {categories.length > 0 ? (
            categories.map((category) => (
              <CategoryTableRowItem
                key={category.id}
                category={category}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-10 text-gray-500">
                No Category Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
