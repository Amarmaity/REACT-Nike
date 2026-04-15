import React, { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm/ProductForm";
import { DashboardSection } from "../../../components";
import api from "../../../../../api/axios";
import { buildProductFormData } from "../services/productFormUtils";

const getErrorMessage = (error) => {
  const responseMessage = error.response?.data?.message;

  if (typeof responseMessage === "string") {
    return responseMessage;
  }

  if (responseMessage && typeof responseMessage === "object") {
    return JSON.stringify(responseMessage);
  }

  return "Something went wrong while saving the product.";
};

const ProductCreate = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const loadProducts = async () => {
    try {
      const response = await api.get("/product/");
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("PRODUCT FETCH ERROR:", error.response?.data);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = async (data) => {
    try {
      setLoading(true);
      setFeedback({ type: "", message: "" });

      const formData = buildProductFormData(data);

      await api.post("/product/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await loadProducts();
      setFeedback({
        type: "success",
        message: "Product created successfully.",
      });
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      console.log("PRODUCT CREATE ERROR:", error.response?.data);
      setFeedback({
        type: "error",
        message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardSection title="Create Product">
        <ProductForm onSubmit={handleCreate} loading={loading} />
        {feedback.message && (
          <p
            className={`mt-4 text-sm ${
              feedback.type === "success" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {feedback.message}
          </p>
        )}
      </DashboardSection>

      <DashboardSection title="Product Data">
        <p className="text-sm text-gray-300">
          {products.length} products fetched successfully.
        </p>
      </DashboardSection>
    </>
  );
};

export default ProductCreate;
