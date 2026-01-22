import React, { useEffect } from 'react'
import Breadcrum from './Breadcrum'
import ProductDisplay from './ProductDisplay'
import Description from './Description'
import { useParams } from 'react-router-dom'
import all_product from '../Utils/all_product'

const SingleProduct = () => {
    const {productId} = useParams();
    const product = all_product.find((e)=> e.id === Number(productId))
    useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])
  return (
    <div className='max-w-7xl mx-auto mb-32 mt-14'>
      <Breadcrum product={product}/>
      <ProductDisplay product={product}/>
      <Description/>
    </div>
  )
}

export default SingleProduct
