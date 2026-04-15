import React, { useMemo, useState } from "react";
import {
  AdminButton,
  AdminCheckbox,
  AdminFileInput,
  AdminInput,
} from "../../../../components";

const parseValues = (values) =>
  String(values || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

const cartesianProduct = (groups) =>
  groups.reduce(
    (accumulator, group) =>
      accumulator.flatMap((existing) =>
        group.map((value) => [...existing, value])
      ),
    [[]]
  );

const normalizeSkuPart = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildAttributeKey = (attributes) =>
  Object.entries(attributes)
    .map(([name, value]) => `${name}:${value}`)
    .join("|");

const VariationBuilder = ({
  register,
  watch,
  optionFields,
  appendOption,
  removeOption,
  variationFields,
  replaceVariations,
  errors,
}) => {
  const [builderError, setBuilderError] = useState("");

  const baseSku = watch("base_sku");
  const options = watch("options") || [];
  const variations = watch("variations") || [];

  const totalVariationCount = useMemo(() => variations.length, [variations.length]);

  const generateVariations = () => {
    const normalizedOptions = options
      .map((option) => ({
        name: option?.name?.trim(),
        values: parseValues(option?.values),
      }))
      .filter((option) => option.name || option.values.length > 0);

    if (normalizedOptions.length === 0) {
      setBuilderError("Add at least one option with values before generating variations.");
      return;
    }

    if (normalizedOptions.some((option) => !option.name || option.values.length === 0)) {
      setBuilderError("Each option needs a name and at least one value.");
      return;
    }

    const optionNames = normalizedOptions.map((option) => option.name.toLowerCase());
    if (new Set(optionNames).size !== optionNames.length) {
      setBuilderError("Option names must be unique.");
      return;
    }

    const combinations = cartesianProduct(
      normalizedOptions.map((option) =>
        option.values.map((value) => ({
          optionName: option.name,
          value,
        }))
      )
    );

    if (combinations.length === 0) {
      setBuilderError("No variation combinations were generated.");
      return;
    }

    const existingVariationMap = new Map(
      variations.map((variation) => [variation.attribute_key, variation])
    );

    const generatedVariations = combinations.map((combination, index) => {
      const attributes = {};
      combination.forEach(({ optionName, value }) => {
        attributes[optionName] = value;
      });

      const attributeKey = buildAttributeKey(attributes);
      const existingVariation = existingVariationMap.get(attributeKey);
      const generatedSkuParts = combination.map(({ value }) => normalizeSkuPart(value));
      const generatedSkuBase = normalizeSkuPart(baseSku) || "SKU";

      return {
        attribute_key: attributeKey,
        title: combination
          .map(({ optionName, value }) => `${optionName}: ${value}`)
          .join(" / "),
        attributes,
        sku:
          existingVariation?.sku ||
          [generatedSkuBase, ...generatedSkuParts].filter(Boolean).join("-"),
        price: existingVariation?.price ?? "",
        compare_at_price: existingVariation?.compare_at_price ?? "",
        stock_quantity: existingVariation?.stock_quantity ?? 0,
        track_quantity: existingVariation?.track_quantity ?? true,
        is_active: existingVariation?.is_active ?? true,
        images: existingVariation?.images ?? null,
        sort_order: index,
      };
    });

    replaceVariations(generatedVariations);
    setBuilderError("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Variation Options
            </h3>
            <p className="text-sm text-slate-400">
              Define options like Size, Color, or Width, then generate every sellable variant.
            </p>
          </div>

          <AdminButton
            type="button"
            variant="secondary"
            text="+ Add Option"
            onClick={() => appendOption({ name: "", values: "" })}
          />
        </div>

        <div className="space-y-4">
          {optionFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-4 rounded-xl border border-slate-700 p-4 md:grid-cols-[1fr_2fr_auto]"
            >
              <AdminInput
                label="Option Name"
                placeholder="Size"
                {...register(`options.${index}.name`)}
                error={errors.options?.[index]?.name?.message}
              />

              <AdminInput
                label="Option Values"
                placeholder="S, M, L"
                {...register(`options.${index}.values`)}
                error={errors.options?.[index]?.values?.message}
              />

              <button
                type="button"
                className="mt-7 rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:border-red-400 hover:text-red-300"
                onClick={() => removeOption(index)}
                disabled={optionFields.length <= 1}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <AdminButton
            type="button"
            text="Generate Variations"
            onClick={generateVariations}
          />
          <p className="text-sm text-slate-400">
            Use comma-separated values. Example: `8, 9, 10` or `Black, White`.
          </p>
        </div>

        {builderError && (
          <p className="mt-3 text-sm text-red-400">{builderError}</p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Generated Variations
            </h3>
            <p className="text-sm text-slate-400">
              {totalVariationCount} variation{totalVariationCount === 1 ? "" : "s"} ready for pricing, stock, and media.
            </p>
          </div>
        </div>

        {variationFields.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">
            Add option values above, then generate variations to unlock per-variant price, compare price, stock, status, and image galleries.
          </div>
        ) : (
          <div className="space-y-5">
            {variationFields.map((field, index) => {
              const variation = variations[index] || field;

              return (
                <div
                  key={field.id}
                  className="rounded-2xl border border-slate-700 bg-[#0D1F3A] p-5"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-cyan-300">
                        {variation.title}
                      </p>
                      <p className="text-sm text-slate-400">
                        {Object.entries(variation.attributes || {})
                          .map(([name, value]) => `${name}: ${value}`)
                          .join(" | ")}
                      </p>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <AdminCheckbox
                        label="Track Inventory"
                        {...register(`variations.${index}.track_quantity`)}
                      />
                      <AdminCheckbox
                        label="Active Variant"
                        {...register(`variations.${index}.is_active`)}
                      />
                    </div>
                  </div>

                  <input
                    type="hidden"
                    {...register(`variations.${index}.title`)}
                  />
                  <input
                    type="hidden"
                    {...register(`variations.${index}.attribute_key`)}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <AdminInput
                      label="Variant SKU"
                      {...register(`variations.${index}.sku`, {
                        required: "Variant SKU is required",
                      })}
                      error={errors.variations?.[index]?.sku?.message}
                    />

                    <AdminInput
                      label="Price"
                      type="number"
                      step="0.01"
                      min="0"
                      {...register(`variations.${index}.price`, {
                        required: "Price is required",
                      })}
                      error={errors.variations?.[index]?.price?.message}
                    />

                    <AdminInput
                      label="Compare Price"
                      type="number"
                      step="0.01"
                      min="0"
                      {...register(`variations.${index}.compare_at_price`)}
                      error={errors.variations?.[index]?.compare_at_price?.message}
                    />

                    <AdminInput
                      label="Stock Quantity"
                      type="number"
                      min="0"
                      disabled={!variation.track_quantity}
                      {...register(`variations.${index}.stock_quantity`)}
                      error={errors.variations?.[index]?.stock_quantity?.message}
                    />

                    <div className="md:col-span-2 xl:col-span-4">
                      <AdminFileInput
                        label="Variant Images"
                        multiple
                        accept="image/*"
                        {...register(`variations.${index}.images`)}
                        error={errors.variations?.[index]?.images?.message}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VariationBuilder;
