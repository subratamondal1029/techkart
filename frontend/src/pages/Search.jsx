import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoadingError, ProductCard, ProductNotFound } from "../components";
import ProductCardShimmer from "../components/shimmers/ProductCard.shimmer";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import productService from "../services/product.service";
import { addQuery } from "../store/search.slice";
import { LoaderCircleIcon } from "lucide-react";

const createCacheQuery = ({ query, category, company, sort, sortBy }) => {
  return `query=${query}&category=${category}&company=${company}&sort=${sort}&sortBy=${sortBy}`;
};

const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchCache = useSelector((state) => state.search.cache);
  const [isEmptyResponse, setIsEmptyResponse] = useState(false);

  const params = useMemo(
    () => ({
      query: searchParams.get("query")?.trim().toLowerCase() || "",
      category: searchParams.get("category")?.trim().toLowerCase() || "",
      company: searchParams.get("company")?.trim().toLowerCase() || "",
      sort: searchParams.get("sort")?.trim().toLowerCase() || "",
      sortBy: searchParams.get("sortBy")?.trim().toLowerCase() || "",
    }),
    [searchParams]
  );

  const { storedProducts, storedInitialPage } = useMemo(() => {
    const query = createCacheQuery(params);
    const cache = searchCache?.[query];

    if (!cache) return { storedInitialPage: 1, storedProducts: [] };
    const products = Object.values(cache).flat(1);
    const initialPage = Number(Object.keys(cache).at(-1)) + 1;

    return { storedInitialPage: initialPage, storedProducts: products };
  }, [params]);

  const [products, setProducts] = useState(storedProducts);
  const initialPage = useRef(storedInitialPage);
  const totalPages = useRef(storedInitialPage + 1 || 2);

  useEffect(() => {
    setProducts([]);
    setIsEmptyResponse(false);
    initialPage.current = 1;
  }, [params]);

  useEffect(() => {
    const query = createCacheQuery(params);
    const cache = searchCache?.[query];

    if (!cache) return;

    const products = Object.values(cache).flat(1);
    setProducts(products);
  }, [params, searchCache, setProducts]);

  const sortData = (sortBy, sort) => {
    const searchParams = createCacheQuery({
      ...params,
      sortBy,
      sort,
    });
    navigate(`/search?${searchParams}`);
  };

  const fetchProducts = async ({ page, ...args }) => {
    if (!page) return;

    const { data } = await productService.getMany({
      ...args,
      page,
    });

    totalPages.current = Number(data?.totalPages) || 1;

    if (data.products.length !== 0) {
      setIsEmptyResponse(false);

      // store data in cache
      dispatch(
        addQuery({
          page,
          query: createCacheQuery(args),
          data: data.products,
        })
      );
    } else {
      if (products.length > 0) return;
      setIsEmptyResponse(true);
    }
  };

  const {
    sentinelRef: observerRef,
    page,
    isLoading: isProductsLoading,
    error: productError,
    retry: productRetry,
  } = useInfiniteScroll(fetchProducts, params, initialPage.current);

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
                onChange={(e) => {
                  sortData("price", e.target.value);
                }}
              >
                <option hidden>Default</option>
                <option value="a">Low to High</option>
                <option value="d">High to Low</option>
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
        (page - 1 < totalPages.current || isProductsLoading) &&
        (page === 1 ? (
          <div className="w-full flex flex-wrap items-start justify-evenly gap-3 gap-y-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductCardShimmer key={i} ref={i === 0 ? observerRef : null} />
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center items-center">
            <LoaderCircleIcon
              size={40}
              className="animate-spin"
              ref={observerRef}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Search;
