import { useForm } from "react-hook-form";
import { AdminInput, AdminSelect, AdminButton } from "../../../components";

const CategoryForm = ({ categories = [], onSubmit }) => {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      <AdminInput
        label="Category Name"
        {...register("name", { required: true })}
      />

      <AdminInput
        label="Slug"
        {...register("slug")}
      />

      <AdminSelect
        label="Parent Category"
        {...register("parentId")}
      >
        <option value="">None (Main Category)</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </AdminSelect>
      <AdminButton type="submit" text="Save Category" />
    </form>
  );
};

export default CategoryForm;
