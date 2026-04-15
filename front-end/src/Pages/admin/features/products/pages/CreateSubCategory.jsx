import React, { useEffect, useState } from "react";
import { DashboardSection } from "../../../components";
import SubCategoryForm from "../components/SubCategoryForm";
import api from "../../../../../api/axios";

const CreateSubCategory = () => {
  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState([]);

  const loadSubCategories = async () => {
    try {
      const res = await api.get("/sub-category/");
      setSubCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("BACKEND ERROR:", error.response?.data);
      setSubCategories([]);
    }
  };

  useEffect(() => {
    loadSubCategories();
  }, []);
  console.log(subCategories)

  const handleCreate = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("master_category", data.master_category);

      if (data.slug?.trim()) {
        formData.append("slug", data.slug.trim());
      }

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      await api.post("/sub-category/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await loadSubCategories();
      alert("Subcategory created successfully");
      return true;
    } catch (error) {
      console.log("BACKEND ERROR:", error.response?.data);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardSection title="Create Subcategory">
        <SubCategoryForm onSubmit={handleCreate} loading={loading} />
      </DashboardSection>

      <DashboardSection title="Subcategory Data">
        <p className="text-sm text-gray-300">
          {subCategories.length} subcategories fetched successfully.
        </p>
      </DashboardSection>
    </>
  );
};

export default CreateSubCategory;
