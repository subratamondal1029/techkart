import { useState, useEffect, useRef, useCallback } from "react";
import useLoading from "./useLoading";

function useInfiniteScroll(fetchPage, args = {}, initialPage = 1) {
  const [page, setPage] = useState(initialPage);
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);

  const [load, isLoading, error] = useLoading(async () => {
    if (loadingRef.current) return;
    console.log("Fetching page", page);

    await fetchPage({ page, ...args });
    setPage((p) => p + 1);
  });

  useEffect(() => {
    loadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    setPage(initialPage);
  }, [args]);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingRef.current) load();
    });
    if (sentinelRef.current) io.observe(sentinelRef.current);
    return () => io.disconnect();
  });

  const retry = useCallback(() => {
    load();
  }, [load]);

  return { sentinelRef, page, isLoading, error, retry };
}

export default useInfiniteScroll;
