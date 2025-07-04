import React from "react";
import ButtonLoading from "./ButtonLoading";

/**
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */

const Button = ({
  children,
  type = "button",
  classname = "",
  loader = false,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`max-h-10 inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium px-4 py-2 text-sm text-white shadow-sm transition-colors duration-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-gray-500 ${classname}`}
      {...props}
    >
      {loader ? <ButtonLoading fillColor="fill-white" /> : children}
    </button>
  );
};

export default Button;
