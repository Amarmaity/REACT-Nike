import React from "react";
import { useForm } from "react-hook-form";
import {AdminButton,AdminSelect,AdminInput} from "../../adminUtils"

const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="w-full mx-auto  rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Create Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Product Name */}
        <AdminInput
          label="Product Name"
          type="text"
          placeholder="Enter product name"
          {...register("name", { required: "Product name is required" })}
          error={errors.name?.message}
        />

        {/* Slug */}
        <AdminInput
          label="Slug"
          type="text"
          placeholder="product-slug"
          {...register("slug")}
          error={errors.slug?.message}
        />

        {/* Category */}
        <AdminSelect
          label="Category"
          {...register("category", { required: "Category is required" })}
          error={errors.category?.message}
        >
          <option value="">Select Category</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </AdminSelect>


        {/* Pricing Section */}
        <div className="grid grid-cols-2 gap-4">
          <AdminInput
            label="Price"
            type="number"
            placeholder="80.00"
            {...register("price", { required: "Price is required" })}
            error={errors.price?.message}
          />

          <AdminInput
            label="Sale Price"
            type="number"
            placeholder="50.00"
            {...register("salePrice")}
            error={errors.salePrice?.message}
          />
        </div>

        {/* Status */}
        <AdminSelect
          label="Status"
          {...register("status")}
        >
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </AdminSelect>


        {/* Submit */}
        <div className="flex justify-end">
          <AdminButton text="Add Product" type="submit" variant="secondary" />

        </div>

      </form>
    </div>
  );
};

export default CreateProduct;
