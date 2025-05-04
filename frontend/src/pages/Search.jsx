import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoadingError, ProductCard } from "../components";
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
    <div className="w-full min-h-screen mt-10">
      {products.length === 0 && isEmptyResponse && (
        <div className="w-full max-w-xl mx-auto mt-16 p-6 text-center bg-white rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No Products Found
          </h2>
          <p className="text-gray-600 text-lg">
            We couldn’t find anything for{" "}
            <span className="text-black font-bold">
              "{searchParams.get("query") || "your search"}"
            </span>
            .
          </p>
          <p className="text-gray-500 mt-2">
            Try using different keywords or checking your spelling.
          </p>
        </div>
      )}
      {products.length > 0 && (
        <div className="w-full flex flex-wrap items-start justify-evenly gap-3 gap-y-10 mb-5">
          {products.map((product) => (
            <ProductCard key={product?._id} product={product} />
          ))}
        </div>
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
