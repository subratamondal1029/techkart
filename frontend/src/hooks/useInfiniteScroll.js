import { useState, useEffect, useRef, useCallback } from "react";
import useLoading from "./useLoading";

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
