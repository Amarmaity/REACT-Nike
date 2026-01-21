import { ChevronRight } from 'lucide-react';
import React from 'react'

const Breadcrum = (props) => {
    const {product} = props;
   return (
    <div className='flex items-center md:gap-2 gap-1 px-6 md:px-0 text-gray-400 font-semibold md:text-lg capitalize mt-4 text-sm'>
      HOME <ChevronRight/> SHOP <ChevronRight/> {product.category} <ChevronRight/> {product.name}
    </div>
  )
}

export default Breadcrum
