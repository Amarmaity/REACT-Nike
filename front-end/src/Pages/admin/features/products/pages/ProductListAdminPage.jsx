import React, { useEffect, useMemo, useState } from "react";
import FilterBar from "../components/FilterBar";
import ProductTable from "../components/ProductTable/ProductTable";
import ProductDetailsModal from "../components/ProductDetailsModal";
import AdminPagination from "../../../components/AdminPagination";
import api from "../../../../../api/axios";

const ITEMS_PER_PAGE = 5;

const ProductListAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [masterCategories, setMasterCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    master_category: "",
    sub_category: "",
    type: "",
    status: "",
  });
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setFeedback("");
      const response = await api.get("/product/");
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("PRODUCT LIST ERROR:", error.response?.data);
      setProducts([]);
      setFeedback("Unable to load products right now.");
    } finally {
      setLoading(false);
    }
  };

  const loadMasterCategories = async () => {
    try {
      const response = await api.get("/master-category/");
      setMasterCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("MASTER CATEGORY FILTER ERROR:", error.response?.data);
      setMasterCategories([]);
    }
  };

  useEffect(() => {
    loadProducts();
    loadMasterCategories();
  }, []);

  useEffect(() => {
    const loadFilterSubCategories = async () => {
      if (!filters.master_category) {
        setSubCategories([]);
        return;
      }

      try {
        const response = await api.get(
          `/sub-category/?master_category=${filters.master_category}`
        );
        setSubCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.log("SUBCATEGORY FILTER ERROR:", error.response?.data);
        setSubCategories([]);
      }
    };

    loadFilterSubCategories();
  }, [filters.master_category]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const createdAt = new Date(product.created_at);
      const searchableText = [
        product.name,
        product.slug,
        product.sku,
        product.master_category?.name,
        product.sub_category_details?.name,
        ...(product.tags || []),
        ...(product.variations || []).map((variation) => variation.sku),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = search
        ? searchableText.includes(search.toLowerCase())
        : true;

      const matchesMasterCategory = filters.master_category
        ? String(product.master_category?.id) === String(filters.master_category)
        : true;

      const matchesSubCategory = filters.sub_category
        ? String(product.sub_category) === String(filters.sub_category)
        : true;

      const matchesType = filters.type ? product.type === filters.type : true;

      const matchesStatus = filters.status
        ? (product.is_active ? "Active" : "Inactive") === filters.status
        : true;

      const matchesStart = dateRange.start
        ? createdAt >= new Date(dateRange.start)
        : true;

      const matchesEnd = dateRange.end
        ? createdAt <= new Date(`${dateRange.end}T23:59:59`)
        : true;

      return (
        matchesSearch &&
        matchesMasterCategory &&
        matchesSubCategory &&
        matchesType &&
        matchesStatus &&
        matchesStart &&
        matchesEnd
      );
    });
  }, [products, search, filters, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [page, filteredProducts]);

  useEffect(() => {
    setPage(1);
  }, [search, filters, dateRange]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "master_category" ? { sub_category: "" } : {}),
    }));
  };

  const handleDateChange = (type, value) => {
    setDateRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleClear = () => {
    setSearch("");
    setFilters({
      master_category: "",
      sub_category: "",
      type: "",
      status: "",
    });
    setDateRange({ start: "", end: "" });
    setSubCategories([]);
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Delete this product? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/product/${productId}/`);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      setSelectedProduct((prev) => (prev?.id === productId ? null : prev));
      setFeedback("Product deleted successfully.");
    } catch (error) {
      console.log("PRODUCT DELETE ERROR:", error.response?.data);
      setFeedback("Unable to delete the selected product.");
    }
  };

  return (
    <div className="space-y-6 pt-5">
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            name: "master_category",
            label: "Parent Category",
            options: masterCategories.map((category) => ({
              label: category.name,
              value: String(category.id),
            })),
          },
          {
            name: "sub_category",
            label: "Subcategory",
            options: subCategories.map((subCategory) => ({
              label: subCategory.name,
              value: String(subCategory.id),
            })),
          },
          {
            name: "type",
            label: "Type",
            options: [
              { label: "Simple", value: "simple" },
              { label: "Variable", value: "variable" },
            ],
          },
          {
            name: "status",
            label: "Status",
            options: ["Active", "Inactive"],
          },
        ]}
        filterValues={filters}
        onFilterChange={handleFilterChange}
        dateRange={dateRange}
        onDateChange={handleDateChange}
        onClear={handleClear}
      />

      <div className="flex items-center justify-between text-sm text-gray-400">
        <p>{loading ? "Loading products..." : `${filteredProducts.length} products found`}</p>
        {feedback && <p>{feedback}</p>}
      </div>

      <ProductTable
        products={paginatedData}
        onView={setSelectedProduct}
        onDelete={handleDelete}
      />

      <AdminPagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
      />

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default ProductListAdminPage;
