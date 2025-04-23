import React, { useEffect, useState } from "react";
import resistanceBand from "../assets/resistance-band.svg";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useRouteError } from "react-router-dom";

const errorDetails = {
  404: {
    status: "404",
    title: "We can't find that page",
    message:
      "Sorry, the page you are looking for doesn't exist or has been removed.",
  },
  500: {
    status: "500",
    title: "Something went wrong",
    message:
      "Sorry, something went wrong on our end. Please try again or contact us if the problem persists.",
  },
};

const Error = () => {
  const navigate = useNavigate();
  const routerError = useRouteError();
  const [error, setError] = useState(errorDetails[404]);

  const back = () => {
    const history = window.history;
    if (history.length > 1) {
      history.back();
    } else navigate("/");
  };

  useEffect(() => {
    if (!routerError) return;
    setError(errorDetails[routerError?.status] || errorDetails[500]);
  }, [routerError]);

  return (
    <div className="py-12 flex items-center justify-center px-2 md:py-24 md:px-0">
      <div className="lg:flex lg:items-center lg:space-x-10">
        <img
          src={resistanceBand}
          alt="question-mark"
          className="h-[300px] w-auto"
        />
        <div>
          <p className="mt-6 text-3xl font-semibold text-black">
            {error.status}
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800 md:text-3xl">
            {error.title}
          </h1>
          <p className="mt-4 text-gray-500">{error.message}</p>
          <div className="mt-6 flex items-center space-x-3">
            <button
              onClick={back}
              type="button"
              className="inline-flex items-center rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <ArrowLeft size={16} className="mr-2" />
              Go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
