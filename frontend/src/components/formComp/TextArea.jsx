import { forwardRef, useId } from "react";

function TextArea({ label, required=true, error=false, ...props }, ref) {
    const Id = useId();
  
    return (
      <div className="w-full">
        <label
          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-3"
          htmlFor={Id}
        >
         { label}
        </label>
        <textarea
          className={`flex h-28 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-md placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 mt-1 ${error ? "border-red-500" : ""}`}
          id={Id}
         {...props}
         ref={ref}
        ></textarea>
        {required && <p className="mt-1 text-xs text-gray-500"> <span className="text-red-500">*</span> This field is required</p>}
      </div>
    );
  }
  
  export default forwardRef(TextArea);