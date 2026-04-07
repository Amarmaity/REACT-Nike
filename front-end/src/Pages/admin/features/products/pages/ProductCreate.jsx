import React from 'react'
import ProductForm from '../components/ProductForm/ProductForm';
import { DashboardSection } from '../../../components';

const ProductCreate = () => {
    const handleCreate = (data) => {
        console.log("Create Product:", data);
    };
    return (
        <DashboardSection  >

            <ProductForm onSubmit={handleCreate} />

        </DashboardSection>
    );
};
export default ProductCreate