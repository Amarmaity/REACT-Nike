import React from "react";
import { AdminButton } from "../../../components";

const FilterBar = ({
    searchValue,
    onSearchChange,
    filters = [],
    filterValues = {},
    onFilterChange,
    dateRange,
    onDateChange,
    onClear,
}) => {
    const handleDateDropdown = (value) => {
        const today = new Date();
        let start = "";
        let end = today.toISOString().split("T")[0];

        const newDate = new Date();

        switch (value) {
            case "today":
                start = end;
                break;

            case "7days":
                newDate.setDate(today.getDate() - 7);
                start = newDate.toISOString().split("T")[0];
                break;

            case "1month":
                newDate.setMonth(today.getMonth() - 1);
                start = newDate.toISOString().split("T")[0];
                break;

            case "6months":
                newDate.setMonth(today.getMonth() - 6);
                start = newDate.toISOString().split("T")[0];
                break;

            case "1year":
                newDate.setFullYear(today.getFullYear() - 1);
                start = newDate.toISOString().split("T")[0];
                break;

            case "all":
            default:
                start = "";
                end = "";
        }

        onDateChange("start", start);
        onDateChange("end", end);
    };

    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* Search */}
            <div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-gray-800 text-gray-300 px-3 py-2 rounded-md border border-gray-700 w-full lg:w-64"
                />
            </div>

            {/* Filters Section */}
            <div className="flex flex-wrap gap-4">
                {filters.map((filter) => (
                    <select
                        key={filter.name}
                        value={filterValues[filter.name] || ""}
                        onChange={(e) =>
                            onFilterChange(filter.name, e.target.value)
                        }
                        className="bg-gray-800 text-gray-300 px-3 py-2 rounded-md border border-gray-700"
                    >
                        <option value="">{`All ${filter.label}`}</option>
                        {filter.options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                ))}

                <select
                    onChange={(e) => handleDateDropdown(e.target.value)}
                    className="bg-gray-800 text-gray-300 px-3 py-2 rounded-md border border-gray-700"
                >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="1month">Last 1 Month</option>
                    <option value="6months">Last 6 Months</option>
                    <option value="1year">Last 1 Year</option>
                </select>

                <AdminButton onClick={onClear} text="Clear" />
            </div>
        </div>

    );
};
export default FilterBar;
