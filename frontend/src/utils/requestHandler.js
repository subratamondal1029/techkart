const requestHandler = async (fn, message) => {
  try {
    return await fn();
  } catch (error) {
    const errorMessage = `Error: ${error.response?.data?.status || 500} - ${
      error.response?.data?.message || "Internal Server Error"
    }`;

    console.error(errorMessage);
    throw error.response?.data || error;
  }
};

export default requestHandler;
