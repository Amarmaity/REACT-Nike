import React from "react";
import { useForm } from "react-hook-form";
import {
  AdminInput,
  AdminButton,  
} from "../../../components";
const CategoryForm = ({
  onSubmit,
  defaultValues = {},
  loading = false,
  resetOnSuccess = true,
  submitText = "Save Category",
}) => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      ...defaultValues,
    },
  });

  const handleFormSubmit = async (data) => {
    const isCreated = await onSubmit(data);

    if (isCreated && resetOnSuccess) {
      reset({
        name: "",
        slug: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminInput
          label="Category Name"
          {...register("name", { required: "Category name is required" })}
          error={errors.name?.message}
        />

        <AdminInput
          label="Slug"
          placeholder="Leave blank to auto-generate"
          {...register("slug")}
          error={errors.slug?.message}
        />       
             
      </div>
      <AdminButton
        type="submit"
        text={loading ? "Saving..." : submitText}
        disabled={loading}
      />
    </form>
  );
};

export default CategoryForm;
