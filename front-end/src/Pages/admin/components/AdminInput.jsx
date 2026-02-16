import React from "react";

const AdminInput = React.forwardRef(
    ({ label, type = "text", error, className = "", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        {label}
                    </label>
                )}

                <input
                    ref={ref}
                    type={type}
                    className={`
            w-full rounded-lg
            bg-[#0F2A4D]
            border border-gray-600
            text-gray-100
            px-4 py-2 text-sm
            focus:outline-none
            focus:ring-2 focus:ring-[#33CCCC]
            focus:border-[#33CCCC]
            transition
            ${error ? "border-red-500" : ""}
            ${className}
          `}
                    {...props}
                />

                {error && (
                    <p className="text-red-400 text-xs mt-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

export default AdminInput;
