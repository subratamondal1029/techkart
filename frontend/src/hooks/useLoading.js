import { useState, useCallback } from "react";

/**
 * A custom hook for show loading status and handle error during api call and asynchronous process.
 *
 * @param {Function} asyncFn - The callback function to fetch data.
 * @returns {[Function, boolean, string]} - Returns an array containing:
 *   - `run` (function): The async function that send by parameter with a wrapper.
 *   - `isLoading` (boolean): Whether data is currently being fetched.
 *   - `error` (string): Error message if the fetch fails.
 */

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
