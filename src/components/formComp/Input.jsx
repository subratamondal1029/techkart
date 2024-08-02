import React, { forwardRef, useId } from "react";

 function Input({ type="text", label, required=true, classname="", error=false, ...props }, ref) {
  const Id = useId();

  return (
    <div className="w-full">
      <label
        className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-3 capitalize"
        htmlFor={Id}
      >
        { label }
      </label>
      <input
        className={`flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-md placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 mt-1 ${classname} ${error ? "border-red-500" : ""}`}
        type={type}
        id={Id}
       {...props}
       ref={ref}
      ></input>
      {required && <p className="mt-1 text-xs text-gray-500"><span className="text-red-500">*</span> This field is required</p>}
    </div>
  );
}

export default forwardRef(Input);
