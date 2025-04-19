import React, { useId } from "react";
import { useFormContext } from "react-hook-form";

function Input({
  type = "text",
  label,
  classname = "",
  name = "",
  rules = { required: true },
  ...props
}) {
  const Id = useId();
  const { register, formState: { errors } = {} } = useFormContext() || {};

  const getRules = (rules) => {
    if (rules.required) {
      rules.required = `${name || "This Field"} is required`;
    }
    if (rules.minLength !== undefined && !isNaN(rules?.minLength)) {
      rules.minLength = {
        value: rules.minLength,
        message: `${name || "This Field"} must be at least ${
          rules.minLength
        } characters long`,
      };
    }
    if (rules.maxLength !== undefined && !isNaN(rules?.maxLength)) {
      rules.maxLength = {
        value: rules.maxLength,
        message: `${name || "This Field"} must be at most ${
          rules.maxLength
        } characters long`,
      };
    }
    if (rules.pattern !== undefined && rules.pattern?.message === undefined) {
      rules.pattern = {
        value: rules.pattern.value || rules.pattern,
        message: rules.pattern.message || `${name || "This Field"} is invalid`,
      };
    }

    return rules;
  };

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
      <input
        className={`flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-md placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${classname} ${
          errors?.[name] ? "border-red-500" : ""
        }`}
        type={type}
        id={Id}
        {...register?.(name, getRules(rules))}
        {...props}
      ></input>

      {errors?.[name] && (
        <div className="absolute top-full mt-2 flex flex-col items-center z-10">
          <div className="w-3 h-3 rotate-45 bg-red-500 mb-[-6px]" />

          <div className="bg-red-500 text-white text-sm px-3 py-1 rounded shadow">
            {errors?.[name]?.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default Input;
