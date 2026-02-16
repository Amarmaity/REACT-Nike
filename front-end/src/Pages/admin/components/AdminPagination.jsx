import React from "react";

const AdminPagination = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; 

        let start = Math.max(currentPage - 2, 1);
        let end = Math.min(start + maxVisible - 1, totalPages);

        if (end - start < maxVisible - 1) {
            start = Math.max(end - maxVisible + 1, 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="flex justify-between items-center mt-6">

            {/* Left Info */}
            <p className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
            </p>

            {/* Pagination Buttons */}
            <div className="flex gap-2">

                {/* Previous */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="px-3 py-1 rounded-md bg-gray-800 text-gray-300 border border-gray-700 disabled:opacity-40 hover:bg-gray-700"
                >
                    Prev
                </button>

                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 rounded-md border ${currentPage === page
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Next */}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-3 py-1 rounded-md bg-gray-800 text-gray-300 border border-gray-700 disabled:opacity-40 hover:bg-gray-700"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
export default AdminPagination;
