import React, { useEffect } from "react";
import {
  formatCurrency,
  getProductCategoryLabel,
  getProductPriceSummary,
  getProductStatusLabel,
  getProductStock,
} from "../services/productDisplayUtils";

const Section = ({ label, children }) => (
  <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
      {label}
    </p>
    {children}
  </div>
);

const ProductDetailsModal = ({ product, onClose }) => {
  useEffect(() => {
    if (!product) {
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
  }, [product, onClose]);

  if (!product) {
    return null;
  }

  const priceSummary = getProductPriceSummary(product);
  const totalStock = getProductStock(product);
  const gallery = [product.image, ...(product.gallery || []).map((item) => item.image)].filter(
    Boolean
  );

  return (
    
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-[28px] border border-slate-700 bg-[#071629] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >        
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                Product Details
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">{product.name}</h2>
              <p className="mt-2 text-sm text-slate-400">
                {getProductCategoryLabel(product) || "Uncategorized"}
              </p>
            </div>

            <button
              type="button"
              className="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-400 hover:text-white"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6">
              <Section label="Media">
                {gallery.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {gallery.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950"
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="h-64 w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No product images uploaded.</p>
                )}
              </Section>

              <Section label="Description">
                <p className="text-sm leading-7 text-slate-300">
                  {product.description || "No description added."}
                </p>
              </Section>

              {product.type === "variable" && (
                <Section label="Variants">
                  <div className="space-y-4">
                    {(product.variations || []).map((variation) => (
                      <div
                        key={variation.id}
                        className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-white">{variation.title}</p>
                            <p className="text-sm text-slate-400">
                              {Object.entries(variation.attributes || {})
                                .map(([name, value]) => `${name}: ${value}`)
                                .join(" | ")}
                            </p>
                          </div>
                          <div className="text-right text-sm">
                            <p className="font-semibold text-emerald-400">
                              {formatCurrency(variation.price)}
                            </p>
                            {variation.compare_at_price && (
                              <p className="text-slate-500 line-through">
                                {formatCurrency(variation.compare_at_price)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                          <div className="rounded-xl bg-slate-900 p-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                              SKU
                            </p>
                            <p className="mt-1 text-sm text-slate-200">{variation.sku}</p>
                          </div>
                          <div className="rounded-xl bg-slate-900 p-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                              Stock
                            </p>
                            <p className="mt-1 text-sm text-slate-200">
                              {variation.stock_quantity}
                            </p>
                          </div>
                          <div className="rounded-xl bg-slate-900 p-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                              Status
                            </p>
                            <p className="mt-1 text-sm text-slate-200">
                              {variation.is_active ? "Active" : "Inactive"}
                            </p>
                          </div>
                        </div>

                        {variation.images?.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                            {variation.images.map((image) => (
                              <img
                                key={image.id}
                                src={image.image}
                                alt={variation.title}
                                className="h-28 w-full rounded-xl object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            <div className="space-y-6">
              <Section label="Overview">
                <div className="grid grid-cols-1 gap-3">
                  <div className="rounded-xl bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Type
                    </p>
                    <p className="mt-1 text-sm text-slate-200 capitalize">{product.type}</p>
                  </div>
                  <div className="rounded-xl bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Status
                    </p>
                    <p className="mt-1 text-sm text-slate-200">
                      {getProductStatusLabel(product)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Slug
                    </p>
                    <p className="mt-1 break-all text-sm text-slate-200">{product.slug}</p>
                  </div>
                  <div className="rounded-xl bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Featured
                    </p>
                    <p className="mt-1 text-sm text-slate-200">
                      {product.featured ? "Featured" : "Standard"}
                    </p>
                  </div>
                </div>
              </Section>

              <Section label="Pricing">
                <p className="text-2xl font-bold text-emerald-400">{priceSummary.primary}</p>
                {priceSummary.secondary && (
                  <p className="mt-2 text-sm text-slate-400">{priceSummary.secondary}</p>
                )}
              </Section>

              <Section label="Inventory">
                <div className="grid grid-cols-1 gap-3">
                  <div className="rounded-xl bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Total Stock
                    </p>
                    <p className="mt-1 text-sm text-slate-200">{totalStock}</p>
                  </div>
                  <div className="rounded-xl bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Inventory Mode
                    </p>
                    <p className="mt-1 text-sm text-slate-200">
                      {product.type === "variable"
                        ? "Per variant"
                        : product.track_quantity
                          ? "Tracked"
                          : "Not tracked"}
                    </p>
                  </div>
                  {product.type === "simple" && (
                    <div className="rounded-xl bg-slate-950/70 p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        SKU
                      </p>
                      <p className="mt-1 text-sm text-slate-200">{product.sku || "-"}</p>
                    </div>
                  )}
                </div>
              </Section>

              {product.options?.length > 0 && (
                <Section label="Options">
                  <div className="space-y-3">
                    {product.options.map((option) => (
                      <div key={option.name} className="rounded-xl bg-slate-950/70 p-3">
                        <p className="text-sm font-semibold text-white">{option.name}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {(option.values || []).join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              <Section label="Timestamps">
                <div className="space-y-2 text-sm text-slate-300">
                  <p>Created: {new Date(product.created_at).toLocaleString()}</p>
                  <p>Updated: {new Date(product.updated_at).toLocaleString()}</p>
                </div>
              </Section>
            </div>
          </div>
          {/* your content */}
        

      </div>
    </div>
  );
};

export default ProductDetailsModal;
