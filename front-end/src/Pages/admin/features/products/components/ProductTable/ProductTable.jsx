import React from "react";
import ProductTableRow from "./ProductTableRow";

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-gray-900 rounded-xl shadow-lg border border-gray-800">
      <table className="min-w-full text-sm">
        
        <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Status</th> {/* NEW */}
            <th className="px-4 py-3 text-left">Price</th>
            <th className="px-4 py-3 text-left">Stock</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-800">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-10 text-gray-500">
                No Products Found
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
};

export default ProductTable;
