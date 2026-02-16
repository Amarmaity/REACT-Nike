import React from 'react'
import { useParams } from 'react-router-dom'

const ProductEdit = () => {
  const { id } = useParams();
  if (!id) return <div>No Product ID Found</div>;
  console.log(id);

  return (
    <div>ProductEdit {id}</div>
  );
};
export default ProductEdit;
