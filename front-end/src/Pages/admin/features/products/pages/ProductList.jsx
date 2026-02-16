import React, { useState, useMemo, useEffect } from "react";
import { dummyProducts } from "../services/dummyProducts";
import FilterBar from "../components/FilterBar";
import ProductTable from "../components/ProductTable/ProductTable";
import AdminPagination from "../../../components/AdminPagination";

const ITEMS_PER_PAGE = 5;

const ProductList = () => {
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    category: "",
    status: "",
  });

  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const [page, setPage] = useState(1);

  // 🔥 Filtering Logic
  const filteredProducts = useMemo(() => {
    return dummyProducts.filter((product) => {
      const productDate = new Date(product.createdAt);

      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory = filters.category
        ? product.category === filters.category
        : true;

      const matchesStatus = filters.status
        ? product.status === filters.status
        : true;

      const matchesStart = dateRange.start
        ? productDate >= new Date(dateRange.start)
        : true;

      const matchesEnd = dateRange.end
        ? productDate <= new Date(dateRange.end)
        : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesStart &&
        matchesEnd
      );
    });
  }, [search, filters, dateRange]);

  // ✅ Pagination should use filtered data
  const totalPages = Math.ceil(
    filteredProducts.length / ITEMS_PER_PAGE
  );

  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [page, filteredProducts]);

  // ✅ Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, filters, dateRange]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
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
    setFilters({ category: "", status: "" });
    setDateRange({ start: "", end: "" });
  };

  return (
    <div className="space-y-6 pt-5">

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            name: "category",
            label: "Category",
            options: ["Electronics", "Clothing", "Shoes"],
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

      {/* 🔥 Now showing paginated filtered data */}
      <ProductTable
        products={paginatedData}
        onEdit={() => {}}
        onDelete={() => {}}
      />

      <AdminPagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
      />

    </div>
  );
};

export default ProductList;
