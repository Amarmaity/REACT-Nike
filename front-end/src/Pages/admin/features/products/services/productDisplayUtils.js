export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value));
};

export const getProductStatusLabel = (product) =>
  product?.is_active ? "Active" : "Inactive";

export const getProductStock = (product) => {
  if (!product) {
    return 0;
  }

  if (product.type === "variable") {
    return (product.variations || []).reduce(
      (total, variation) => total + Number(variation.stock_quantity || 0),
      0
    );
  }

  return Number(product.stock_quantity || 0);
};

const getPriceRangeLabel = (values) => {
  if (!values.length) {
    return "";
  }

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  return minValue === maxValue
    ? formatCurrency(minValue)
    : `${formatCurrency(minValue)} - ${formatCurrency(maxValue)}`;
};

export const getProductPriceSummary = (product) => {
  if (!product) {
    return { primary: "-", secondary: "" };
  }

  if (product.type === "simple") {
    return {
      primary: formatCurrency(product.price),
      secondary:
        product.compare_at_price && Number(product.compare_at_price) > Number(product.price)
          ? formatCurrency(product.compare_at_price)
          : "",
    };
  }

  if (!product.variations?.length) {
    return { primary: "-", secondary: "" };
  }

  const prices = product.variations
    .map((variation) => Number(variation.price))
    .filter((price) => !Number.isNaN(price));

  if (!prices.length) {
    return { primary: "-", secondary: "" };
  }

  const comparePrices = product.variations
    .map((variation) => ({
      price: Number(variation.price),
      compareAtPrice: Number(variation.compare_at_price),
    }))
    .filter(
      ({ price, compareAtPrice }) =>
        !Number.isNaN(compareAtPrice) && compareAtPrice > price
    )
    .map(({ compareAtPrice }) => compareAtPrice);

  return {
    primary: getPriceRangeLabel(prices) || "-",
    secondary:
      getPriceRangeLabel(comparePrices) ||
      `${product.variations.length} variants`,
  };
};

export const getProductCategoryLabel = (product) =>
  [
    product?.master_category?.name || "",
    product?.sub_category_details?.name || "",
  ]
    .filter(Boolean)
    .join(" / ");
