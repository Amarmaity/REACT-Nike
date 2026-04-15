export const DEFAULT_PRODUCT_OPTIONS = [
  { name: "Size", values: "" },
  { name: "Color", values: "" },
];

export const buildAttributeKey = (attributes = {}) =>
  Object.entries(attributes)
    .map(([name, value]) => `${name}:${value}`)
    .join("|");

const appendIfPresent = (formData, key, value) => {
  if (value !== undefined && value !== null && value !== "") {
    formData.append(key, value);
  }
};

export const buildProductFormData = (data) => {
  const formData = new FormData();

  appendIfPresent(formData, "type", data.type);
  appendIfPresent(formData, "sub_category", data.sub_category);
  appendIfPresent(formData, "name", data.name);
  appendIfPresent(formData, "short_description", data.short_description);
  appendIfPresent(formData, "description", data.description);
  appendIfPresent(formData, "slug", data.slug);
  formData.append("featured", String(Boolean(data.featured)));
  formData.append("is_active", String(Boolean(data.is_active)));

  if (data.image?.[0]) {
    formData.append("image", data.image[0]);
  }

  Array.from(data.gallery_images || []).forEach((file) => {
    formData.append("gallery_images", file);
  });

  if (data.type === "simple") {
    appendIfPresent(formData, "sku", data.sku);
    appendIfPresent(formData, "price", data.price);
    appendIfPresent(formData, "compare_at_price", data.compare_at_price);
    formData.append("track_quantity", String(Boolean(data.track_quantity)));
    appendIfPresent(formData, "stock_quantity", data.stock_quantity);
    return formData;
  }

  appendIfPresent(formData, "base_sku", data.base_sku);
  formData.append("options", JSON.stringify(data.options || []));

  const variationPayload = (data.variations || []).map(
    ({ images, ...variation }) => variation
  );
  formData.append("variations", JSON.stringify(variationPayload));

  (data.variations || []).forEach((variation, index) => {
    Array.from(variation.images || []).forEach((file) => {
      formData.append(`variation_images_${index}`, file);
    });
  });

  return formData;
};

export const mapProductToFormValues = (product) => ({
  type: product.type || "simple",
  master_category: String(product.master_category?.id || ""),
  sub_category: String(product.sub_category || ""),
  name: product.name || "",
  short_description: product.short_description || "",
  description: product.description || "",
  slug: product.slug || "",
  sku: product.sku || "",
  base_sku: product.base_sku || "",
  price: product.price ?? "",
  compare_at_price: product.compare_at_price ?? "",
  stock_quantity: product.stock_quantity ?? 0,
  track_quantity: product.track_quantity ?? true,
  featured: product.featured ?? false,
  is_active: product.is_active ?? true,
  image: null,
  gallery_images: null,
  options:
    product.type === "variable" && product.options?.length
      ? product.options.map((option) => ({
          name: option.name || "",
          values: Array.isArray(option.values) ? option.values.join(", ") : "",
        }))
      : DEFAULT_PRODUCT_OPTIONS.map((option) => ({ ...option })),
  variations:
    product.type === "variable"
      ? (product.variations || []).map((variation) => ({
          title: variation.title || "",
          attribute_key: buildAttributeKey(variation.attributes),
          attributes: variation.attributes || {},
          sku: variation.sku || "",
          price: variation.price ?? "",
          compare_at_price: variation.compare_at_price ?? "",
          stock_quantity: variation.stock_quantity ?? 0,
          track_quantity: variation.track_quantity ?? true,
          is_active: variation.is_active ?? true,
          images: null,
        }))
      : [],
});
