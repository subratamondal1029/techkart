const requestHandler = async (fn, message) => {
  try {
    return await fn();
  } catch (error) {
    const errorMessage = `${message} :: 
    ${JSON.stringify(error.response?.data || error)} ::
     ${error.stack}`;

    console.error(errorMessage);
    throw error.response?.data || error;
  }
};

export default requestHandler;
