import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    AdminInput,
    AdminButton,
    AdminSelect,
    AdminTextarea,
    AdminFileInput,
} from "../../../components";
import api from "../../../../../api/axios";

const SubCategoryForm = ({
    onSubmit,
    defaultValues = {},
    loading = false,
    resetOnSuccess = true,
    submitText = "Save Subcategory",
}) => {
    const [parentCategory, setParentCategory] = useState([]);
    const [categoryLoading, setCategoryLoading] = useState(false);

    const buildFormDefaults = (values = {}) => {
        const sanitizedValues = { ...values };
        delete sanitizedValues.image;

        return {
            name: "",
            description: "",
            slug: "",
            image: null,
            master_category: "",
            ...sanitizedValues,
        };
    };

    useEffect(() => {
        const getData = async () => {
            try {
                setCategoryLoading(true);
                const res = await api.get("/master-category/");
                setParentCategory(res.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setCategoryLoading(false);
            }
        };

        getData();
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: buildFormDefaults(defaultValues),
    });

    useEffect(() => {
        reset(buildFormDefaults(defaultValues));
    }, [
        defaultValues.name,
        defaultValues.description,
        defaultValues.slug,
        defaultValues.master_category,
        reset,
    ]);

    const handleFormSubmit = async (data) => {
        const isCreated = await onSubmit(data);

        if (isCreated && resetOnSuccess) {
            reset(buildFormDefaults());
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            encType="multipart/form-data"
            className="space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminInput
                    label="Subcategory Name"
                    {...register("name", { required: "Subcategory name is required" })}
                    error={errors.name?.message}
                />

                <AdminSelect
                    label="Parent Category"
                    {...register("master_category", {
                        required: "Parent category is required",
                    })}
                    error={errors.master_category?.message}
                    disabled={categoryLoading || parentCategory.length === 0}
                    options={parentCategory.map((cat) => ({
                        label: cat.name,
                        value: String(cat.id),
                    }))}
                />

                <AdminInput
                    label="Slug"
                    placeholder="Leave blank to auto-generate"
                    {...register("slug")}
                    error={errors.slug?.message}
                />

                <AdminFileInput
                    label="Subcategory Image"
                    accept="image/*"
                    {...register("image")}
                    error={errors.image?.message}
                />

                <div className="md:col-span-2">
                    <AdminTextarea
                        label="Description"
                        {...register("description", {
                            required: "Description is required",
                        })}
                        error={errors.description?.message}
                    />
                </div>
            </div>

            {parentCategory.length === 0 && !categoryLoading && (
                <p className="text-sm text-amber-300">
                    Add a parent category first before creating a subcategory.
                </p>
            )}

            <AdminButton
                type="submit"
                text={loading ? "Saving..." : submitText}
                disabled={loading || categoryLoading || parentCategory.length === 0}
            />
        </form>
    );
};

export default SubCategoryForm;
