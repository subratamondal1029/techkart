import React, { useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button, Image, Input, LoadingError } from "../components";
import SellerTable from "../components/shimmers/SellerTable.shimmer";
import productService from "../services/product.service";
import { useEffect } from "react";
import { Search } from "lucide-react";
import useLoading from "../hooks/useLoading";

const Seller = () => {
  const [products, setProducts] = useState({});
  const [totalPages, setTotalPages] = useState(2);
  const [params, setParams] = useState({
    page: 1,
    query: "",
    sortBy: "price",
    sort: "d",
  });

  const parameterQuery = useMemo(() => {
    return `page=${params.page}&query=${params.query}&sortBy=${params.sortBy}&sort=${params.sort}`;
  }, [params]);

  const pages = useMemo(() => {
    const CURRENT_PAGE = params.page || 1;
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
  }, [params.page, totalPages]);

  const [fetchProducts, isProductLoading, productError] = useLoading(
    async () => {
      if (products?.[parameterQuery]) return;

      const { data } = await productService.getMany({
        ...params,
        isSeller: true,
      });

      setProducts((prev) => ({
        ...prev,
        [parameterQuery]: data.products,
      }));
      setTotalPages(data.totalPages);
    }
  );

  useEffect(() => {
    fetchProducts();
  }, [params]);

  return (
    <div className="bg-blue-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-lg p-4 text-center bg-white shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
            Total Products
            <br />
            <span className="italic">200</span>
          </div>
          <div className="border rounded-lg p-4 text-center bg-white shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
            Income
            <br />
            <span className="italic">NA</span>
          </div>
          <div className="border rounded-lg p-4 text-center bg-white shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
            Other
            <br />
            <span className="italic">NA</span>
          </div>
        </div>
        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row justify-center mb-4 gap-2 md:max-w-96 ml-auto mt-10">
          <form
            className="w-full relative"
            onSubmit={(e) => {
              e.preventDefault();
              setParams((prev) => ({
                ...prev,
                page: 1,
                query: e.target[0].value,
              }));
            }}
          >
            <Input type="text" placeholder="Search" />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              <Search
                size={17}
                className="transition-transform duration-300 hover:scale-110"
                color="#000"
              />
            </Button>
          </form>
          <Button classname="px-4 py-1 rounded flex items-center justify-center gap-2">
            <Plus size={16} /> Add
          </Button>
        </div>
        {isProductLoading ? (
          <SellerTable />
        ) : productError ? (
          <LoadingError error={productError} retry={fetchProducts} />
        ) : products?.[parameterQuery]?.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-60 py-10">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No products"
              className="w-24 h-24 mb-4 opacity-70"
            />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              No Products Found
            </h2>
            <p className="text-gray-500 mb-4 text-center">
              We couldn't find any products matching your search or filter.
            </p>
          </div>
        ) : (
          <>
            <div className="border-t border-gray-300 py-2 min-h-96">
              <div className="hidden md:grid grid-cols-8 gap-4 px-2 text-sm font-semibold mb-2">
                <div>Image</div>
                <div>Id</div>
                <div>Name</div>
                <div>Category</div>
                <div>Company</div>
                <div className="flex items-center justify-start gap-2">
                  <p>Price</p>
                  <p
                    onClick={() => {
                      setParams((prev) => ({
                        ...prev,
                        sort: prev.sort === "a" ? "d" : "a",
                      }));
                    }}
                    className="cursor-pointer transition-transform duration-300 hover:text-blue-600 hover:rotate-180"
                  >
                    ↑↓
                  </p>
                </div>
                <div>Stock</div>
                <div className="text-center">Actions</div>
              </div>

              {/* Responsive Table Rows */}
              {products?.[parameterQuery]?.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-2 md:grid-cols-8 gap-4 px-2 py-2 items-center border-t border-gray-200 hover:bg-blue-100 rounded text-xs sm:text-sm"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${item._id}`}
                    className="w-12 h-12 col-span-1"
                  >
                    <Image className="rounded" src={item.image} />
                  </Link>
                  {/* Id */}
                  <div
                    className="hidden md:block max-w-24 truncate"
                    title={item._id}
                  >
                    {item._id}
                  </div>
                  {/* Name */}
                  <div className="truncate max-w-xs" title={item.name}>
                    {item.name}
                  </div>
                  {/* Category */}
                  <div className="hidden md:block">{item.category}</div>
                  {/* Company */}
                  <div className="hidden md:block">{item.company}</div>
                  {/* Price */}
                  <div>
                    <span className="hidden md:inline">
                      {Math.round(Number(item.price)).toLocaleString("en-In")}
                    </span>
                    <span className="block md:hidden text-gray-700">
                      ₹{Math.round(Number(item.price)).toLocaleString("en-In")}
                      <span className="mx-1">×</span>
                      <span>{item.stock}</span>
                    </span>
                  </div>
                  {/* Stock */}
                  <div className="hidden md:block">{item.stock || "∞"}</div>
                  {/* Actions */}
                  <div className="flex gap-2 justify-evenly col-span-1">
                    <Link
                      to={`/product/edit/${item._id}`}
                      className="hover:bg-blue-200 p-1 rounded"
                    >
                      <Pencil size={16} className="text-blue-700" />
                    </Link>
                    <button className="hover:bg-red-200 p-1 rounded">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 justify-center mt-10">
              {params?.page > 1 && (
                <button
                  className="hover:bg-blue-200 px-2 py-1 rounded"
                  onClick={() =>
                    setParams((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
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
                      params.page === num && "bg-blue-200"
                    }`}
                    onClick={() => {
                      if (params.page !== num)
                        setParams((prev) => ({ ...prev, page: num }));
                    }}
                  >
                    {num}
                  </button>
                )
              )}
              {pages?.length > 1 && params?.page < totalPages && (
                <button
                  className="hover:bg-blue-200 px-2 py-1 rounded"
                  onClick={() =>
                    setParams((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                >
                  »
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Seller;
