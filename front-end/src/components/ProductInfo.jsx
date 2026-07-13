import React from 'react'
import {  Star } from 'lucide-react'
import { Link } from 'react-router-dom'



const ProductInfo = ({ product, selectedVariation, colors, sizes, selectedColor, setSelectedColor, selectedSize, setSelectedSize, setMainImage }) => {
  return (
    <div className='flex flex-col mt-8 md:mt-0'>
                <h1 className='text-foreground text-4xl font-bold'>
                    {product.name}
                </h1>
                <div className='flex items-center gap-1 text-gray-300 text-lg mt-4'>
                    <Star fill='#138695' />
                    <Star fill='#138695' />
                    <Star fill='#138695' />
                    <Star fill='#138695' />
                    <Star fill='gray' />
                    <p>(122)</p>
                </div>
                <div className='flex gap-5 font-semibold items-center my-5'>
                    {(selectedVariation?.compare_at_price || product.compare_at_price) && (
                        <div className='text-gray-500 text-2xl line-through'>
                            $
                            {selectedVariation?.compare_at_price ||
                                product.compare_at_price}
                        </div>
                    )}
                    <div className='text-[#138695] text-3xl'>
                        $
                        {selectedVariation?.price ||
                            product.price ||
                            "Variable"}

                    </div>

                </div>
                <div className='text-gray-300'>
                    {product.short_description}
                </div>
                {colors.length > 0 && (
                    <div className='mt-6'>
                        <h1 className='font-semibold text-gray-300 text-2xl'>
                            Select Color
                        </h1>
                        <div className='flex flex-wrap gap-4 items-center my-4'>
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => {
                                        setSelectedColor(color)
                                        const matchedVariation =
                                            product?.variations?.find(
                                                (v) =>
                                                    v.attributes?.Color === color &&
                                                    v.attributes?.Size === selectedSize
                                            )

                                        if (
                                            matchedVariation?.images?.[0]?.image
                                        ) {

                                            setMainImage(
                                                matchedVariation.images[0].image
                                            )

                                        }

                                    }}

                                    className={`
                                        border px-5 py-3 capitalize transition-all
                                        ${selectedColor === color
                                            ? "bg-[#138695] text-white border-[#138695]"
                                            : "border-gray-600 bg-gray-800/50 text-foreground"
                                        }
                                    `}
                                >

                                    {color}

                                </button>

                            ))}

                        </div>

                    </div>

                )}
                {sizes.length > 0 && (
                    <div className='mt-4'>
                        <h1 className='font-semibold text-gray-300 text-2xl'>
                            Select Size
                        </h1>
                        <div className='flex flex-wrap gap-4 items-center my-4'>
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`
                                        border px-5 py-3 uppercase transition-all
                                        ${selectedSize === size
                                            ? "bg-[#138695] text-white border-[#138695]"
                                            : "border-gray-600 bg-gray-800/50 text-foreground"
                                        }
                                    `}
                                >

                                    {size}

                                </button>

                            ))}

                        </div>

                    </div>

                )}

                {/* STOCK */}
                {selectedVariation && (

                    <p className='text-sm text-gray-400 mt-2'>

                        Stock Available :
                        {" "}
                        {selectedVariation.stock_quantity}

                    </p>

                )}

                {/* BUTTON */}
                <Link to='/cart'>
                    <button
                        onClick={() => {
                            if (product.type === "variable") {
                                if (!selectedColor || !selectedSize) {
                                    alert("Please select color and size")
                                    return
                                }

                            }
                            addToCart({
                                productId: product.id,
                                variationId: selectedVariation?.id,
                                color: selectedColor,
                                size: selectedSize,
                                quantity: 1
                            })
                        }}
                        className='bg-[#138695] text-white px-6 py-3 my-4 w-max'
                    >
                        ADD TO CART

                    </button>

                </Link>

                {/* CATEGORY */}
                <p className='text-gray-300'>
                    <span className='font-semibold'>
                        Category :
                    </span>
                    {" "}
                    {product?.master_category?.name}
                    {" / "}
                    {product?.sub_category_details?.name}
                </p>

                <p className='text-gray-300 mt-2'>

                    <span className='font-semibold'>
                        Tags :
                    </span>

                    {" "}

                    {Array.isArray(product.tags) &&
                        product.tags.length > 0
                        ? product.tags.join(", ")
                        : "Modern, Latest"}

                </p>

            </div>
  )
}

export default ProductInfo