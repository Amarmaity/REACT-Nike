import React, { useEffect, useState } from "react";
import { DashboardSection } from "../../../components";
import CategoryForm from "../components/CategoryForm";
import api from "../../../../../api/axios";

const CreateCategory = () => {
  const [listCategory, setListCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get("/master-category/");
        setListCategory(res.data);
      } catch (eror) {
        console.log("catwegor error", eror.response?.data);
      }
    };
    getData();
  }, []);

  const handleCreate = async (data) => {
    try {
      setLoading(true);
      await api.post("/master-category/", data);
      alert("Category created successfully");
      return true;
    } catch (error) {
      console.error("Category creation failed:", error);
      alert("Something went wrong");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardSection >
      <CategoryForm onSubmit={handleCreate} loading={loading} />
    </DashboardSection>
  );
};
export default CreateCategory;
