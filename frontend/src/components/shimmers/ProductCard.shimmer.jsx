import React from "react";

const ProductCardShimmer = ({ ref = null }) => {
  return (
    <div
      className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-5 flex flex-col justify-between animate-pulse"
      ref={ref}
    >
      {/* Image Shimmer */}
      <div className="w-full h-48 bg-gray-200 rounded-lg"></div>

      {/* Title Shimmer */}
      <div className="mt-5">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>

        {/* Price and Button Shimmer */}
        <div className="flex items-center justify-between mt-5">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardShimmer;
