import React from "react";

const CategoryCard = ({ title, subtitle, total, growth, accent, icon }) => {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1f44] to-[#07142e] p-5 h-[180px] shadow-lg">

            {/* Abstract gradient blob */}
            <div
                className="absolute -top-12 -right-12 h-44 w-44 rounded-full opacity-30 blur-3xl"
                style={{ backgroundColor: accent }}
            />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between">

                <div>
                    <p className="text-sm text-gray-400">{subtitle}</p>
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                </div>

                <div className="flex items-end justify-between">

                    {/* Stats */}
                    <div>
                        <p className="text-2xl font-bold text-white">{total}</p>
                        <span
                            className={`text-sm ${growth >= 0 ? "text-green-400" : "text-red-400"
                                }`}
                        >
                            {growth >= 0 ? "+" : ""}
                            {growth}% this month
                        </span>
                    </div>

                    {/* Icon with glow */}
                    <div
                        className="flex items-center justify-center h-12 w-12 rounded-xl"
                        style={{
                            backgroundColor: `${accent}20`,
                            color: accent,
                        }}
                    >
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;
