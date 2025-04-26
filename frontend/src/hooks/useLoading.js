import { useState, useCallback } from "react";

const useLoading = (asyncFn) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const run = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError("");
      try {
        return await asyncFn(...args);
      } catch (err) {
        console.error("useLoading :: error", err);
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFn]
  );

  return [run, isLoading, error];
};

export default useLoading;
