import React from 'react'
import { Link } from 'react-router-dom'

const Item = ({product}) => {
  return (
    <div className='group relative'>
      <Link to={`/products/${product?.id}`}>
      <div className='aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-800/50 lg:aspect-none grup-hover:opacity-75 lg:h-80 h-96 border border-gray-700/50'>
        <img src={product?.image} alt={product?.name} className='h-full w-full object-cover object-center lg:h-full lg:w-full' />
      </div>
      </Link>
      <div className='mt-4 flex justify-between'>
        <div>
            <h3 className='text-sm text-foreground'>
                <Link to={`/products/${product?.id}`}>
                <span aria-hidden="true" className='inset-0'>{product?.name}</span>
                </Link>
            </h3>
        </div>
        <p className='text-sm font-medium text-foreground'>${product?.new_price}</p>
      </div>
    </div>
  )
}

export default Item
