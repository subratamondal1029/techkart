import { useState, useEffect, useRef, useCallback } from "react";
import useLoading from "./useLoading";

/**
 * A custom hook for implementing infinite scrolling using the Intersection Observer API.
 *
 * @param {Function} cb - The callback function to fetch data. It should accept the current page number as an argument.
 * @param {React.RefObject<HTMLElement>} loaderRef - A React ref pointing to the loader element that triggers the next page load when visible.
 * @param {...any} args - Additional arguments to pass to the callback function.
 * @returns {[number, boolean, string, Function, Function]} - Returns an array containing:
 *   - `page` (number): The current page number.
 *   - `isLoading` (boolean): Whether data is currently being fetched.
 *   - `error` (string): Error message if the fetch fails.
 *   - `retry` (Function): A function to retry fetching data in case of an error.
 *   - `setPage` (Function): A function to manually set the page number.
 */

const useInfiniteScroll = (cb, loaderRef, ...args) => {
  const [page, setPage] = useState(0);

  const [fetchData, isLoading, error] = useLoading(cb);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);
  useEffect(() => {
    if (error) return;

    const observer = new IntersectionObserver(
      ([entries]) => {
        if (entries.isIntersecting && !isLoadingRef.current) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const target = loaderRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) {
        observer.unobserve(target);
        observer.disconnect();
      }
    };
  }, [error]);

  useEffect(() => {
    if (!page) return;
    fetchData(page, ...args);
  }, [page]);

  const retry = useCallback(() => fetchData(page), [fetchData, page]);

  return [page, isLoading, error, retry, setPage];
};

export default useInfiniteScroll;
