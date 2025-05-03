import React from "react";
import { Link } from "react-router-dom";

const Maintenance = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          We'll be back soon!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Our website is currently undergoing scheduled maintenance. We
          apologize for the inconvenience and appreciate your patience.
        </p>
        <p className="text-gray-500 mb-8">
          If you have any urgent queries, feel free to{" "}
          <Link to="/contact" className="text-blue-500 underline">
            contact us
          </Link>
          .
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Maintenance;
