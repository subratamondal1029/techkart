import React from "react";

const ProductShimmer = () => {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center gap-20 p-5 px-5 sm:px-20 mt-5 xl:flex-row flex-col lg:items-center animate-pulse">
      {/* Back Button Placeholder */}
      <div className="absolute top-20 left-4 w-32 h-8 bg-gray-200 rounded"></div>

      {/* Image Placeholder */}
      <div className="w-full max-w-[400px] h-[400px] bg-gray-200 rounded-lg"></div>

      {/* Product Details Placeholder */}
      <div className="w-full h-full flex justify-start flex-col items-start gap-3">
        {/* Company Name Placeholder */}
        <div className="w-48 h-6 bg-gray-200 rounded"></div>

        {/* Product Name Placeholder */}
        <div className="w-64 h-8 bg-gray-200 rounded"></div>

        {/* Description Placeholder */}
        <div className="w-full h-20 bg-gray-200 rounded"></div>

        {/* Price Placeholder */}
        <div className="w-32 h-8 bg-gray-200 rounded"></div>

        <hr className="w-full my-4" />

        {/* Additional Info Placeholder */}
        <div className="py-6 w-full">
          <ul className="space-y-5 pb-1 text-sm">
            <li className="w-32 h-4 bg-gray-200 rounded"></li>
            <li className="w-48 h-4 bg-gray-200 rounded"></li>
            <li className="w-full h-8 bg-gray-200 rounded"></li>
          </ul>
        </div>

        <hr className="w-full my-4" />

        {/* Quantity and Add to Cart Placeholder */}
        <div className="flex gap-3 items-center xl:w-3/4 mt-3 md:w-2/4 w-full sm:w-3/4">
          {/* Quantity Selector Placeholder */}
          <div className="w-full h-12 bg-gray-200 rounded-lg"></div>

          {/* Add to Cart Button Placeholder */}
          <div className="w-3/4 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductShimmer;
