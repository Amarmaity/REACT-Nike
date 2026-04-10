import React, { useEffect, useState } from "react";
import { DashboardSection } from "../../../components";
import CategoryForm from "../components/CategoryForm";
import api from "../../../../../api/axios";




const CreateCategory = () => {
  const [listCategory, setListCategory] = useState([])
  const[defaultValue, setDefaultValue] = useState([])
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get("/master-category/")
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
      const res = await api.post("/master-category/", data);
      console.log("Create Category:", res.data);
      alert("Category created successfully");
      setDefaultValue[0]

    } catch (error) {
      console.error("Category creation failed:", error);
      alert("Something went wrong");
    }
  };

  return (
    <DashboardSection >
      <CategoryForm onSubmit={handleCreate} defaultValues={defaultValue} />
    </DashboardSection>
  );
};
export default CreateCategory;