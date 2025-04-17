import { useState } from "react";

const useLoading = (asyncFn) => {
  const [isLoading, setIsLoading] = useState(false);

  const run = async (...args) => {
    setIsLoading(true);
    try {
      return await asyncFn(...args);
    } finally {
      setIsLoading(false);
    }
  };

  return [run, isLoading];
};

export default useLoading;
