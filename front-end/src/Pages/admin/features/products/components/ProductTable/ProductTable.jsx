import React from "react";
import ProductTableRow from "./ProductTableRow";

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-gray-900 rounded-xl shadow-lg border border-gray-700">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-800 text-gray-300 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Price</th>
            <th className="px-4 py-3 text-left">Stock</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
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
              <td colSpan="5" className="text-center py-8 text-gray-500">
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
