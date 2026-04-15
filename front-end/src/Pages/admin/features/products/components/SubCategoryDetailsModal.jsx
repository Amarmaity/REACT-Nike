import React, { useEffect } from "react";

const SubCategoryDetailsModal = ({ subCategory, onClose }) => {
  useEffect(() => {
    if (!subCategory) {
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
  }, [subCategory, onClose]);

  if (!subCategory) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-[28px] border border-slate-700 bg-[#071629] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
              Subcategory Details
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">{subCategory.name}</h2>
          </div>

          <button
            type="button"
            className="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-400 hover:text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/70">
            {subCategory.image ? (
              <img
                src={subCategory.image}
                alt={subCategory.name}
                className="h-full max-h-[320px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[240px] items-center justify-center bg-slate-950 text-sm text-slate-500">
                No image uploaded
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Parent Category
              </p>
              <p className="mt-2 text-sm text-slate-200">
                {subCategory.master_category_details?.name || "Not available"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Slug</p>
              <p className="mt-2 break-all text-sm text-slate-200">
                {subCategory.slug || "Auto generated"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Status
              </p>
              <p className="mt-2 text-sm text-slate-200">
                {subCategory.is_active ? "Active" : "Inactive"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Created
              </p>
              <p className="mt-2 text-sm text-slate-200">
                {new Date(subCategory.created_at).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Description
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-200">
                {subCategory.description || "No description added"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Updated
              </p>
              <p className="mt-2 text-sm text-slate-200">
                {new Date(subCategory.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryDetailsModal;
