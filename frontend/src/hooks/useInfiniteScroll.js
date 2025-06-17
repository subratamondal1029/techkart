import { useState, useEffect, useRef, useCallback } from "react";
import useLoading from "./useLoading";

/**
 * A custom hook for implementing infinite scrolling using the Intersection Observer API.
 *
 * @param {Object} params - The parameters object.
 * @param {Function} params.cb - The callback function to fetch data. It should accept the current page number as an argument.
 * @param {number} [params.initialPage=0] - The initial page number (default: 0).
 * @param {...any} args - Additional arguments to pass to the callback function.
 * @returns {[number, boolean, string, Function, Function]} - Returns an array containing:
 *   - `loaderRef` (React.MutableRefObject): A reference to the loader element.
 *   - `page` (number): The current page number.
 *   - `isLoading` (boolean): Whether data is currently being fetched.
 *   - `error` (string): Error message if the fetch fails.
 *   - `retry` (Function): A function to retry fetching data in case of an error.
 *   - `setPage` (Function): A function to manually set the page number.
 */

const useInfiniteScroll = ({ cb, initialPage }, ...args) => {
  const [page, setPage] = useState(initialPage);
  const [fetchData, isLoading, error] = useLoading(cb);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const observerRef = useCallback((node) => {
    if (observerRef.currentInstance) {
      observerRef.currentInstance.disconnect();
    }

    if (node) {
      observerRef.currentInstance = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isLoadingRef.current) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold: 1 }
      );

      observerRef.currentInstance.observe(node);
    }
  }, []);
  observerRef.currentInstance = null;

  useEffect(() => {
    if (!page || page === initialPage) return;
    if (page < initialPage) {
      setPage(initialPage);
      return;
    }
    fetchData(page, ...args);
  }, [page, initialPage, fetchData, args]);

  const retry = useCallback(() => fetchData(page), [fetchData, page]);

  return [observerRef, page, isLoading, error, retry, setPage];
};

export default useInfiniteScroll;
