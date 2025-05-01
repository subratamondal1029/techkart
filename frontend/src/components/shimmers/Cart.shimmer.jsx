import React from "react";

const CartShimmer = () => {
  return (
    <div className="mx-auto max-w-7xl px-2 lg:px-8 animate-pulse">
      <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
        {/* Shimmer for Cart Heading */}
        <h1 className="text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl bg-gray-200 h-8 w-48 rounded"></h1>

        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          {/* Shimmer for Cart Items */}
          <section
            aria-labelledby="cart-heading"
            className="rounded-lg bg-white lg:col-span-8"
          >
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            <ul role="list" className="divide-y divide-gray-200">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex py-6 sm:py-6">
                  {/* Product Image Shimmer */}
                  <div className="flex-shrink-0 h-24 w-24 sm:h-38 sm:w-38 bg-gray-200 rounded-md"></div>

                  {/* Product Details Shimmer */}
                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>
                        <div className="mt-3 flex items-end">
                          <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Remove Button Shimmer */}
                  <div className="mb-2 flex">
                    <div className="min-w-24 flex items-center">
                      <div className="h-7 w-7 bg-gray-200 rounded"></div>
                      <div className="mx-1 h-7 w-9 bg-gray-200 rounded"></div>
                      <div className="h-7 w-7 bg-gray-200 rounded"></div>
                    </div>
                    <div className="ml-6 flex text-sm">
                      <div className="h-5 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          </section>

          {/* Shimmer for Order Summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0"
          >
            <h2
              id="summary-heading"
              className="border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-300 bg-gray-200 h-6 w-32 rounded"
            ></h2>
            <div>
              <dl className="space-y-1 px-2 py-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-300 bg-gray-200 h-4 w-32 rounded"></dt>
                  <dd className="text-sm font-medium text-gray-300 bg-gray-200 h-4 w-16 rounded"></dd>
                </div>

                <div className="flex items-center justify-between py-4">
                  <dt className="flex text-sm text-gray-300 bg-gray-200 h-4 w-32 rounded"></dt>
                  <dd className="text-sm font-medium text-gray-300 bg-gray-200 h-4 w-16 rounded"></dd>
                </div>
                <div className="flex items-center justify-between border-y border-dashed py-4">
                  <dt className="text-base font-medium text-gray-300 bg-gray-200 h-5 w-32 rounded"></dt>
                  <dd className="text-base font-medium text-gray-300 bg-gray-200 h-5 w-16 rounded"></dd>
                </div>
              </dl>
              <div className="flex justify-between items-center gap-5">
                <div className="w-full h-10 bg-gray-200 rounded"></div>
                <div className="w-full h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default CartShimmer;
