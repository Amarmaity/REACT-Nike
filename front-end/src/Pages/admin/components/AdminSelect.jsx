import React from "react";

const AdminSelect = React.forwardRef(
  (
    {
      label,
      error,
      options = [],
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-200 mb-2">
            {label}
          </label>
        )}

        <select
          ref={ref}
          className={`
            w-full
            bg-[#0F2A4D]
            border border-gray-600
            text-gray-100
            rounded-xl
            px-4 py-2
            text-sm
            focus:outline-none
            focus:ring-2 focus:ring-[#33CCCC]
            focus:border-[#33CCCC]
            transition
            appearance-none
            ${error ? "border-red-500" : ""}
            ${className}
          `}
          {...props}
        >
          {/* Default placeholder option */}
          <option value="">Select an option</option>

          {/* If options prop is provided */}
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        {error && (
          <p className="text-red-400 text-xs mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AdminSelect.displayName = "AdminSelect";
export default AdminSelect;
