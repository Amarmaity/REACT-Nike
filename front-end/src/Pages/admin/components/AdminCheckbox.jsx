import React from "react";

const AdminCheckbox = React.forwardRef(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            ref={ref}
            {...props}
            className={`w-4 h-4 
            bg-slate-800 border border-slate-600 
            accent-cyan-500 
            rounded 
            focus:ring-cyan-500 ${className}`}
          />
          <span className="text-sm text-slate-300">
            {label}
          </span>
        </label>

        {error && (
          <p className="text-red-400 text-xs">{error}</p>
        )}
      </div>
    );
  }
);

AdminCheckbox.displayName = "AdminCheckbox";

export default AdminCheckbox;
