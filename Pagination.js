import React from "react";
import { usePosts } from "./PostsContext";

function Pagination() {
  const { currentPage, totalPages, setPage } = usePosts();

  const handlePrevious = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setPage(currentPage + 1);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Posts pagination">
      <button
        className="pagination-arrow"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        &laquo;
      </button>

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`pagination-number ${pageNumber === currentPage ? "active" : ""}`}
          onClick={() => setPage(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      <button
        className="pagination-arrow"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        &raquo;
      </button>
    </nav>
  );
}

export default Pagination;
