import { useEffect } from "react";
import { forwardRef, useId } from "react";
import { useFormContext } from "react-hook-form";
import getRules from "../../utils/getRules";
import { useState } from "react";

/**
 *
 * @param {React.TextareaHTMLAttributes<HTMLTextAreaElement>& {
 *   label: string,
 *   classname?: string,
 *   rules?: object,
 *   name?: string,
 * }} props
 */

const TextArea = ({
  label,
  classname = "",
  rules = { required: true },
  name = "",
  ...props
}) => {
  const Id = useId();
  const { register, formState: { errors } = {} } = useFormContext() || {};
  const error = errors?.[name]?.message;

  return (
    <div className="w-full relative flex flex-col items-center justify-center">
      {label && (
        <label
          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 my-3 ml-2 capitalize w-full text-left"
          htmlFor={Id}
        >
          <span>
            {label}: {rules.required && <span className="text-red-500">*</span>}
          </span>
        </label>
      )}
      <textarea
        className={`flex h-28 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-md placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 mt-1 ${classname} ${
          error ? "border-red-500" : ""
        }`}
        id={Id}
        {...register?.(name, getRules(rules, label))}
        {...props}
      ></textarea>
      {error && (
        <div className="absolute top-full mt-2 flex flex-col items-center z-10">
          <div className="w-3 h-3 rotate-45 bg-red-500 mb-[-6px]" />

          <div className="bg-red-500 text-white text-sm px-3 py-1 rounded shadow">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextArea;
