import { useState } from "react";

const VariationBuilder = () => {
  const [baseSku, setBaseSku] = useState("");

  const [attributes, setAttributes] = useState([
    { name: "Size", values: "" },
    { name: "Color", values: "" },
  ]);

  const [variations, setVariations] = useState([]);

  // Handle attribute input change
  const handleAttributeChange = (index, value) => {
    const updated = [...attributes];
    updated[index].values = value;
    setAttributes(updated);
  };

  // Handle variation field change (price, stock, sku)
  const handleVariationChange = (index, field, value) => {
    const updated = [...variations];
    updated[index][field] = value;
    setVariations(updated);
  };

  // Cartesian Product Generator
  const cartesianProduct = (arrays) => {
    return arrays.reduce(
      (a, b) => a.flatMap((d) => b.map((e) => [...d, e])),
      [[]]
    );
  };

  // Generate Variations
  const generateVariations = () => {
    if (!baseSku) {
      alert("Please enter Base SKU first");
      return;
    }

    const parsed = attributes.map((attr) =>
      attr.values
        .split(/[,|]/)
        .map((v) => v.trim())
        .filter(Boolean)
    );

    if (parsed.some((arr) => arr.length === 0)) {
      alert("Please enter values for all attributes");
      return;
    }

    const combinations = cartesianProduct(parsed);

    const formatted = combinations.map((combo) => {
      const variationObj = {};

      combo.forEach((val, i) => {
        variationObj[attributes[i].name] = val;
      });

      const sku =
        baseSku +
        "-" +
        combo
          .map((val) => val.toUpperCase().replace(/\s/g, ""))
          .join("-");

      return {
        attributes: variationObj,
        sku,
        price: "",
        stock: "",
        image: null,
      };
    });

    setVariations(formatted);
  };

  return (
    <div className="space-y-6">

      {/* Base SKU */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Base SKU
        </label>
        <input
          className="w-full bg-[#0F2A4D] border border-gray-600 rounded-xl px-4 py-2 text-white"
          value={baseSku}
          onChange={(e) => setBaseSku(e.target.value)}
          placeholder="TSHIRT"
        />
      </div>

      {/* Attribute Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {attributes.map((attr, index) => (
          <div key={index}>
            <label className="block text-sm text-gray-300 mb-2">
              {attr.name} (separate with , or |)
            </label>
            <input
              className="w-full bg-[#0F2A4D] border border-gray-600 rounded-xl px-4 py-2 text-white"
              value={attr.values}
              onChange={(e) =>
                handleAttributeChange(index, e.target.value)
              }
              placeholder="S, M, L"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={generateVariations}
        className="bg-[#33CCCC] text-black px-6 py-2 rounded-xl font-semibold"
      >
        Generate Variations
      </button>

      {/* Generated Variations */}
      {variations.length > 0 && (
        <div className="space-y-4 mt-6">
          {variations.map((variation, index) => (
            <div
              key={index}
              className="bg-[#0D1F3A] p-4 rounded-xl border border-slate-700"
            >
              <p className="text-[#33CCCC] font-semibold mb-3">
                {Object.entries(variation.attributes)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" | ")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* SKU */}
                <input
                  type="text"
                  value={variation.sku}
                  onChange={(e) =>
                    handleVariationChange(index, "sku", e.target.value)
                  }
                  placeholder="SKU"
                  className="bg-[#0F2A4D] border border-gray-600 rounded-lg px-3 py-2 text-white"
                />

                {/* Price */}
                <input
                  type="number"
                  value={variation.price}
                  onChange={(e) =>
                    handleVariationChange(index, "price", e.target.value)
                  }
                  placeholder="Price"
                  className="bg-[#0F2A4D] border border-gray-600 rounded-lg px-3 py-2 text-white"
                />

                {/* Stock */}
                <input
                  type="number"
                  value={variation.stock}
                  onChange={(e) =>
                    handleVariationChange(index, "stock", e.target.value)
                  }
                  placeholder="Stock"
                  className="bg-[#0F2A4D] border border-gray-600 rounded-lg px-3 py-2 text-white"
                />

                {/* Image */}
                <input
                  type="file"
                  onChange={(e) =>
                    handleVariationChange(index, "image", e.target.files[0])
                  }
                  className="bg-[#0F2A4D] border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariationBuilder;
