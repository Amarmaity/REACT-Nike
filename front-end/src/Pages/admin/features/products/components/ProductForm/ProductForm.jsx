import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  AdminButton,
  AdminCheckbox,
  AdminFileInput,
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "../../../../components";
import VariationBuilder from "../VariableProduct/VariationBuilder";
import api from "../../../../../../api/axios";
import { DEFAULT_PRODUCT_OPTIONS } from "../../services/productFormUtils";

const DEFAULT_FORM_VALUES = {
  type: "simple",
  master_category: "",
  sub_category: "",
  name: "",
  short_description: "",
  description: "",
  slug: "",
  sku: "",
  base_sku: "",
  price: "",
  compare_at_price: "",
  stock_quantity: 0,
  track_quantity: true,
  featured: false,
  is_active: true,
  image: null,
  gallery_images: null,
  options: DEFAULT_PRODUCT_OPTIONS.map((option) => ({ ...option })),
  variations: [],
};

const parseOptionValues = (values) =>
  String(values || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

const toNullableNumber = (value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return Number(value);
};

const ProductForm = ({
  onSubmit,
  defaultValues = {},
  loading = false,
  resetOnSuccess = true,
  submitText = "Save Product",
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [masterCategories, setMasterCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);
  const previousMasterCategoryRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      ...defaultValues,
    },
  });

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: "options",
  });

  const {
    fields: variationFields,
    replace: replaceVariations,
  } = useFieldArray({
    control,
    name: "variations",
  });

  const productType = watch("type");
  const selectedMasterCategory = watch("master_category");
  const trackQuantity = watch("track_quantity");

  const tabs = useMemo(
    () => [
      "general",
      "pricing",
      "media",
      "inventory",
      ...(productType === "variable" ? ["variations"] : []),
    ],
    [productType]
  );

  useEffect(() => {
    const loadMasterCategories = async () => {
      try {
        setCategoryLoading(true);
        const response = await api.get("/master-category/");
        setMasterCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.log("MASTER CATEGORY ERROR:", error.response?.data);
        setMasterCategories([]);
      } finally {
        setCategoryLoading(false);
      }
    };

    loadMasterCategories();
  }, []);

  useEffect(() => {
    const loadSubCategories = async () => {
      if (!selectedMasterCategory) {
        setSubCategories([]);
        setValue("sub_category", "");
        previousMasterCategoryRef.current = selectedMasterCategory;
        return;
      }

      try {
        setSubCategoryLoading(true);

        if (
          previousMasterCategoryRef.current !== null &&
          previousMasterCategoryRef.current !== selectedMasterCategory
        ) {
          setValue("sub_category", "");
        }

        const response = await api.get(
          `/sub-category/?master_category=${selectedMasterCategory}`
        );
        setSubCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.log("SUB CATEGORY ERROR:", error.response?.data);
        setSubCategories([]);
      } finally {
        previousMasterCategoryRef.current = selectedMasterCategory;
        setSubCategoryLoading(false);
      }
    };

    loadSubCategories();
  }, [selectedMasterCategory, setValue]);

  useEffect(() => {
    if (productType !== "variable" && activeTab === "variations") {
      setActiveTab("general");
      setValue("variations", []);
    }

    if (productType === "simple") {
      setValue("base_sku", "");
    } else {
      setValue("sku", "");
      setValue("price", "");
      setValue("compare_at_price", "");
      setValue("stock_quantity", 0);
    }
  }, [productType, activeTab, setValue]);

  const handleFormSubmit = async (data) => {
    const normalizedOptions =
      productType === "variable"
        ? (data.options || [])
            .map((option) => ({
              name: option.name?.trim(),
              values: parseOptionValues(option.values),
            }))
            .filter((option) => option.name && option.values.length > 0)
        : [];

    const normalizedVariations =
      productType === "variable"
        ? (data.variations || []).map((variation) => ({
            title: variation.title,
            sku: variation.sku?.trim(),
            attributes: variation.attributes || {},
            price: toNullableNumber(variation.price),
            compare_at_price: toNullableNumber(variation.compare_at_price),
            stock_quantity: variation.track_quantity
              ? Number(variation.stock_quantity || 0)
              : 0,
            track_quantity: Boolean(variation.track_quantity),
            is_active: Boolean(variation.is_active),
            images: variation.images,
          }))
        : [];

    const payload = {
      type: data.type,
      sub_category: data.sub_category,
      name: data.name?.trim(),
      short_description: data.short_description?.trim(),
      description: data.description?.trim(),
      slug: data.slug?.trim(),
      featured: Boolean(data.featured),
      is_active: Boolean(data.is_active),
      image: data.image,
      gallery_images: data.gallery_images,
      ...(productType === "simple"
        ? {
            sku: data.sku?.trim(),
            price: toNullableNumber(data.price),
            compare_at_price: toNullableNumber(data.compare_at_price),
            track_quantity: Boolean(data.track_quantity),
            stock_quantity: data.track_quantity
              ? Number(data.stock_quantity || 0)
              : 0,
          }
        : {
            base_sku: data.base_sku?.trim(),
            options: normalizedOptions,
            variations: normalizedVariations,
          }),
    };

    const isCreated = await onSubmit(payload);

    if (isCreated && resetOnSuccess) {
      reset({
        ...DEFAULT_FORM_VALUES,
        master_category: data.master_category,
      });
      setActiveTab("general");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      encType="multipart/form-data"
      className="space-y-6"
    >
      <div className="flex flex-wrap gap-3 border-b border-slate-700 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
              activeTab === tab
                ? "bg-cyan-400 text-slate-950"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AdminInput
            label="Product Name"
            {...register("name", { required: "Product name is required" })}
            error={errors.name?.message}
          />

          <AdminSelect
            label="Product Type"
            {...register("type")}
            options={[
              { label: "Simple Product", value: "simple" },
              { label: "Variable Product", value: "variable" },
            ]}
          />

          <AdminSelect
            label="Parent Category"
            {...register("master_category", {
              required: "Parent category is required",
            })}
            error={errors.master_category?.message}
            disabled={categoryLoading}
            options={masterCategories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />

          <AdminSelect
            label="Subcategory"
            {...register("sub_category", {
              required: "Subcategory is required",
            })}
            error={errors.sub_category?.message}
            disabled={!selectedMasterCategory || subCategoryLoading}
            options={subCategories.map((subCategory) => ({
              label: subCategory.name,
              value: subCategory.id,
            }))}
          />

          {selectedMasterCategory &&
            !subCategoryLoading &&
            subCategories.length === 0 && (
              <p className="text-sm text-amber-300 md:col-span-2">
                No subcategories found for this parent category yet. Create one first, then come back to product creation.
              </p>
            )}

          <AdminInput
            label="Slug"
            placeholder="Leave blank to auto-generate"
            {...register("slug")}
            error={errors.slug?.message}
          />

          <AdminInput
            label="Short Description"
            placeholder="Quick summary for cards or previews"
            {...register("short_description")}
            error={errors.short_description?.message}
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

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-900/60 p-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminCheckbox label="Featured Product" {...register("featured")} />
              <AdminCheckbox label="Active Product" {...register("is_active")} />
            </div>
            <p className="text-sm text-slate-400">
              Pick the parent category first, then the subcategory list is filtered automatically.
            </p>
          </div>
        </div>
      )}

      {activeTab === "pricing" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {productType === "simple" ? (
            <>
              <AdminInput
                label="SKU"
                {...register("sku", { required: "SKU is required" })}
                error={errors.sku?.message}
              />

              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-400">
                For simple products we save one SKU and one price directly on the product.
              </div>

              <AdminInput
                label="Price"
                type="number"
                step="0.01"
                min="0"
                {...register("price", { required: "Price is required" })}
                error={errors.price?.message}
              />

              <AdminInput
                label="Compare Price"
                type="number"
                step="0.01"
                min="0"
                {...register("compare_at_price")}
                error={errors.compare_at_price?.message}
              />
            </>
          ) : (
            <>
              <AdminInput
                label="Base SKU"
                placeholder="NIKE-AIRMAX"
                {...register("base_sku")}
                error={errors.base_sku?.message}
              />

              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-400 md:col-span-1">
                Variation prices and compare prices are managed per variant in the variations tab.
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "media" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AdminFileInput
            label="Primary Image"
            accept="image/*"
            {...register("image")}
            error={errors.image?.message}
          />

          <AdminFileInput
            label="Gallery Images"
            multiple
            accept="image/*"
            {...register("gallery_images")}
            error={errors.gallery_images?.message}
          />

          <p className="text-sm text-slate-400 md:col-span-2">
            Use one strong primary image for listings, then add supporting gallery images for product detail pages.
          </p>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {productType === "simple" ? (
            <>
              <AdminCheckbox
                label="Track Inventory"
                {...register("track_quantity")}
              />

              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-400">
                Toggle inventory tracking off if this item is always available or managed elsewhere.
              </div>

              <AdminInput
                label="Stock Quantity"
                type="number"
                min="0"
                disabled={!trackQuantity}
                {...register("stock_quantity")}
                error={errors.stock_quantity?.message}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-400 md:col-span-2">
              Variable product inventory is controlled per variation, including SKU, stock, status, and images.
            </div>
          )}
        </div>
      )}

      {activeTab === "variations" && productType === "variable" && (
        <VariationBuilder
          register={register}
          watch={watch}
          optionFields={optionFields}
          appendOption={appendOption}
          removeOption={removeOption}
          variationFields={variationFields}
          replaceVariations={replaceVariations}
          errors={errors}
        />
      )}

      <AdminButton
        type="submit"
        text={loading ? "Saving Product..." : submitText}
        disabled={loading || categoryLoading || subCategoryLoading}
      />
    </form>
  );
};

export default ProductForm;
