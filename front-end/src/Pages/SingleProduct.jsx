import React, { useEffect } from 'react'
import Breadcrum from '../components/Breadcrum'
import ProductDisplay from '../components/ProductDisplay'
import Description from '../components/Description'

import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById } from '../features/products/productSlice'



const SingleProduct = () => {

   const { id, slug } = useParams()
   const dispatch = useDispatch()
   const {
      singleProduct,
      products,
      loading,
      error
   } = useSelector((state) => state.products)

   console.log(products, "========testing")
   console.log(id,slug, "========testing params")

   // TRY CACHE FIRST
   const existingProduct = products.find(
      (e) =>
         e.id === Number(id) ||
         e.slug === slug
   )

   // FETCH IF NOT FOUND
   useEffect(() => {
      if (!existingProduct) {
         dispatch(fetchProductById(id))
      }
   }, [dispatch, id, existingProduct])


   // FINAL PRODUCT
   const product = existingProduct || singleProduct


   useEffect(() => {
      window.scrollTo({
         top: 0,
         behavior: "smooth",
      });
   }, [])
  
   if (loading) {
      return (
         <div className="text-center mt-20">
            Loading...
         </div>
      )
   }
   // ERROR
   if (error) {
      return (
         <div className="text-center mt-20 text-red-500">
            {error?.response?.data?.message || error || "An error occurred"}
         </div>
      )
   }

   // NOT FOUND
   if (!product) {
      return (
         <div className="text-center mt-20 mb-20">
            Product not found
         </div>
      )
   }
   return (
      <div className="max-w-7xl mx-auto mb-32 mt-14">

         <Breadcrum product={product} />

         <ProductDisplay product={product} />

         <Description />

      </div>
   )
}

export default SingleProduct