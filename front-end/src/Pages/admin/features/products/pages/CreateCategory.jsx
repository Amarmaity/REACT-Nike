import React, { useEffect, useState } from "react";
import { DashboardSection } from "../../../components";
import CategoryForm from "../components/CategoryForm";
import api from "../../../../../api/axios";




const CreateCategory = () => {
  const [listCategory, setListCategory] = useState([])
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get("/create-master-category/")
        setListCategory(res.data)
      } catch (eror) {
        console.log("catwegor error",eror.response?.data)

      }

    }
    getData();
  }, [])
  console.log(listCategory)

  const handleCreate = async (data) => {
    try {
      const res = await api.post("/create-master-category/", data);
      console.log("Create Category:", res.data);
      alert("Category created successfully");

    } catch (error) {
      console.error("Category creation failed:", error);
      alert("Something went wrong");
    }
  };

  return (
    <DashboardSection title="Create Category">
      <CategoryForm onSubmit={handleCreate} />
    </DashboardSection>
  );
};
export default CreateCategory;