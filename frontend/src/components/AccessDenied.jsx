import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const AccessDenied = ({message}) => {
  return (
    <div className="text-center flex justify-center items-center flex-col">
      <h1 className="font-bold text-3xl pt-20 min-h-64">
        To access this page you need to be a {message}
      </h1>
      <Link
        to="/"
        type="button"
        className="inline-flex items-center rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        <ArrowLeft size={16} className="mr-2" />
        Go back
      </Link>
    </div>
  );
};

export default AccessDenied;
