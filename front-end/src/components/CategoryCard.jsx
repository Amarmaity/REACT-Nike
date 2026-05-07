import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      
      <Link to={`/category/${category?.id}`}>
        <div className="h-52 w-full overflow-hidden">
          <img
            src={category?.image}
            alt={category?.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white">
          <Link to={`/category/${category?.id}`}>
            {category?.name}
          </Link>
        </h3>

        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
          {category?.description}
        </p>

        <Link
          to={`/category/${category?.id}`}
          className="inline-block mt-3 text-sm text-blue-400 hover:underline"
        >
          View Category →
        </Link>
      </div>
    </div>
  );
};

export default CategoryCard;