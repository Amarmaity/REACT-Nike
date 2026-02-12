import React from 'react'
import CreateProduct from './CreateProduct'
import DashboardSection from "../DashboardSection"

const ProductOverview = () => {
  return (
    <>
      <div>ProductOverview</div>
      <DashboardSection >
        <CreateProduct />
      </DashboardSection>
    </>
  )
}

export default ProductOverview