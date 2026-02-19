import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  AdminInput,
  AdminButton,
  AdminSelect,
  AdminTextarea,
  AdminCheckbox,
} from "../../../../components";
import VariationBuilder from "../VariableProduct/VariationBuilder";

const ProductForm = ({ onSubmit, defaultValues = {} }) => {
  const [activeTab, setActiveTab] = useState("general");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "simple", // important default
      variations: [],
      ...defaultValues,
    },
  });

  const productType = watch("type");

  // Dynamic Tabs
  const tabs = [
    "general",
    "inventory",
    "images",
    ...(productType === "variable" ? ["variations"] : []),
  ];

  // Protect active tab when switching type
  useEffect(() => {
    if (productType !== "variable" && activeTab === "variations") {
      setActiveTab("general");
      setValue("variations", []); // clear variations
    }
  }, [productType, activeTab, setValue]);

  // Variations Field Array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 capitalize text-sm font-medium transition 
            ${activeTab === tab
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-slate-400 hover:text-white"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* GENERAL TAB */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <AdminInput
            label="Product Name"
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
          />

          <AdminSelect
            label="Product Type"
            {...register("type")}
            options={[
              { label: "Simple", value: "simple" },
              { label: "Variable", value: "variable" },
            ]}
          />

          {/* Make Description full width */}
          <div className="md:col-span-2">
            <AdminTextarea
              label="Description"
              {...register("description")}
            />
          </div>

          {productType === "simple" && (
            <>
              <AdminInput
                label="Regular Price"
                type="number"
                {...register("regularPrice")}
              />

              <AdminInput
                label="Sale Price"
                type="number"
                {...register("salePrice")}
              />
            </>
          )}

          <AdminSelect
            label="Category"
            {...register("category", { required: "Category required" })}
            options={[
              { label: "Men", value: "men" },
              { label: "Women", value: "women" },
              { label: "Kids", value: "kids" },
            ]}
            error={errors.category?.message}
          />

          <div className="flex items-center mt-6">
            <AdminCheckbox
              label="Featured Product"
              {...register("featured")}
            />
          </div>

        </div>
      )}


      {/* INVENTORY TAB */}
      {activeTab === "inventory" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <AdminInput label="SKU" {...register("sku")} />

          <AdminSelect
            label="Stock Status"
            {...register("stockStatus")}
            options={[
              { label: "In Stock", value: "in_stock" },
              { label: "Out of Stock", value: "out_of_stock" },
            ]}
          />

          <AdminCheckbox
            label="Manage Stock?"
            {...register("manageStock")}
          />

          <AdminInput
            label="Stock Quantity"
            type="number"
            {...register("stock")}
          />

        </div>
      )}


      {/* IMAGES TAB */}
      {activeTab === "images" && (
        <div className="space-y-4">
          <AdminInput label="Thumbnail URL" {...register("thumbnail")} />
          <AdminTextarea
            label="Gallery URLs (comma separated)"
            {...register("gallery")}
          />
        </div>
      )}

      {/* VARIATIONS TAB */}
      {activeTab === "variations" && productType === "variable" && (
        <VariationBuilder/>
      )}


      <AdminButton type="submit" text="Save Product" />
    </form>
  );
};

export default ProductForm;
