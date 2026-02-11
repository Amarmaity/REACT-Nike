import React from "react";

const StatCard = ({ title, value, percent, icon, positive }) => {
  return (
    <div
      className="
        flex items-center justify-between
        rounded-lg
        bg-gradient-to-r from-[#0b1f44] to-[#0f2f6b]
        px-4 py-2
        h-[64px]
        shadow-md
      "
    >
      {/* Left */}
      <div className="leading-tight">
        <p className="text-[11px] text-gray-400">{title}</p>

        <div className="flex items-center gap-1">
          <h2 className="text-base font-semibold text-white">
            {value}
          </h2>

          <span
            className={`text-[11px] font-medium ${
              positive ? "text-green-400" : "text-red-400"
            }`}
          >
            {positive ? "+" : "-"}
            {percent}%
          </span>
        </div>
      </div>

      {/* Icon */}
      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500/20 text-blue-400">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
