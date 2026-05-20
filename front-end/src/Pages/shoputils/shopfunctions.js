// =======

export const getProductCount = (products, type) => {
  return products.reduce((acc, product) => {
    let id;

    if (type === "category") {
      id = product.master_category?.id;
    }

    if (type === "subcategory") {
      id = product.sub_category_details?.id || product.sub_category;
    }

    if (id === undefined) return acc;

    acc[id] = (acc[id] || 0) + 1;

    return acc;
  }, {});
};

// Return unique values for a given accessor (path function)
export const getUniqueValues = (products, accessor) => {
  const set = new Set();
  products.forEach((p) => {
    try {
      const value = accessor(p);
      if (Array.isArray(value)) {
        value.forEach((v) => v && set.add(v));
      } else if (value !== undefined && value !== null) {
        set.add(value);
      }
    } catch (e) {
      // ignore
    }
  });
  return Array.from(set);
};

// filters: { categories: Set, subcategories: Set, colors: Set, sizes: Set, types: Set, inStockOnly: boolean, priceMax: number, priceMin: number }
export const filterProducts = (products, filters) => {
  if (!products || products.length === 0) return [];

  return products.filter((p) => {
    // category
    if (filters.categories && filters.categories.size > 0) {
      if (!filters.categories.has(String(p.master_category?.id ?? '')))
        return false;
    }

    // subcategory
    if (filters.subcategories && filters.subcategories.size > 0) {
      if (!filters.subcategories.has(String(p.sub_category_details?.id ?? p.sub_category ?? '')))
        return false;
    }

    // type
    if (filters.types && filters.types.size > 0) {
      if (!filters.types.has(String(p.type ?? '')))
        return false;
    }

    // stock
    if (filters.inStockOnly) {
      if (Number(p.stock_quantity || 0) <= 0) return false;
    }

    // colors - look for options or variations
    if (filters.colors && filters.colors.size > 0) {
      const colors = p.options?.flatMap(o => (o.values || []).map(v => v)) || [];
      const colorMatch = colors.some((c) => c && filters.colors.has(String(c)));
      if (!colorMatch) return false;
    }

    // sizes - search variations or options
    if (filters.sizes && filters.sizes.size > 0) {
      const sizes = p.options?.flatMap(o => (o.values || []).map(v => v)) || [];
      const sizeMatch = sizes.some((s) => s && filters.sizes.has(String(s)));
      if (!sizeMatch) return false;
    }

    // price
    const price = Number(p.price || 0);
    if (filters.priceMin !== undefined && price < filters.priceMin) return false;
    if (filters.priceMax !== undefined && filters.priceMax > 0 && price > filters.priceMax) return false;

    return true;
  });
};
