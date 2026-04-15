import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm/ProductForm";
import { DashboardSection } from "../../../components";
import api from "../../../../../api/axios";
import {
  buildProductFormData,
  mapProductToFormValues,
} from "../services/productFormUtils";

const getErrorMessage = (error) => {
  const responseMessage = error.response?.data?.message;

  if (typeof responseMessage === "string") {
    return responseMessage;
  }

  if (responseMessage && typeof responseMessage === "object") {
    return JSON.stringify(responseMessage);
  }

  return "Something went wrong while updating the product.";
};

const ProductEditPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [defaultValues, setDefaultValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setPageLoading(false);
        return;
      }

      try {
        setPageLoading(true);
        const response = await api.get(`/product/${id}/`);
        setProduct(response.data);
        setDefaultValues(mapProductToFormValues(response.data));
      } catch (error) {
        console.log("PRODUCT DETAIL ERROR:", error.response?.data);
        setFeedback({
          type: "error",
          message: "Unable to load this product for editing.",
        });
      } finally {
        setPageLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      setLoading(true);
      setFeedback({ type: "", message: "" });

      const formData = buildProductFormData(data);
      const response = await api.patch(`/product/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProduct(response.data.data);
      setDefaultValues(mapProductToFormValues(response.data.data));
      setFeedback({
        type: "success",
        message: "Product updated successfully.",
      });
      return true;
    } catch (error) {
      console.log("PRODUCT UPDATE ERROR:", error.response?.data);
      setFeedback({
        type: "error",
        message: getErrorMessage(error),
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <DashboardSection title="Edit Product">
        <p className="text-sm text-gray-300">Loading product details...</p>
      </DashboardSection>
    );
  }

  if (!product || !defaultValues) {
    return (
      <DashboardSection title="Edit Product">
        <p className="text-sm text-red-400">
          {feedback.message || "Product not found."}
        </p>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection title={`Edit Product: ${product.name}`}>
      <ProductForm
        key={`${product.id}-${product.updated_at}`}
        onSubmit={handleUpdate}
        defaultValues={defaultValues}
        loading={loading}
        resetOnSuccess={false}
        submitText="Update Product"
      />

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
  );
};

export default ProductEditPage;
