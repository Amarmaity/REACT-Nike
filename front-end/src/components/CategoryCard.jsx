import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <div className="bg-gray-900 group rounded-xl h-[400px] shadow-md relative overflow-hidden border border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

      <Link to={`/category/${category?.id}`}>
        <div className="h-full w-full overflow-hidden">
          <img
            src={category?.image}
            alt={category?.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="absolute inset-0 bg-black/30 group-hover:hidden"></div>
      
      <div className="absolute left-0 right-0 bottom-0 z-10 p-4 
                  translate-y-full group-hover:translate-y-0
                  transition-all duration-500 ease-in-out
                  bg-gradient-to-t from-black via-black/80 to-transparent">

        <h3 className="text-lg font-semibold text-white">
          <Link to={`/category/${category?.id}`}>
            {category?.name}
          </Link>
        </h3>

        <p className="text-sm text-gray-300 mt-1 line-clamp-2">
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