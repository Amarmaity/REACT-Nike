import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductGallery from './ProductGallery'
import ProductInfo from './ProductInfo'

const ProductDisplay = ({ product }) => {
    const { addToCart } = useContext(ShopContext)
    const [selectedColor, setSelectedColor] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)
    const galleryImages = product?.gallery || []

    const [mainImage, setMainImage] = useState(
        galleryImages[0]?.image || product?.image
    )

    const [selectedImage, setSelectedImage] = useState(null)

    const displayedImage = selectedImage || mainImage
    const colors = [
        ...new Set(
            product?.variations
                ?.map((v) => v.attributes?.Color)
                .filter(Boolean)
        )
    ]
    const sizes = [
        ...new Set(
            product?.variations
                ?.map((v) => v.attributes?.Size)
                .filter(Boolean)
        )
    ]


    const selectedVariation = product?.variations?.find(
        (variation) =>
            variation.attributes?.Color === selectedColor &&
            variation.attributes?.Size === selectedSize
    )

    // reset states when product changes
    useEffect(() => {
        const firstImage =
            galleryImages[0]?.image || product?.image
        setMainImage(firstImage)
        setSelectedImage(firstImage)
        // auto select first variation
        if (product?.variations?.length > 0) {
            const firstVariation = product.variations[0]
            setSelectedColor(firstVariation.attributes?.Color || null)
            setSelectedSize(firstVariation.attributes?.Size || null)
        } else {
            setSelectedColor(null)
            setSelectedSize(null)
        }
    }, [product])
    if (!product) return null
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 my-20 md:gap-10 px-6 md:px-0'>
           
           <ProductGallery product={product} selectedImage={selectedImage} mainImage={mainImage} setMainImage={setMainImage} galleryImages={galleryImages}  setSelectedImage={setSelectedImage}  />
           <ProductInfo product={product} selectedColor={selectedColor} selectedSize={selectedSize} colors={colors} sizes={sizes} selectedVariation={selectedVariation} setMainImage={setMainImage} setSelectedSize={setSelectedSize} setSelectedColor={setSelectedColor} />
            

        </div>

    )
}
export default ProductDisplay