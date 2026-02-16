import React from "react";
import { useForm } from "react-hook-form";
import { AdminInput , AdminButton, AdminSelect } from "../../../../components";

const ProductForm = ({ onSubmit, defaultValues = {} }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      <AdminInput
        label="Product Name"
        {...register("name", { required: "Name is required" })}
        error={errors.name?.message}
      />
      <AdminInput
        label="Price"
        type="number"
        {...register("price", { required: "Price is required" })}
        error={errors.price?.message}
      />

      <AdminSelect
        label="Category"
        {...register("category", { required: "Category is required" })}
        options={[
          { label: "Electronics", value: "electronics" },
          { label: "Clothing", value: "clothing" },
        ]}
        error={errors.category?.message}
      />
      <AdminButton variant="secondary"  type="submit" text={"Save Product"} />
        
      
    </form>
  );
};

export default ProductForm;
