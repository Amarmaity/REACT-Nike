import React from 'react'
import { UpdateFollower } from 'react-mouse-follower';
import { Link } from 'react-router-dom'


const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const getRangeLabel = (values) => {
  if (!values.length) {
    return "";
  }

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  return minValue === maxValue
    ? formatCurrency(minValue)
    : `${formatCurrency(minValue)} - ${formatCurrency(maxValue)}`;
};

const getProductPricing = (product) => {
  if (!product) {
    return { priceLabel: "", compareLabel: "" };
  }

  if (product.type !== "variable") {
    const compareLabel =
      product.compare_at_price &&
        Number(product.compare_at_price) > Number(product.price)
        ? formatCurrency(product.compare_at_price)
        : "";

    return {
      priceLabel: formatCurrency(product.price),
      compareLabel,
    };
  }

  const prices = (product.variations || [])
    .map((variation) => Number(variation.price))
    .filter((price) => !Number.isNaN(price));
  const comparePrices = (product.variations || [])
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
    priceLabel: getRangeLabel(prices),
    compareLabel: getRangeLabel(comparePrices),
  };
};

const Item = ({ product }) => {
  const { priceLabel, compareLabel } = getProductPricing(product);

  // const [products, setProducts] = useState(product)

  // useEffect(() => {
  //   if (product?.type === "variable") {
  //     setProducts(product?.variations?.[0])
  //   } else {
  //     setProducts(product)
  //   }
  // }, [product])

  return (
    <UpdateFollower mouseOptions={{ visible: false }} style={{ display: 'contents' }}>
      <div className='group relative '>

        <Link to={`/products/${product.id}/${product.slug}`}>
          <div className='aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-800/50 lg:aspect-none group-hover:opacity-75 lg:h-80 h-96 border border-gray-700/50'>

            <img
              src={product?.image}
              alt={product?.name}
              className='h-full w-full object-cover object-center lg:h-full lg:w-full'
            />

          </div>
        </Link>

        <div className='mt-4 flex justify-between'>

          <div>
            <h3 className='text-sm text-foreground'>
              <Link to={`/products/${product.id}/${product.slug}`}>
                <span>{product?.name}</span>
              </Link>
            </h3>
          </div>

          <div className='text-right'>
            <p className='text-sm font-medium text-foreground'>
              {priceLabel || "Price unavailable"}
            </p>
            {compareLabel && (
              <p className='text-xs text-gray-400 line-through'>
                {compareLabel}
              </p>
            )}
          </div>
          {/* <div className="metabox">
          {product?.sub_category_details?.name}
        </div> */}
          {/* {
          product?.short_description &&
          (
            <p>{product?.short_description}</p>
          )
        } */}

        </div>
      </div>
    </UpdateFollower>
  )
}
export default Item
