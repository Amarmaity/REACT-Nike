import React, { useEffect } from 'react'
import Item from './Item'
import { ShimmerPostItem } from 'react-shimmer-effects'
import { fetchProductStore } from '../features/products/product/productstore'
import { useDispatch, useSelector } from 'react-redux'
const ProductList = (props) => {  
  const dispatch = useDispatch()
  const {productStore} = useSelector((state)=> state.products)
  useEffect(() => {
    if(productStore.length === 0){
      dispatch(fetchProductStore())
    }
    
  }, [dispatch, productStore.length])
  console.log(productStore)
  return (
    <div className='mx-auto max-w-2xl px-4 py-16 sm:pt-24 lg:max-w-7xl lg:px-8'>
      <h2 className='text-4xl font-bold tracking-tight text-foreground text-center font-serif'>Top Sellers</h2>
      <p className='text-center mt-3 md:px-56 text-gray-300'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsum nulla quis in similique officia, cupiditate fugit mollitia saepe necessitatibus.</p>
      <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-10   px-6 md:px-0 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8  items-start'>
        {productStore.length === 0 &&
          Array(8).fill(0).map((_, index) => (
            <div
              key={index}
              className="h-[240px] overflow-hidden rounded-sm"
            >
              <ShimmerPostItem imageHeight={150} card title style={{ height: "220px" }} />
            </div>
          ))
        }
        {
          productStore.map((product) => {
            
              return <Item key={product.id} product={product} />
           
          })
        }

      </div>
    </div>
  )
}

export default ProductList
