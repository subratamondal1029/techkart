import React, { useMemo, useState } from "react";

const Pagination = ({ page, setPage, totalPages, children }) => {
  const pages = useMemo(() => {
    const CURRENT_PAGE = page || 1;
    const MAX_PAGES = totalPages || 1;
    const MAX_PAGE_DISPLAY = 4;

    if (MAX_PAGES <= MAX_PAGE_DISPLAY + 2) {
      return Array.from({ length: MAX_PAGES }, (_, i) => i + 1);
    }

    const pages = [];

    if (CURRENT_PAGE <= MAX_PAGE_DISPLAY) {
      pages.push(1, 2, 3, 4, "...", MAX_PAGES);
    } else if (CURRENT_PAGE >= MAX_PAGES - 3) {
      pages.push(
        1,
        "...",
        MAX_PAGES - 3,
        MAX_PAGES - 2,
        MAX_PAGES - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        "...",
        CURRENT_PAGE - 1,
        CURRENT_PAGE,
        CURRENT_PAGE + 1,
        MAX_PAGES
      );
    }

    return pages;
  }, [page, totalPages]);

  return (
    <>
      {children}
      <div className="flex flex-wrap gap-2 justify-center mt-10">
        {page > 1 && (
          <button
            className="hover:bg-blue-200 px-2 py-1 rounded"
            onClick={() => setPage(page - 1)}
          >
            «
          </button>
        )}
        {pages?.map((num, idx) =>
          num === "..." ? (
            <span key={`ellipsis-${idx}`}>...</span>
          ) : (
            <button
              key={num}
              className={`px-2 py-1 border border-gray-300 rounded hover:bg-blue-200 ${
                page === num && "bg-blue-200"
              }`}
              onClick={() => {
                if (page !== num) setPage(num);
              }}
            >
              {num}
            </button>
          )
        )}
        {pages?.length > 1 && page < totalPages && (
          <button
            className="hover:bg-blue-200 px-2 py-1 rounded"
            onClick={() => setPage(page + 1)}
          >
            »
          </button>
        )}
      </div>
    </>
  );
};

export default Pagination;
