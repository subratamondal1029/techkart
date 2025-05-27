import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  LoadingError,
  ProductCard,
  ProductNotFound,
} from "../components";
import ProductCardShimmer from "../components/shimmers/ProductCard.shimmer";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import productService from "../services/product.service";
import { addQuery } from "../store/search.slice";

const createCacheQuery = ({ query, category, company, sort, sortBy }) => {
  return `query=${query}&category=${category}&company=${company}&sort=${sort}&sortBy=${sortBy}`;
};

const Search = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [params, setParams] = useState({});
  const [initialPage, setInitialPage] = useState(0);
  const totalPages = useRef(1);
  const searchCache = useSelector((state) => state.search.cache);
  const [products, setProducts] = useState([]);
  const [isEmptyResponse, setIsEmptyResponse] = useState(false);

  const fetchProducts = useCallback(
    async (page) => {
      if (!page) return;
      console.log("Fetching products", page);
      const { data } = await productService.getMany({
        ...params,
        page: page,
        sortBy: params.sortBy || "createdAt",
        sort: params.sort || "d",
      });

      totalPages.current = Number(data.totalPages) || 1;

      if (data.products.length !== 0) {
        setIsEmptyResponse(false);

        // store data in cache
        dispatch(
          addQuery({
            page,
            query: createCacheQuery(params),
            data: data.products,
          })
        );
      } else {
        setIsEmptyResponse(true);
      }
    },
    [params]
  );

  // Store all request params in state
  useEffect(() => {
    const query = searchParams.get("query")?.trim().toLowerCase() || "";
    const category = searchParams.get("category")?.trim().toLowerCase() || "";
    const company = searchParams.get("company")?.trim().toLowerCase() || "";
    const sort = searchParams.get("sort")?.trim().toLowerCase() || "d";
    const sortBy =
      searchParams.get("sortBy")?.trim().toLowerCase() || "createdAt";

    const newParams = {
      query,
      category,
      company,
      sort,
      sortBy,
    };

    setParams((prev) => ({ ...prev, ...newParams }));
  }, [searchParams]);

  // get data from cache
  useEffect(() => {
    const query = createCacheQuery(params);
    const data = searchCache?.[query];
    if (!data) {
      setProducts([]);
      setIsEmptyResponse(false);
      return;
    }

    const lastPage = Number(Object.keys(data).at(-1));
    setInitialPage(lastPage);
    const products = Object.values(data).flat(1);
    setProducts(products);
  }, [searchCache, params]);

  const [observerRef, page, isProductsLoading, productError, productRetry] =
    useInfiniteScroll({
      cb: fetchProducts,
      initialPage,
    });

  useEffect(() => {
    if (products.length === 0 && !isEmptyResponse) {
      productRetry();
    }
  }, [params?.query, products]);

  return (
    <div className="w-full min-h-screen">
      {products.length === 0 && isEmptyResponse && <ProductNotFound />}
      {products.length > 0 && (
        <>
          {/* add sort and filter */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-end sm:space-x-6 space-y-4 sm:space-y-0 mt-4 px-4 sm:px-10">
            {/* Price Filter */}
            <div className="flex items-center space-x-3">
              <label
                htmlFor="price"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Price:
              </label>
              <select
                id="price"
                name="price"
                className="w-40 h-10 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 shadow-sm transition-colors duration-200"
                value={params?.sortBy === "price" ? params?.sort : "Default"}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    sortBy: "price",
                    sort: e.target.value,
                  }))
                }
              >
                <option hidden>Default</option>
                <option value="a">Low to High</option>
                <option value="d">High to Low</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center space-x-3">
              <label
                htmlFor="sortBy"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Sort:
              </label>
              <select
                id="sortBy"
                name="sortBy"
                className="w-40 h-10 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 shadow-sm transition-colors duration-200"
                value={
                  params?.sortBy === "createdAt" ? params?.sort : "Default"
                }
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    sortBy: "createdAt",
                    sort: e.target.value,
                  }))
                }
              >
                <option hidden>Default</option>
                <option value="d">Newest</option>
                <option value="a">Oldest</option>
              </select>
            </div>
          </div>

          <div className="w-full flex flex-wrap items-start justify-evenly gap-3 gap-y-10 mt-5">
            {products.map((product) => (
              <ProductCard key={product?._id} product={product} />
            ))}
          </div>
        </>
      )}
      {productError ? (
        <LoadingError error={productError} retry={productRetry} />
      ) : (
        (page !== totalPages.current || isProductsLoading) && (
          <div className="w-full flex flex-wrap items-start justify-evenly gap-3 gap-y-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductCardShimmer key={i} ref={i === 0 ? observerRef : null} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Search;
