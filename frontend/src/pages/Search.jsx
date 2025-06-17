import { useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoadingError, ProductCard, ProductNotFound } from "../components";
import ProductCardShimmer from "../components/shimmers/ProductCard.shimmer";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import productService from "../services/product.service";
import { addQuery } from "../store/search.slice";

const createCacheQuery = ({ query, category, company, sort, sortBy }) => {
  return `query=${query}&category=${category}&company=${company}&sort=${sort}&sortBy=${sortBy}`;
};

const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [params, setParams] = useState({});
  const [initialPage, setInitialPage] = useState(0);
  const totalPages = useRef(2);
  const searchCache = useSelector((state) => state.search.cache);
  const [products, setProducts] = useState([]);
  const [isEmptyResponse, setIsEmptyResponse] = useState(false);

  // get products from cache
  const fetchProductFromCache = useCallback(
    async (page) => {
      const query = createCacheQuery(params);
      const data = searchCache?.[query]?.[page];

      let products = [];

      if (data) {
        products = Object.values(data).flat(1);
      }

      return { products, totalPages: page + 1 };
    },
    [params, searchCache]
  );

  const fetchProducts = useCallback(
    async (page) => {
      if (!page) return;
      let data;

      const cacheData = await fetchProductFromCache(page);
      data = cacheData;

      if (cacheData?.products?.length === 0) {
        const { data: DBData } = await productService.getMany({
          ...params,
          page,
        });
        data = DBData;
      }

      totalPages.current = Number(data?.totalPages) || 1;
      console.log(
        `Total Available Pages: ${totalPages.current} and current page is ${page}`
      );

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

      setInitialPage(page);
    },
    [dispatch, fetchProductFromCache, params]
  );

  // Store all request params in state
  useEffect(() => {
    const query = searchParams.get("query")?.trim().toLowerCase() || "";
    const category = searchParams.get("category")?.trim().toLowerCase() || "";
    const company = searchParams.get("company")?.trim().toLowerCase() || "";
    const sort = searchParams.get("sort")?.trim().toLowerCase() || "";
    const sortBy = searchParams.get("sortBy")?.trim().toLowerCase() || "";

    const newParams = {
      query,
      category,
      company,
      sort,
      sortBy,
    };

    setParams((prev) => ({ ...prev, ...newParams }));
    // FIXME: initial page is not taking
    setInitialPage(0);
  }, [searchParams]);

  const [observerRef, page, isProductsLoading, productError, productRetry] =
    useInfiniteScroll({
      cb: fetchProducts,
      initialPage,
    });

  const sortData = (sortBy, sort) => {
    const searchParams = createCacheQuery({
      ...params,
      sortBy,
      sort,
    });
    navigate(`/search?${searchParams}`);
  };

  useEffect(() => {
    const query = createCacheQuery(params);
    const cache = searchCache?.[query];

    if (!cache) return;

    const products = Object.values(cache).flat(1);
    setProducts(products);
    setInitialPage(Number(Object.keys(cache).at(-1)));
  }, [params, searchCache, setProducts]);

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
