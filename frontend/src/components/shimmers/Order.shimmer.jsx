import React from "react";

const OrderShimmer = () => {
  return (
    <div className="mx-auto my-4 max-w-4xl md:my-6">
      <div className="overflow-hidden rounded-xl border border-gray-100 shadow">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product List Shimmer */}
          <div className="px-5 py-6 md:border-r md:border-r-gray-200 md:px-8">
            <div className="flow-root">
              <ul className="-my-7 divide-y divide-gray-200">
                {Array.from({ length: 3 }).map((_, index) => (
                  <li
                    key={index}
                    className="flex items-stretch justify-between space-x-5 py-7 animate-pulse"
                  >
                    <div className="flex flex-1 items-stretch">
                      <div className="h-20 w-20 rounded-lg bg-gray-200"></div>
                      <div className="ml-5 flex flex-col justify-between">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="mt-4 h-4 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="ml-auto flex flex-col items-end justify-between">
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </li>
                ))}
              </ul>
              <hr className="mt-6 border-gray-200" />
              <ul className="mt-6 space-y-3">
                <li className="flex items-center justify-between animate-pulse">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </li>
                <li className="flex items-center justify-between animate-pulse">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </li>
              </ul>
            </div>
          </div>
          {/* Contact Info Shimmer */}
          <div className="px-5 py-6 md:px-8">
            <div className="flow-root">
              <div className="-my-6 divide-y divide-gray-200">
                <div className="py-6 animate-pulse">
                  <div className="h-5 w-40 bg-gray-200 rounded"></div>
                  <div className="mt-3 h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="mt-2 h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="py-6 animate-pulse">
                  <div className="h-5 w-40 bg-gray-200 rounded"></div>
                  <div className="mt-3 h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="mt-2 h-4 w-40 bg-gray-200 rounded"></div>
                  <div className="mt-2 h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="py-6 animate-pulse">
                  <div className="h-5 w-40 bg-gray-200 rounded"></div>
                  <div className="mt-3 h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderShimmer;
