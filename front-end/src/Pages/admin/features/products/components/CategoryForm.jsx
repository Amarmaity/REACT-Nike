import React from "react";
import { useForm } from "react-hook-form";
import {
  AdminInput,
  AdminButton,
  AdminSelect,
  AdminTextarea,
  AdminCheckbox,
} from "../../../components";


const CategoryForm = ({ onSubmit, defaultValues = {}, categories = [] }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parent: "",
      image: "",
      featured: false,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <AdminInput
          label="Category Name"
          {...register("name", { required: "Category name is required" })}
          error={errors.name?.message}
        />

        <AdminInput
          label="Slug"
          {...register("slug", { required: "Slug is required" })}
          error={errors.slug?.message}
        />

        <AdminSelect
          label="Parent Category"
          {...register("parent")}
          options={[
            { label: "None", value: "" },
            ...categories.map((cat) => ({
              label: cat.name,
              value: cat._id,
            })),
          ]}
        />

        <AdminInput
          label="Category Image URL"
          {...register("image")}
        />

        <div className="md:col-span-2">
          <AdminTextarea
            label="Description"
            {...register("description")}
          />
        </div>

        <div className="flex items-center mt-4">
          <AdminCheckbox
            label="Featured Category"
            {...register("featured")}
          />
        </div>

      </div>
      <AdminButton type="submit" text="Save Category" />
    </form>
  );
};

export default CategoryForm;