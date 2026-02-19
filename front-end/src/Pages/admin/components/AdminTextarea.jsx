import React from "react";

const AdminTextarea = React.forwardRef(
  ({ label, error, rows = 4, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          rows={rows}
          {...props}
          className={`bg-slate-800 border border-slate-600 
          text-white placeholder-slate-400
          rounded-md px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-cyan-500 
          focus:border-cyan-500 resize-none transition ${className}`}
        />

        {error && (
          <p className="text-red-400 text-xs">{error}</p>
        )}
      </div>
    );
  }
);

AdminTextarea.displayName = "AdminTextarea";

export default AdminTextarea;
