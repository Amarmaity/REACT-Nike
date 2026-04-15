import React, { useEffect, useMemo, useState } from "react";
import { DashboardSection } from "../../../components";
import api from "../../../../../api/axios";
import FilterBar from "../components/FilterBar";
import CategoryTable from "../components/categoryTable/CategoryTable";
import CategoryForm from "../components/CategoryForm";
import CategoryDetailsModal from "../components/CategoryDetailsModal";
import SubCategoryForm from "../components/SubCategoryForm";
import SubCategoryDetailsModal from "../components/SubCategoryDetailsModal";
import SubCategoryTable from "../components/subCategoryTable/SubCategoryTable";
import AdminPagination from "../../../components/AdminPagination";

const ITEMS_PER_PAGE = 6;

const TAB_CONFIG = {
  master: {
    title: "Master Categories",
    loadingLabel: "Loading categories...",
    resultsLabel: "categories found",
  },
  sub: {
    title: "Subcategories",
    loadingLabel: "Loading subcategories...",
    resultsLabel: "subcategories found",
  },
};

const ManageCategoryPage = () => {
  const [activeTab, setActiveTab] = useState("master");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [search, setSearch] = useState({
    master: "",
    sub: "",
  });
  const [filters, setFilters] = useState({
    master: {
      status: "",
    },
    sub: {
      status: "",
      master_category: "",
    },
  });
  const [dateRange, setDateRange] = useState({
    master: {
      start: "",
      end: "",
    },
    sub: {
      start: "",
      end: "",
    },
  });
  const [page, setPage] = useState({
    master: 1,
    sub: 1,
  });
  const [loading, setLoading] = useState({
    master: true,
    sub: true,
  });
  const [feedback, setFeedback] = useState({
    master: "",
    sub: "",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [editLoading, setEditLoading] = useState({
    master: false,
    sub: false,
  });

  const loadCategories = async () => {
    try {
      setLoading((prev) => ({ ...prev, master: true }));
      setFeedback((prev) => ({ ...prev, master: "" }));
      const response = await api.get("/master-category/");
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("CATEGORY LIST ERROR:", error.response?.data);
      setCategories([]);
      setFeedback((prev) => ({
        ...prev,
        master: "Unable to load categories right now.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, master: false }));
    }
  };

  const loadSubCategories = async () => {
    try {
      setLoading((prev) => ({ ...prev, sub: true }));
      setFeedback((prev) => ({ ...prev, sub: "" }));
      const response = await api.get("/sub-category/");
      setSubCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("SUBCATEGORY LIST ERROR:", error.response?.data);
      setSubCategories([]);
      setFeedback((prev) => ({
        ...prev,
        sub: "Unable to load subcategories right now.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, sub: false }));
    }
  };

  useEffect(() => {
    loadCategories();
    loadSubCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const createdAt = new Date(category.created_at);
      const searchableText = [category.name, category.slug]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = search.master
        ? searchableText.includes(search.master.toLowerCase())
        : true;

      const matchesStatus = filters.master.status
        ? (category.is_active ? "Active" : "Inactive") === filters.master.status
        : true;

      const matchesStart = dateRange.master.start
        ? createdAt >= new Date(dateRange.master.start)
        : true;

      const matchesEnd = dateRange.master.end
        ? createdAt <= new Date(`${dateRange.master.end}T23:59:59`)
        : true;

      return matchesSearch && matchesStatus && matchesStart && matchesEnd;
    });
  }, [
    categories,
    search.master,
    filters.master.status,
    dateRange.master.start,
    dateRange.master.end,
  ]);

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter((subCategory) => {
      const createdAt = new Date(subCategory.created_at);
      const searchableText = [
        subCategory.name,
        subCategory.slug,
        subCategory.description,
        subCategory.master_category_details?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = search.sub
        ? searchableText.includes(search.sub.toLowerCase())
        : true;

      const matchesStatus = filters.sub.status
        ? (subCategory.is_active ? "Active" : "Inactive") === filters.sub.status
        : true;

      const matchesParent = filters.sub.master_category
        ? String(subCategory.master_category) === filters.sub.master_category
        : true;

      const matchesStart = dateRange.sub.start
        ? createdAt >= new Date(dateRange.sub.start)
        : true;

      const matchesEnd = dateRange.sub.end
        ? createdAt <= new Date(`${dateRange.sub.end}T23:59:59`)
        : true;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesParent &&
        matchesStart &&
        matchesEnd
      );
    });
  }, [
    subCategories,
    search.sub,
    filters.sub.status,
    filters.sub.master_category,
    dateRange.sub.start,
    dateRange.sub.end,
  ]);

  const totalPages = {
    master: Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE)),
    sub: Math.max(1, Math.ceil(filteredSubCategories.length / ITEMS_PER_PAGE)),
  };

  const paginatedCategories = useMemo(() => {
    const start = (page.master - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(start, start + ITEMS_PER_PAGE);
  }, [page.master, filteredCategories]);

  const paginatedSubCategories = useMemo(() => {
    const start = (page.sub - 1) * ITEMS_PER_PAGE;
    return filteredSubCategories.slice(start, start + ITEMS_PER_PAGE);
  }, [page.sub, filteredSubCategories]);

  useEffect(() => {
    setPage((prev) => ({ ...prev, master: 1 }));
  }, [
    search.master,
    filters.master.status,
    dateRange.master.start,
    dateRange.master.end,
  ]);

  useEffect(() => {
    setPage((prev) => ({ ...prev, sub: 1 }));
  }, [
    search.sub,
    filters.sub.status,
    filters.sub.master_category,
    dateRange.sub.start,
    dateRange.sub.end,
  ]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [name]: value,
      },
    }));
  };

  const handleDateChange = (type, value) => {
    setDateRange((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [type]: value,
      },
    }));
  };

  const handleClear = () => {
    setSearch((prev) => ({ ...prev, [activeTab]: "" }));

    setFilters((prev) => ({
      ...prev,
      [activeTab]:
        activeTab === "master"
          ? { status: "" }
          : { status: "", master_category: "" },
    }));

    setDateRange((prev) => ({
      ...prev,
      [activeTab]: { start: "", end: "" },
    }));
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmed = window.confirm(
      "Delete this category? Related subcategories and products may also be affected."
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/master-category/${categoryId}/`);
      setCategories((prev) => prev.filter((category) => category.id !== categoryId));
      setSubCategories((prev) =>
        prev.filter((subCategory) => subCategory.master_category !== categoryId)
      );
      setSelectedCategory((prev) => (prev?.id === categoryId ? null : prev));
      setEditingCategory((prev) => (prev?.id === categoryId ? null : prev));
      setSelectedSubCategory((prev) =>
        prev?.master_category === categoryId ? null : prev
      );
      setEditingSubCategory((prev) =>
        prev?.master_category === categoryId ? null : prev
      );
      setFeedback((prev) => ({
        ...prev,
        master: "Category deleted successfully.",
        sub: "Related subcategories were removed with the parent category.",
      }));
    } catch (error) {
      console.log("CATEGORY DELETE ERROR:", error.response?.data);
      setFeedback((prev) => ({
        ...prev,
        master: "Unable to delete this category.",
      }));
    }
  };

  const handleDeleteSubCategory = async (subCategoryId) => {
    const confirmed = window.confirm(
      "Delete this subcategory? Related products will also be affected."
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/sub-category/${subCategoryId}/`);
      setSubCategories((prev) =>
        prev.filter((subCategory) => subCategory.id !== subCategoryId)
      );
      setSelectedSubCategory((prev) =>
        prev?.id === subCategoryId ? null : prev
      );
      setEditingSubCategory((prev) =>
        prev?.id === subCategoryId ? null : prev
      );
      setFeedback((prev) => ({
        ...prev,
        sub: "Subcategory deleted successfully.",
      }));
    } catch (error) {
      console.log("SUBCATEGORY DELETE ERROR:", error.response?.data);
      setFeedback((prev) => ({
        ...prev,
        sub: "Unable to delete this subcategory.",
      }));
    }
  };

  const handleUpdateCategory = async (data) => {
    if (!editingCategory) {
      return false;
    }

    try {
      setEditLoading((prev) => ({ ...prev, master: true }));
      setFeedback((prev) => ({ ...prev, master: "" }));

      const response = await api.patch(
        `/master-category/${editingCategory.id}/`,
        data
      );
      const updatedCategory = response.data.data;

      setCategories((prev) =>
        prev.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        )
      );
      setSelectedCategory((prev) =>
        prev?.id === updatedCategory.id ? updatedCategory : prev
      );
      setSubCategories((prev) =>
        prev.map((subCategory) =>
          subCategory.master_category === updatedCategory.id
            ? {
                ...subCategory,
                master_category_details: updatedCategory,
              }
            : subCategory
        )
      );
      setEditingCategory(null);
      setFeedback((prev) => ({
        ...prev,
        master: "Category updated successfully.",
      }));
      return true;
    } catch (error) {
      console.log("CATEGORY UPDATE ERROR:", error.response?.data);
      setFeedback((prev) => ({
        ...prev,
        master: "Unable to update this category.",
      }));
      return false;
    } finally {
      setEditLoading((prev) => ({ ...prev, master: false }));
    }
  };

  const handleUpdateSubCategory = async (data) => {
    if (!editingSubCategory) {
      return false;
    }

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

    try {
      setEditLoading((prev) => ({ ...prev, sub: true }));
      setFeedback((prev) => ({ ...prev, sub: "" }));

      const response = await api.patch(
        `/sub-category/${editingSubCategory.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updatedSubCategory = response.data.data;

      setSubCategories((prev) =>
        prev.map((subCategory) =>
          subCategory.id === updatedSubCategory.id ? updatedSubCategory : subCategory
        )
      );
      setSelectedSubCategory((prev) =>
        prev?.id === updatedSubCategory.id ? updatedSubCategory : prev
      );
      setEditingSubCategory(null);
      setFeedback((prev) => ({
        ...prev,
        sub: "Subcategory updated successfully.",
      }));
      return true;
    } catch (error) {
      console.log("SUBCATEGORY UPDATE ERROR:", error.response?.data);
      setFeedback((prev) => ({
        ...prev,
        sub: "Unable to update this subcategory.",
      }));
      return false;
    } finally {
      setEditLoading((prev) => ({ ...prev, sub: false }));
    }
  };

  const masterCategoryFilterOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.name,
        value: String(category.id),
      })),
    [categories]
  );

  const activeFilters =
    activeTab === "master"
      ? [
          {
            name: "status",
            label: "Status",
            options: ["Active", "Inactive"],
          },
        ]
      : [
          {
            name: "status",
            label: "Status",
            options: ["Active", "Inactive"],
          },
          {
            name: "master_category",
            label: "Parent Category",
            options: masterCategoryFilterOptions,
          },
        ];

  const activeResultsCount =
    activeTab === "master"
      ? filteredCategories.length
      : filteredSubCategories.length;

  return (
    <DashboardSection title="Category Management">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          {Object.entries(TAB_CONFIG).map(([key, tab]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                activeTab === key
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-white"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <FilterBar
          searchValue={search[activeTab]}
          onSearchChange={(value) =>
            setSearch((prev) => ({
              ...prev,
              [activeTab]: value,
            }))
          }
          filters={activeFilters}
          filterValues={filters[activeTab]}
          onFilterChange={handleFilterChange}
          dateRange={dateRange[activeTab]}
          onDateChange={handleDateChange}
          onClear={handleClear}
        />

        <div className="flex items-center justify-between text-sm text-gray-400">
          <p>
            {loading[activeTab]
              ? TAB_CONFIG[activeTab].loadingLabel
              : `${activeResultsCount} ${TAB_CONFIG[activeTab].resultsLabel}`}
          </p>
          {feedback[activeTab] && <p>{feedback[activeTab]}</p>}
        </div>

        {activeTab === "master" ? (
          <CategoryTable
            categories={paginatedCategories}
            onView={setSelectedCategory}
            onEdit={setEditingCategory}
            onDelete={handleDeleteCategory}
          />
        ) : (
          <SubCategoryTable
            subCategories={paginatedSubCategories}
            onView={setSelectedSubCategory}
            onEdit={setEditingSubCategory}
            onDelete={handleDeleteSubCategory}
          />
        )}

        <AdminPagination
          totalPages={totalPages[activeTab]}
          currentPage={page[activeTab]}
          onPageChange={(nextPage) =>
            setPage((prev) => ({
              ...prev,
              [activeTab]: nextPage,
            }))
          }
        />
      </div>

      <CategoryDetailsModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />

      <SubCategoryDetailsModal
        subCategory={selectedSubCategory}
        onClose={() => setSelectedSubCategory(null)}
      />

      {editingCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setEditingCategory(null)}
        >
          <div
            className="w-full max-w-2xl rounded-[28px] border border-slate-700 bg-[#071629] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                  Edit Category
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  {editingCategory.name}
                </h2>
              </div>

              <button
                type="button"
                className="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-400 hover:text-white"
                onClick={() => setEditingCategory(null)}
              >
                Close
              </button>
            </div>

            <CategoryForm
              onSubmit={handleUpdateCategory}
              defaultValues={{
                name: editingCategory.name,
                slug: editingCategory.slug,
              }}
              loading={editLoading.master}
              resetOnSuccess={false}
              submitText="Update Category"
            />
          </div>
        </div>
      )}

      {editingSubCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setEditingSubCategory(null)}
        >
          <div
            className="w-full max-w-4xl rounded-[28px] border border-slate-700 bg-[#071629] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                  Edit Subcategory
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  {editingSubCategory.name}
                </h2>
              </div>

              <button
                type="button"
                className="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-400 hover:text-white"
                onClick={() => setEditingSubCategory(null)}
              >
                Close
              </button>
            </div>

            {editingSubCategory.image && (
              <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                  Current Image
                </p>
                <img
                  src={editingSubCategory.image}
                  alt={editingSubCategory.name}
                  className="h-36 w-36 rounded-2xl object-cover"
                />
              </div>
            )}

            <SubCategoryForm
              onSubmit={handleUpdateSubCategory}
              defaultValues={{
                name: editingSubCategory.name,
                description: editingSubCategory.description,
                slug: editingSubCategory.slug,
                master_category: String(editingSubCategory.master_category),
              }}
              loading={editLoading.sub}
              resetOnSuccess={false}
              submitText="Update Subcategory"
            />
          </div>
        </div>
      )}
    </DashboardSection>
  );
};

export default ManageCategoryPage;
