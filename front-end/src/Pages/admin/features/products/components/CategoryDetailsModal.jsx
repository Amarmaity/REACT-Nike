import React, { useEffect } from "react";

const CategoryDetailsModal = ({ category, onClose }) => {
  useEffect(() => {
    if (!category) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [category, onClose]);

  if (!category) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-[28px] border border-slate-700 bg-[#071629] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
              Category Details
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">{category.name}</h2>
          </div>

          <button
            type="button"
            className="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-400 hover:text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Slug</p>
            <p className="mt-2 break-all text-sm text-slate-200">{category.slug}</p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</p>
            <p className="mt-2 text-sm text-slate-200">
              {category.is_active ? "Active" : "Inactive"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Created</p>
            <p className="mt-2 text-sm text-slate-200">
              {new Date(category.created_at).toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Updated</p>
            <p className="mt-2 text-sm text-slate-200">
              {new Date(category.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsModal;
