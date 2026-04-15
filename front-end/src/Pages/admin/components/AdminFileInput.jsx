import React from "react";

const AdminFileInput = React.forwardRef(
  (
    {
      label,
      error,
      className = "",
      multiple = false,
      accept = "image/*",
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

        <input
          ref={ref}
          type="file"
          multiple={multiple}
          accept={accept}
          className={`
            w-full rounded-lg
            bg-[#0F2A4D]
            border border-gray-600
            text-gray-100
            px-4 py-2 text-sm
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-[#33CCCC] file:text-black
            hover:file:bg-[#2bbbbb]
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

export default AdminFileInput;